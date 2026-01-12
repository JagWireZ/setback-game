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

  const item = await getItem({
    client: dynamo.client,
    tableName: dynamo.tableName,
    gameId
  });

  if (!item) {
    throw new Error("Game not found");
  }

  let { state, priv, version } = item;

  const playerId = validateIdentity({ auth, priv });

  //
  // 1. Must be in BIDDING phase
  //
  assertPhase(state, PHASES.BIDDING);

  //
  // 2. Must be at WAITING_FOR_PLAYER step
  //
  assertStep(state, STEPS[PHASES.BIDDING].WAITING_FOR_PLAYER);

  //
  // 3. Must be this player's turn
  //
  assertTurn(state, playerId);

  //
  // 4. Apply bid (with optional trip)
  //
  state = submitBid(state, { playerId, bid, trip });

  //
  // 5. Advance to next bidding step
  //
  state = advance(state);

  //
  // 6. Persist
  //
  await putItem({
    client: dynamo.client,
    tableName: dynamo.tableName,
    item: {
      gameId,
      state,
      priv,
      version: version + 1
    }
  });

  //
  // 7. Return clean state
  //
  return {
    gameId,
    state: cleanState(state, playerId)
  };
};
