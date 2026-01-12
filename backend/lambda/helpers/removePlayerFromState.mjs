export const removePlayerFromState = (state, playerId) => {
  const players = (state.players || []).filter(p => p.playerId !== playerId);

  const { [playerId]: _, ...remainingScores } = state.scores || {};
  const { [playerId]: __, ...remainingBids } = state.bids || {};
  const { [playerId]: ___, ...remainingHands } = state.hands || {};
  const { [playerId]: ____, ...remainingInitialHands } = state.initialHands || {};
  const { [playerId]: _____, ...remainingBooks } = state.books || {};

  const dealerId = state.dealerId === playerId ? null : state.dealerId ?? null;
  const currentPlayerId =
    state.currentPlayerId === playerId ? null : state.currentPlayerId ?? null;

  return {
    ...state,
    players,
    scores: remainingScores,
    bids: remainingBids,
    hands: remainingHands,
    initialHands: remainingInitialHands,
    books: remainingBooks,
    dealerId,
    currentPlayerId
  };
};
