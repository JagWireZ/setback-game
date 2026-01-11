export const cleanState = ({ state, playerId }) => {
  const hands = state.cards.hands || {};
  const safeHands = {};

  for (const pid in hands) {
    const hand = hands[pid];

    safeHands[pid] =
      pid === playerId
        ? hand
        : { cardCount: hand?.length ?? 0 };
  }

  return {
    ...state,
    cards: {
      ...state.cards,
      hands: safeHands
    }
  };
};
