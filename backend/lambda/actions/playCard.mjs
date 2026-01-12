import { getItem } from "../data/getItem.mjs";
import { putItem } from "../data/putItem.mjs";
import { validateIdentity } from "../helpers/validateIdentity.mjs";
import { cleanState } from "../helpers/cleanState.mjs";
import { assertPhase, assertStep, assertTurn } from "../engine/validate.mjs";
import { PHASES, STEPS, advance } from "../engine/stateMachine.mjs";
import { playCard as enginePlayCard } from "../engine/rules.mjs";
import { resolveTrick, checkHandEmpty } from "../engine/round.mjs";

export const apply = async ({ payload, auth, dynamo }) => {
  const { gameId, card } = payload;

  if (!gameId) {
    throw new Error("gameId is required");
  }

  if (!card || typeof card.suit !== "string" || typeof card.rank !== "string") {
    throw new Error("Invalid card");
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
  // 1. Must be in PLAYING phase
  //
  assertPhase(state, PHASES.PLAYING);

  //
  // 2. Must be at WAITING_FOR_CARD step
  //
  assertStep(state, STEPS.PLAYING.WAITING_FOR_CARD);

  //
  // 3. Must be this player's turn
  //
  assertTurn(state, playerId);

  //
  // 4. Card must be in player's hand
  //
  const hand = state.cards.hands[playerId] || [];
  if (!hand.some(c => c.suit === card.suit && c.rank === card.rank)) {
    throw new Error("Card not in hand");
  }

  //
  // 5. Apply card play
  //
  state = enginePlayCard(state, { playerId, card });

  //
  // 6. Advance → CARD_PLAYED
  //
  state = advance(state);

  //
  // 7. Resolve trick if 5 cards played
  //
  state = resolveTrick(state);

  //
  // 8. Advance → RESOLVING_TRICK
  //
  state = advance(state);

  //
  // 9. Check if hands are empty (round over)
  //
  state = checkHandEmpty(state);

  //
  // 10. Advance → NEXT_TRICK or POST_ROUND
  //
  state = advance(state);

  //
  // 11. Increment version
  //
  state.version += 1;

  //
  // 12. Persist
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
  // 13. Return clean state
  //
  return {
    gameId,
    state: cleanState(state, playerId)
  };
};
