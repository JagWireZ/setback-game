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

  let { state, priv } = item;

  const playerId = validateIdentity({ auth, priv });

  //
  // 1. Only owner can advance the round
  //
  if (state.ownerId !== playerId || auth.playerToken !== priv.ownerToken) {
    throw new Error("Only the game creator can advance after a round");
  }

  //
  // 2. Must be in POST_ROUND phase
  //
  assertPhase(state, PHASES.POST_ROUND);

  //
  // 3. Must be at CALCULATING_SCORES step
  //
  assertStep(state, STEPS.POST_ROUND.CALCULATING_SCORES);

  //
  // 4. Round must be complete
  //
  if (!state.roundComplete) {
    throw new Error("Round not complete");
  }

  //
  // 5. Score the round
  //
  state = scoreRound(state);

  //
  // 6. Advance → CLEAR_BOOKS
  //
  state = advance(state);

  //
  // 7. Clear books + trick
  //
  state = clearBooksAndTricks(state);

  //
  // 8. Advance → CLEAR_DECK
  //
  state = advance(state);

  //
  // 9. Clear deck + trump
  //
  state = clearDeck(state);

  //
  // 10. Advance → SET_NEXT_DEALER
  //
  state = advance(state);

  //
  // 11. Rotate dealer
  //
  state = setNextDealer(state);

  //
  // 12. Advance → CHECK_GAME_END
  //
  state = advance(state);

  //
  // 13. Prepare next round (if not game over)
  //
  if (!state.gameOver) {
    state = prepareNextRound(state);
  }

  //
  // 14. Advance → PRE_ROUND or GAME_OVER
  //
  state = advance(state);

  //
  // 15. Increment version
  //
  state.version += 1;

  //
  // 16. Persist
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
  // 17. Return clean state
  //
  return {
    gameId,
    state: cleanState(state, playerId)
  };
};
