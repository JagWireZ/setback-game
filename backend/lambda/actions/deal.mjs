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

  let { state, priv } = item;

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
  assertStep(state, STEPS.DEALING.SHUFFLING);

  //
  // 4. Prevent double-deal
  //
  if (state.cards.hands && Object.values(state.cards.hands).some(h => h.length > 0)) {
    throw new Error("Cards already dealt");
  }

  //
  // 5. Shuffle + deal
  //
  state = dealCards(state);

  //
  // 6. Advance → DEALING_CARDS
  //
  state = advance(state);

  //
  // 7. Advance → REVEALING_TRUMP
  //
  state = advance(state);

  //
  // 8. Reveal trump
  //
  state = revealTrump(state);

  //
  // 9. Advance → BIDDING.WAITING_FOR_PLAYER
  //
  state = advance(state);

  //
  // 10. Increment version
  //
  state.version += 1;

  //
  // 11. Persist
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
  // 12. Return clean state
  //
  return {
    gameId,
    state: cleanState(state, playerId)
  };
};
