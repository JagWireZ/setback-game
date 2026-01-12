// engine/round.mjs

import { generateDeck, shuffle, isJoker } from "./cards.mjs";
import { STEPS, PHASES } from "./stateMachine.mjs";
import { isRainbowHand } from "./rules.mjs";

//
// 1. START ROUND
//    Called when transitioning from LOBBY → PRE_ROUND or POST_ROUND → PRE_ROUND
//
export const startRound = (state) => {
  return {
    ...state,
    bids: {},
    books: {},
    trick: [],
    hands: {},
    initialHands: {},
    deck: [],
    trump: null,
    trumpBroken: false,
    roundOver: false
  };
};

//
// 2. SET ROUND INDEX
//    (Handled by stateMachine.advance, but this helper is here if needed)
//

//
// 3. SET DEALER
//
export const setDealer = (state) => {
  // Dealer is already set by previous round or initial assignment
  return state;
};

//
// 4. INIT ROUND STATE
//    (Already handled in startRound)
//

//
// 5. SHUFFLE + DEAL CARDS
//
export const dealCards = (state) => {
  const deck = shuffle(generateDeck());
  const players = state.players.length;

  // Determine hand size from round code
  const roundCode = state.options.gameRounds[state.phase.roundIndex];
  const handSize = parseInt(roundCode); // "10d" → 10, "4u" → 4, etc.

  const hands = {};
  const initialHands = {};

  for (const p of state.players) {
    const cards = deck.splice(0, handSize);
    hands[p.playerId] = cards;
    initialHands[p.playerId] = cards;
  }

  return {
    ...state,
    deck,
    hands,
    initialHands
  };
};

//
// 6. REVEAL TRUMP
//    Trump is the next card in the deck after dealing
//
export const revealTrump = (state) => {
  const trumpCard = state.deck[0];

  return {
    ...state,
    trump: trumpCard,
    trumpBroken: isJoker(trumpCard) // Jokers count as trump → trump is broken immediately
  };
};

//
// 7. RESOLVE TRICK
//
import { determineTrickWinner } from "./cards.mjs";

export const resolveTrick = (state) => {
  if (state.trick.length < 5) return state;

  const winnerId = determineTrickWinner(state.trick, state.trump);

  return {
    ...state,
    books: {
      ...state.books,
      [winnerId]: (state.books[winnerId] || 0) + 1
    },
    trick: [],
    currentPlayerId: winnerId
  };
};

//
// 8. CHECK IF HAND IS EMPTY
//
export const checkHandEmpty = (state) => {
  const empty = Object.values(state.hands).every((h) => h.length === 0);
  return {
    ...state,
    roundOver: empty
  };
};

//
// 9. CLEAR BOOKS + TRICKS
//
export const clearBooksAndTricks = (state) => ({
  ...state,
  books: {},
  trick: []
});

//
// 10. CLEAR DECK
//
export const clearDeck = (state) => ({
  ...state,
  deck: [],
  trump: null,
  trumpBroken: false
});

//
// 11. SET NEXT DEALER
//
export const setNextDealer = (state) => {
  const idx = state.players.findIndex(
    (p) => p.playerId === state.dealerId
  );

  const nextIdx = (idx + 1) % state.players.length;

  return {
    ...state,
    dealerId: state.players[nextIdx].playerId
  };
};

//
// 12. CHECK GAME END
//
export const checkGameEnd = (state) => {
  const nextRound = state.phase.roundIndex + 1;
  const isFinal = nextRound >= state.options.gameRounds.length;

  return {
    ...state,
    gameOver: isFinal
  };
};

//
// 13. PREPARE NEXT ROUND
//
export const prepareNextRound = (state) => {
  return {
    ...state,
    bids: {},
    books: {},
    trick: [],
    hands: {},
    initialHands: {},
    deck: [],
    trump: null,
    trumpBroken: false,
    roundOver: false
  };
};
