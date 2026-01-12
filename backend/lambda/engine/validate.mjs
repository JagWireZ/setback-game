// engine/validate.mjs

import { PHASES, STEPS } from "./stateMachine.mjs";

//
// 1. Phase validation
//
export const assertPhase = (state, phase) => {
  if (state.phase.name !== phase) {
    throw new Error(`Invalid phase: expected ${phase}, got ${state.phase.name}`);
  }
};

export const isPhase = (state, phase) =>
  state.phase.name === phase;

//
// 2. Step validation
//
export const assertStep = (state, step) => {
  if (state.phase.step !== step) {
    throw new Error(`Invalid step: expected ${step}, got ${state.phase.step}`);
  }
};

export const isStep = (state, step) =>
  state.phase.step === step;

//
// 3. Turn validation
//
export const assertTurn = (state, playerId) => {
  if (state.currentPlayerId !== playerId) {
    throw new Error("Not your turn");
  }
};

//
// 4. Hand validation
//
export const assertPlayerHasCard = (state, playerId, card) => {
  const hand = state.hands[playerId] || [];
  const exists = hand.some(
    (c) => c.suit === card.suit && c.rank === card.rank
  );

  if (!exists) {
    throw new Error("Player does not have that card");
  }
};

//
// 5. Follow-suit validation
//
export const assertFollowSuit = (state, playerId, card) => {
  const trick = state.trick;
  if (trick.length === 0) return; // no lead suit yet

  const leadSuit = trick[0].card.suit;
  const hand = state.hands[playerId] || [];

  const hasLeadSuit = hand.some((c) => c.suit === leadSuit);
  const isFollowingSuit = card.suit === leadSuit;

  if (hasLeadSuit && !isFollowingSuit) {
    throw new Error("Must follow suit if possible");
  }
};

//
// 6. Bid validation
//
export const assertValidBid = (state, bid) => {
  const roundCode = state.options.gameRounds[state.phase.roundIndex];
  const maxBooks = parseInt(roundCode, 10);

  if (typeof bid !== "number" || bid < 0 || bid > maxBooks) {
    throw new Error(`Bid must be between 0 and ${maxBooks}`);
  }
};

//
// 7. Round validation
//
export const assertValidRound = (state) => {
  const rounds = state.options.gameRounds;
  const idx = state.phase.roundIndex;

  if (idx < 0 || idx >= rounds.length) {
    throw new Error(`Invalid round index: ${idx}`);
  }
};

//
// 8. Phase/step transition safety (optional)
//
export const assertCanAdvance = (state) => {
  if (!PHASES[state.phase.name]) {
    throw new Error(`Unknown phase: ${state.phase.name}`);
  }
};
