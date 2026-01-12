import { getItem } from "../data/getItem.mjs";
import { putItem } from "../data/putItem.mjs";
import { validateIdentity } from "../helpers/validateIdentity.mjs";
import { cleanState } from "../helpers/cleanState.mjs";
import { assertPhase, assertStep, assertTurn } from "../engine/validate.mjs";
import { PHASES, STEPS, advance } from "../engine/stateMachine.mjs";
import { submitBid } from "../engine/rules.mjs";

export const apply = async ({ payload, auth, dynamo }) => {
  const { gameId, bid, trip = false } = payload;

  if (!gameId) {
    throw new Error("gameId is required");
  }

  if (typeof bid !== "number" || !Number.isInteger(bid) || bid < 0) {
    throw new Error("Invalid bid");
  }

  if (typeof trip !== "boolean") {
    throw new Error("trip must be a boolean");
  }

  const item = await getItem({
    client: dynamo.client,
    tableName: dynamo.tableName,
    gameId
  });

  if (!item) {
    throw new Error("Game not found");
  }

  let { state, priv } = item;

  const playerId = validateIdentity({ auth, priv });

  //
  // Ensure player is actually in the game
  //
  if (!state.players.some(p => p.playerId === playerId)) {
    throw new Error("Player not in this game");
  }

  //
  // 1. Must be in BIDDING phase
  //
  assertPhase(state, PHASES.BIDDING);

  //
  // 2. Must be at WAITING_FOR_PLAYER step
  //
  assertStep(state, STEPS.BIDDING.WAITING_FOR_PLAYER);

  //
  // 3. Must be this player's turn
  //
  assertTurn(state, playerId);

  //
  // 4. Bid must not exceed hand size
  //
  const round = state.options.rounds[state.phase.roundIndex];
  if (bid > round.cards) {
    throw new Error("Bid exceeds hand size");
  }

  //
  // 5. Apply bid (with optional trip)
  //
  state = submitBid(state, { playerId, bid, trip });

  //
  // 6. Advance to next bidding step
  //
  state = advance(state);

  //
  // 7. Increment version
  //
  state.version += 1;

  //
  // 8. Persist
  //
  await putItem({
    client: dynamo.client,
    tableName: dynamo.tableName,
    item: {
      gameId,
      state,
      priv
    }
  });

  //
  // 9. Return clean state
  //
  return {
    gameId,
    state: cleanState(state, playerId)
  };
};
