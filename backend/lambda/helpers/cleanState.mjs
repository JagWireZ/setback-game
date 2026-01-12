// helpers/cleanState.mjs

import { PHASES } from "../engine/stateMachine.mjs";

export const cleanState = (state, playerId) => {
  //
  // 1. Clean hands: players only see their own cards
  //
  const cleanHands = {};
  for (const [pid, hand] of Object.entries(state.cards.hands)) {
    cleanHands[pid] = pid === playerId ? hand : hand.length;
  }

  //
  // 2. Clean books: players see the count, not the cards, until scoring is done
  //
  const cleanBooks = state.phase.name === PHASES.POST_ROUND
    ? state.cards.books
    : state.cards.books.map(b => ({
        winnerId: b.winnerId,
        count: b.cards.length
      }));

  //
  // 3. Clean deck: players should never see the deck
  //
  const cleanDeck = state.cards.deck.length;

  //
  // 4. Clean trumpCard: visible only after REVEALING_TRUMP
  //
  const trumpVisible =
    state.phase.name !== PHASES.DEALING ||
    state.phase.step === "REVEALING_TRUMP";

  const cleanTrump = trumpVisible ? state.cards.trumpCard : null;

  //
  // 5. Clean phase.step: optional — hide internal steps from players
  //
  const cleanPhase = {
    name: state.phase.name,
    step: null, // hide internal engine steps
    roundIndex: state.phase.roundIndex,
    dealerId: state.phase.dealerId,
    turnPlayerId: state.phase.turnPlayerId,
    bids: state.phase.bids
  };

  //
  // 6. Clean scoring: totals are always visible, potentialTotals optional
  //
  const cleanScoring = {
    totals: state.scoring.totals,
    potentialTotals: null
  };

  //
  // 7. Return cleaned state
  //
  return {
    ...state,
    phase: cleanPhase,
    cards: {
      ...state.cards,
      hands: cleanHands,
      books: cleanBooks,
      deck: cleanDeck,
      trumpCard: cleanTrump
    },
    scoring: cleanScoring,
    history: [] // hide internal logs
  };
};
