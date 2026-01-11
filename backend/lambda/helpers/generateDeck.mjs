export const generateDeck = () => {
  const suits = ["hearts", "diamonds", "clubs", "spades"];
  const ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];

  const deck = [];

  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push({ rank, suit });
    }
  }

  const jokers = [
    { rank: "B", suit: "joker" },
    { rank: "L", suit: "joker" }
  ];

  return {
    deck: [...deck, ...jokers],
    suits,
    ranks,
    jokers
  };
};
