export const addPlayerToState = (state, player) => {
  const seat = state.players.length;

  // Remove any undefined fields from the incoming player object
  const sanitized = Object.fromEntries(
    Object.entries(player).filter(([_, v]) => v !== undefined)
  );

  const newPlayer = {
    playerId: sanitized.playerId,
    name: sanitized.name,
    seat,
    connected: true,
    type: sanitized.type ?? "human"
  };

  return {
    ...state,

    players: [...state.players, newPlayer],

    scores: {
      ...(state.scores || {}),
      [newPlayer.playerId]: 0
    },

    bids: {
      ...(state.bids || {}),
      [newPlayer.playerId]: null
    },

    hands: {
      ...(state.hands || {}),
      [newPlayer.playerId]: []
    },

    initialHands: {
      ...(state.initialHands || {}),
      [newPlayer.playerId]: []
    },

    books: {
      ...(state.books || {}),
      [newPlayer.playerId]: 0
    }
  };
};
