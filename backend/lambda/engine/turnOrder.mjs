//
// Get next player clockwise
//
export const getNextPlayer = (players, currentId) => {
  const ids = players.map(p => p.playerId);
  const idx = ids.indexOf(currentId);
  return ids[(idx + 1) % ids.length];
};

//
// Get previous player
//
export const getPreviousPlayer = (players, currentId) => {
  const ids = players.map(p => p.playerId);
  const idx = ids.indexOf(currentId);
  return ids[(idx - 1 + ids.length) % ids.length];
};

//
// Rotate dealer clockwise
//
export const rotateDealer = (players, currentDealerId) => {
  return getNextPlayer(players, currentDealerId);
};
