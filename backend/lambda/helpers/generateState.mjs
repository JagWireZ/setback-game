export const generateState = () => ({
  gameId: null,
  version: 1,

  started: false,

  options: {
    gameRounds: []
  },

  players: [],

  phase: {
    roundIndex: null,
    dealerId: null,
    step: "lobby",
    turnPlayerId: null,
    bids: {}
  },

  cards: {
    deck: [],
    trumpCard: null,
    hands: {},
    onTable: [],
    books: []
  },

  scoring: {
    totals: {},
    potentialTotals: {}
  },

  history: []
});
