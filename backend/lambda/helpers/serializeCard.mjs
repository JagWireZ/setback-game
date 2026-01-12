//
// Convert card → string ("A♠", "10♦", etc.)
//
export const serializeCard = (card) => `${card.rank}${card.suit}`;

//
// Convert string → card object
//
export const deserializeCard = (str) => {
  const suit = str.slice(-1);
  const rank = str.slice(0, -1);
  return { suit, rank };
};
