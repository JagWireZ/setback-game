import { getItem } from "../data/getItem.mjs";
import { putItem } from "../data/putItem.mjs";
import { validateIdentity } from "../helpers/validateIdentity.mjs";
import { cleanState } from "../helpers/cleanState.mjs";
import { assertPhase, assertStep } from "../engine/validate.mjs";
import { PHASES, STEPS, advance } from "../engine/stateMachine.mjs";
import { scoreRound } from "../engine/scoring.mjs";
import {
  clearBooksAndTricks,
  clearDeck,
  setNextDealer,
  prepareNextRound
} from "../engine/round.mjs";

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
  // 1. Only owner can advance the round
  //
  if (state.ownerId !== playerId) {
    throw new Error("Only the game creator can advance after a round");
  }

  //
  // 2. Must be in POST_ROUND phase
  //
  assertPhase(state, PHASES.POST_ROUND);

  //
  // 3. Must be at CALCULATING_SCORES step
  //
  assertStep(state, STEPS[PHASES.POST_ROUND].CALCULATING_SCORES);

  //
  // 4. Score the round
  //
  state = scoreRound(state);

  //
  // 5. Advance → CLEAR_BOOKS
  //
  state = advance(state);

  //
  // 6. Clear books + trick
  //
  state = clearBooksAndTricks(state);

  //
  // 7. Advance → CLEAR_DECK
  //
  state = advance(state);

  //
  // 8. Clear deck + trump
  //
  state = clearDeck(state);

  //
  // 9. Advance → SET_NEXT_DEALER
  //
  state = advance(state);

  //
  // 10. Rotate dealer
  //
  state = setNextDealer(state);

  //
  // 11. Advance → CHECK_GAME_END
  //
  state = advance(state);

  //
  // 12. Prepare next round (or leave state as-is if game over)
  //
  if (!state.gameOver) {
    state = prepareNextRound(state);
  }

  //
  // 13. Advance → PRE_ROUND or GAME_OVER
  //
  state = advance(state);

  //
  // 14. Persist
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
  // 15. Return clean state
  //
  return {
    gameId,
    state: cleanState(state, playerId)
  };
};
