// engine/getRules.mjs

import {
  SUITS,
  RANKS,
  JOKER_SUIT,
  BIG_JOKER,
  LITTLE_JOKER,
  generateDeck,
  rankOrder
} from "./cards.mjs";

import {
  PHASES,
  STEPS,
  NEXT_STEP,
  NEXT_PHASE
} from "./stateMachine.mjs";

export const getRules = () => {
  const deck = generateDeck();

  return {
    //
    // 1. Deck definition
    //
    deck: {
      totalCards: deck.length,        // 54
      suits: SUITS,                   // ♠ ♥ ♦ ♣
      ranks: RANKS,                   // 2–A
      jokers: {
        suit: JOKER_SUIT,
        big: BIG_JOKER,
        little: LITTLE_JOKER
      },
      cards: deck
    },

    //
    // 2. Trick rules
    //
    trickRules: {
      playersPerTrick: 5,
      trickSize: 5,
      mustFollowSuit: true,

      // Leading trump is illegal until trump is broken
      leadingTrumpForbiddenUntilBroken: true,

      // Trump breaks when a player cannot follow suit OR only has trump/jokers
      trumpBreakConditions: {
        cannotFollowSuit: true,
        onlyTrumpLeft: true
      },

      // Jokers count as trump suit
      jokersAreTrump: true,

      // Joker hierarchy
      jokerOrder: {
        big: "BJ",
        little: "LJ"
      }
    },

    //
    // 3. Card hierarchy
    //
    cardHierarchy: {
      rankOrder,
      trumpOrder: {
        bigJoker: 101,
        littleJoker: 100,
        ace: 14,
        king: 13,
        queen: 12,
        jack: 11,
        ten: 10,
        nine: 9,
        eight: 8,
        seven: 7,
        six: 6,
        five: 5,
        four: 4,
        three: 3,
        two: 2
      }
    },

    //
    // 4. Scoring rules
    //
    scoring: {
      // Normal scoring
      exactBidPointsPerBook: 10,
      extraBookPoints: 1,
      failPenaltyPerBidBook: 10,

      // Rainbow rounds
      rainbowRounds: ["4d", "4u"],
      rainbowBonus: 25,
      rainbowRule:
        "A hand is a rainbow if it contains all 4 suits OR 3 suits + a joker (joker counts as trump suit).",

      // Trip rounds
      tripRounds: ["3d", "3u", "2d", "2u", "1d"],
      tripPointsPerBook: 30,
      tripPenaltyPerBook: 30,
      tripDescription:
        "Trip means the player declares they will win all books in the round. Success = +30 per book. Failure = -30 per book bid."
    },

    //
    // 5. Player rules
    //
    players: {
      minPlayers: 5,
      maxPlayers: 5
    },

    //
    // 6. Phase/step structure (public, static)
    //
    phases: PHASES,
    steps: STEPS,
    stepOrder: NEXT_STEP,
    phaseOrder: NEXT_PHASE,

    //
    // 7. Round structure
    //
    rounds: {
      description:
        "Each round uses a card count defined by options.gameRounds (e.g., 10d, 9d, ..., 1d, 2u, ..., 10u). Special rounds include Rainbow (4d, 4u) and Trip (3d, 3u, 2d, 2u, 1d)."
    }
  };
};
