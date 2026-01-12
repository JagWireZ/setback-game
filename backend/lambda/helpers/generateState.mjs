// helpers/generateState.mjs

import { PHASES } from "../engine/stateMachine.mjs";

export const generateState = ({ ownerId, options, players = [] }) => ({
  //
  // 1. Metadata
  //
  gameId: null,
  version: 1,
  ownerId,

  //
  // 2. Game options
  //
  options: {
    gameRounds: options.gameRounds || [],   // e.g. ["10d","9d",...,"4d","3d",...]
  },

  //
  // 3. Players
  //
  players,                                   // array of { playerId, name, ... }

  //
  // 4. Phase machine
  //
  phase: {
    name: PHASES.LOBBY,
    step: null,
    roundIndex: 0
  },

  dealerId: null,
  currentPlayerId: null,

  bids: {},                                   // playerId → { bid, trip }

  deck: [],                                   // shuffled deck
  hands: {},                                  // playerId → array of cards
  initialHands: {},                           // for rainbow detection
  trick: [],                                   // [{ playerId, card }]
  books: {},                                   // playerId → number of books
  trump: null,                                 // revealed trump card
  trumpBroken: false,

  roundOver: false,
  gameOver: false,

  scores: {},                                  // playerId → cumulative score

  history: []
});
