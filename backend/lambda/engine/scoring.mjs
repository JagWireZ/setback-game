// engine/scoring.mjs

import { isRainbowHand } from "./rules.mjs";

//
// 1. Identify special round types
//
export const isRainbowRound = (roundCode) =>
  roundCode === "4d" || roundCode === "4u";

export const isTripRound = (roundCode) =>
  ["3d", "3u", "2d", "2u", "1d"].includes(roundCode);

//
// 2. Compute score for a single player
//
export const scorePlayer = ({
  bid,
  trip,
  books,
  roundCode,
  initialHand
}) => {
  let score = 0;

  const rainbow = isRainbowRound(roundCode);
  const tripRound = isTripRound(roundCode);

  //
  // A. Trip scoring (overrides normal scoring)
  //
  if (trip && tripRound) {
    if (books === bid) {
      // Trip success: 30 points per book
      score += books * 30;
    } else {
      // Trip fail: -30 points per book bid
      score -= bid * 30;
    }

    // Rainbow bonus still applies
    if (rainbow && isRainbowHand(initialHand)) {
      score += 25;
    }

    return score;
  }

  //
  // B. Normal scoring
  //
  if (books === bid) {
    // Exact bid: 10 points per book
    score += books * 10;
  } else if (books > bid) {
    // Extra books: +1 per extra
    const extra = books - bid;
    score += bid * 10 + extra;
  } else {
    // Fail: -10 per book bid
    score -= bid * 10;
  }

  //
  // C. Rainbow bonus
  //
  if (rainbow && isRainbowHand(initialHand)) {
    score += 25;
  }

  return score;
};

//
// 3. Apply scoring to entire state
//
export const scoreRound = (state) => {
  const scores = { ...state.scores };
  const roundCode = state.options.gameRounds[state.phase.roundIndex];

  for (const p of state.players) {
    const pid = p.playerId;

    const { bid, trip } = state.bids[pid] || { bid: 0, trip: false };
    const books = state.books[pid] || 0;
    const initialHand = state.initialHands[pid] || [];

    const delta = scorePlayer({
      bid,
      trip,
      books,
      roundCode,
      initialHand
    });

    scores[pid] = (scores[pid] || 0) + delta;
  }

  return {
    ...state,
    scores
  };
};
