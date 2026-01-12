// helpers/generateState.mjs

import { PHASES } from "../engine/stateMachine.mjs";

export const generateState = ({ ownerId, options, players = [] }) => ({
  gameId: null,
  version: 1,
  ownerId: ownerId ?? null,

  options: {
    gameRounds: Array.isArray(options?.gameRounds) ? options.gameRounds : []
  },

  players: Array.isArray(players) ? players : [],

  phase: {
    name: PHASES.LOBBY,
    step: null,
    roundIndex: 0
  },

  dealerId: null,
  currentPlayerId: null,

  bids: {},
  deck: [],
  hands: {},
  initialHands: {},
  trick: [],
  books: {},
  trump: null,
  trumpBroken: false,

  roundOver: false,
  gameOver: false,

  scores: {},

  history: []
});
