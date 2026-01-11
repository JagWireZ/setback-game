import { PHASES } from "../engine/phases.mjs";

export const generateState = () => ({
  gameId: null,
  version: 1,

  started: false,

  options: {
    gameRounds: []
  },

  players: [],

  phase: {
    name: PHASES.LOBBY,   // canonical top-level phase
    step: null,           // optional sub-step inside a phase
    roundIndex: 0,
    dealerId: null,
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
