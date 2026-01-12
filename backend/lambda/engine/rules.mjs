// engine/rules.mjs

import {
  isJoker,
  isTrump,
  beats,
  determineTrickWinner,
  SUITS,
  JOKER_SUIT
} from "./cards.mjs";

//
// 1. BIDDING
//
export const submitBid = (state, { playerId, bid, trip }) => {
  return {
    ...state,
    bids: {
      ...state.bids,
      [playerId]: { bid, trip: !!trip }
    }
  };
};

//
// 2. PLAYING A CARD
//
export const playCard = (state, { playerId, card }) => {
  const hand = state.hands[playerId];
  const idx = hand.findIndex(
    (c) => c.suit === card.suit && c.rank === card.rank
  );

  if (idx === -1) {
    throw new Error("Card not in hand");
  }

  // Must follow suit if possible
  const leadSuit = state.trick.length > 0 ? state.trick[0].card.suit : null;

  if (leadSuit && leadSuit !== JOKER_SUIT) {
    const hasLeadSuit = hand.some((c) => c.suit === leadSuit);

    if (hasLeadSuit && card.suit !== leadSuit) {
      throw new Error("Must follow suit");
    }
  }

  // Leading trump is illegal unless trump is broken
  if (
    state.trick.length === 0 &&
    isTrump(card, state.trump) &&
    !state.trumpBroken
  ) {
    throw new Error("Cannot lead trump until trump is broken");
  }

  // Remove card from hand
  const newHand = [...hand];
  newHand.splice(idx, 1);

  // Add to trick
  const newTrick = [...state.trick, { playerId, card }];

  // Check if this play breaks trump
  let trumpBroken = state.trumpBroken;

  if (!trumpBroken) {
    const cannotFollow =
      leadSuit &&
      !hand.some((c) => c.suit === leadSuit);

    const onlyTrumpLeft =
      hand.every((c) => isTrump(c, state.trump));

    if (cannotFollow || onlyTrumpLeft) {
      trumpBroken = true;
    }
  }

  return {
    ...state,
    hands: {
      ...state.hands,
      [playerId]: newHand
    },
    trick: newTrick,
    trumpBroken
  };
};

//
// 3. RESOLVING A TRICK
//
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
// 4. CHECK IF HAND IS EMPTY
//
export const checkHandEmpty = (state) => {
  const empty = Object.values(state.hands).every((h) => h.length === 0);
  return {
    ...state,
    roundOver: empty
  };
};

//
// 5. RAINBOW DETECTION
//
export const isRainbowHand = (hand) => {
  const suits = new Set();
  let jokerCount = 0;

  for (const card of hand) {
    if (isJoker(card)) {
      jokerCount++;
    } else {
      suits.add(card.suit);
    }
  }

  // One of each suit
  if (suits.size === 4) return true;

  // Three suits + joker = rainbow
  if (suits.size === 3 && jokerCount >= 1) return true;

  return false;
};

//
// 6. SCORING
//
export const scoreRound = (state) => {
  const scores = { ...state.scores };
  const roundCode = state.options.gameRounds[state.phase.roundIndex];

  const isRainbowRound = roundCode === "4d" || roundCode === "4u";
  const isTripRound = ["3d","3u","2d","2u","1d"].includes(roundCode);

  for (const p of state.players) {
    const pid = p.playerId;
    const { bid, trip } = state.bids[pid] || { bid: 0, trip: false };
    const books = state.books[pid] || 0;

    // TRIP ROUNDS
    if (trip && isTripRound) {
      if (books === bid) {
        // Success: 30 points per book
        scores[pid] = (scores[pid] || 0) + books * 30;
      } else {
        // Fail: -30 points per book
        scores[pid] = (scores[pid] || 0) - bid * 30;
      }
      continue;
    }

    // NORMAL ROUNDS
    if (books === bid) {
      // Exact bid: 10 points per book
      scores[pid] = (scores[pid] || 0) + books * 10;
    } else if (books > bid) {
      // Extra books: +1 per extra
      const extra = books - bid;
      scores[pid] = (scores[pid] || 0) + bid * 10 + extra;
    } else {
      // Fail: -10 per book bid
      scores[pid] = (scores[pid] || 0) - bid * 10;
    }

    // RAINBOW BONUS
    if (isRainbowRound) {
      const hand = state.initialHands[pid];
      if (isRainbowHand(hand)) {
        scores[pid] += 25;
      }
    }
  }

  return {
    ...state,
    scores
  };
};
