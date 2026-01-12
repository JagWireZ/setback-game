// helpers/cleanState.mjs

import { PHASES } from "../engine/stateMachine.mjs";

export const cleanState = (state, playerId) => {
  const cleanHands = {};
  for (const [pid, hand] of Object.entries(state.cards.hands || {})) {
    cleanHands[pid] = pid === playerId ? hand : hand.length;
  }

  const cleanBooks =
    state.phase.name === PHASES.POST_ROUND
      ? state.cards.books || []
      : (state.cards.books || []).map((b) => ({
          winnerId: b.winnerId ?? null,
          count: b.cards ? b.cards.length : 0
        }));

  const cleanDeck = Array.isArray(state.cards.deck)
    ? state.cards.deck.length
    : 0;

  const trumpVisible =
    state.phase.name !== PHASES.DEALING ||
    state.phase.step === "REVEALING_TRUMP";

  const cleanTrump = trumpVisible ? state.cards.trumpCard ?? null : null;

  const cleanPhase = {
    name: state.phase.name ?? null,
    step: null,
    roundIndex: state.phase.roundIndex ?? 0,
    dealerId: state.phase.dealerId ?? null,
    turnPlayerId: state.phase.turnPlayerId ?? null,
    bids: state.phase.bids ?? null
  };

  const cleanScoring = {
    totals: state.scoring?.totals ?? {},
    potentialTotals: null
  };

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
    history: []
  };
};
