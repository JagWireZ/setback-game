export const addPlayerToState = (state, player) => {
  const seat = state.players.length;

  const newPlayer = {
    ...player,
    seat,
    connected: true,
    type: player.type || "human"
  };

  return {
    ...state,

    players: [...state.players, newPlayer],

    scores: {
      ...state.scores,
      [player.playerId]: 0
    },

    bids: {
      ...state.bids,
      [player.playerId]: null
    },

    hands: {
      ...state.hands,
      [player.playerId]: []
    },

    initialHands: {
      ...state.initialHands,
      [player.playerId]: []
    },

    books: {
      ...state.books,
      [player.playerId]: 0
    }
  };
};
