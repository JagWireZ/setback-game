import { getItem } from "../data/getItem.mjs";
import { putItem } from "../data/putItem.mjs";
import { validateIdentity } from "../helpers/validateIdentity.mjs";
import { cleanState } from "../helpers/cleanState.mjs";
import { assertPhase, assertStep } from "../engine/validate.mjs";
import { PHASES, STEPS, advance } from "../engine/stateMachine.mjs";
import { dealCards, revealTrump } from "../engine/round.mjs";

export const apply = async ({ payload, auth, dynamo }) => {
  const { gameId } = payload;

  if (!gameId) {
    throw new Error("gameId is required");
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
  // 1. Only owner can deal
  //
  if (state.ownerId !== playerId) {
    throw new Error("Only the game creator can deal");
  }

  //
  // 2. Must be in DEALING phase
  //
  assertPhase(state, PHASES.DEALING);

  //
  // 3. Must be at SHUFFLING step
  //
  assertStep(state, STEPS[PHASES.DEALING].SHUFFLING);

  //
  // 4. Shuffle + deal
  //
  state = dealCards(state);

  //
  // 5. Advance → DEALING_CARDS
  //
  state = advance(state);

  //
  // 6. Advance → REVEALING_TRUMP
  //
  state = advance(state);

  //
  // 7. Reveal trump
  //
  state = revealTrump(state);

  //
  // 8. Advance → BIDDING.WAITING_FOR_PLAYER
  //
  state = advance(state);

  //
  // 9. Persist
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
  // 10. Return clean state
  //
  return {
    gameId,
    state: cleanState(state, playerId)
  };
};
