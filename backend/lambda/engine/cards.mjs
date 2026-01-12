//
// 1. Suits and Ranks
//
export const SUITS = ["♠", "♥", "♦", "♣"];
export const JOKER_SUIT = "joker";

export const RANKS = [
  "2","3","4","5","6","7","8","9","10","J","Q","K","A"
];

export const BIG_JOKER = { suit: JOKER_SUIT, rank: "BJ" };
export const LITTLE_JOKER = { suit: JOKER_SUIT, rank: "LJ" };

//
// 2. Deck generation (54 cards)
//
export const generateDeck = () => {
  const deck = [];

  // Standard 52 cards
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({ suit, rank });
    }
  }

  // Add Jokers
  deck.push({ ...BIG_JOKER });
  deck.push({ ...LITTLE_JOKER });

  return deck;
};

//
// 3. Fisher–Yates shuffle (pure)
//
export const shuffle = (array) => {
  const deck = [...array];
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
};

//
// 4. Rank ordering
//
export const rankOrder = {
  "2": 2, "3": 3, "4": 4, "5": 5, "6": 6,
  "7": 7, "8": 8, "9": 9, "10": 10,
  "J": 11, "Q": 12, "K": 13, "A": 14,

  // Jokers (highest cards in the game)
  "LJ": 100,   // Little Joker
  "BJ": 101    // Big Joker
};

//
// 5. Helpers
//
export const isJoker = (card) =>
  card.suit === JOKER_SUIT;

export const isTrump = (card, trump) => {
  if (isJoker(card)) return true;
  return trump && card.suit === trump.suit;
};

//
// 6. Trick comparison logic
//    Determines if card A beats card B given lead suit + trump
//
export const beats = (a, b, leadSuit, trump) => {
  // Jokers always win
  if (isJoker(a) && !isJoker(b)) return true;
  if (!isJoker(a) && isJoker(b)) return false;

  // Both jokers → Big Joker wins
  if (isJoker(a) && isJoker(b)) {
    return rankOrder[a.rank] > rankOrder[b.rank];
  }

  const aIsTrump = isTrump(a, trump);
  const bIsTrump = isTrump(b, trump);

  // Trump beats non‑trump
  if (aIsTrump && !bIsTrump) return true;
  if (!aIsTrump && bIsTrump) return false;

  // Neither is trump → follow lead suit
  const aFollows = a.suit === leadSuit;
  const bFollows = b.suit === leadSuit;

  if (aFollows && !bFollows) return true;
  if (!aFollows && bFollows) return false;

  // Both follow or both don't → compare rank
  return rankOrder[a.rank] > rankOrder[b.rank];
};

//
// 7. Determine trick winner
//
export const determineTrickWinner = (trick, trump) => {
  if (!trick.length) return null;

  const leadSuit = trick[0].card.suit;
  let winner = trick[0];

  for (let i = 1; i < trick.length; i++) {
    const play = trick[i];
    if (beats(play.card, winner.card, leadSuit, trump)) {
      winner = play;
    }
  }

  return winner.playerId;
};

//
// 8. Sort a hand (useful for UI)
//
export const sortHand = (hand, trump) => {
  return [...hand].sort((a, b) => {
    // Jokers first
    if (isJoker(a) && !isJoker(b)) return -1;
    if (!isJoker(a) && isJoker(b)) return 1;

    // Trump next
    const aTrump = isTrump(a, trump);
    const bTrump = isTrump(b, trump);
    if (aTrump && !bTrump) return -1;
    if (!aTrump && bTrump) return 1;

    // Then suit order
    const suitDiff = SUITS.indexOf(a.suit) - SUITS.indexOf(b.suit);
    if (suitDiff !== 0) return suitDiff;

    // Then rank
    return rankOrder[a.rank] - rankOrder[b.rank];
  });
};
