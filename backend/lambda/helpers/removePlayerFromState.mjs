export const removePlayerFromState = (state, playerId) => {
  const players = state.players.filter(p => p.playerId !== playerId);

  const { [playerId]: _, ...remainingScores } = state.scores;
  const { [playerId]: __, ...remainingBids } = state.bids;
  const { [playerId]: ___, ...remainingHands } = state.hands;
  const { [playerId]: ____, ...remainingInitialHands } = state.initialHands;
  const { [playerId]: _____, ...remainingBooks } = state.books;

  // If the removed player was the dealer or current player, clear them.
  const dealerId = state.dealerId === playerId ? null : state.dealerId;
  const currentPlayerId =
    state.currentPlayerId === playerId ? null : state.currentPlayerId;

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
