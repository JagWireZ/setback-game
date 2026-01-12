//
// Get next player clockwise
//
export const getNextPlayer = (players, currentId) => {
  const ids = (players || []).map(p => p.playerId);

  if (ids.length === 0) return null;
  if (!currentId) return ids[0];

  const idx = ids.indexOf(currentId);
  const safeIdx = idx === -1 ? 0 : idx;

  return ids[(safeIdx + 1) % ids.length];
};

//
// Get previous player
//
export const getPreviousPlayer = (players, currentId) => {
  const ids = (players || []).map(p => p.playerId);

  if (ids.length === 0) return null;
  if (!currentId) return ids[0];

  const idx = ids.indexOf(currentId);
  const safeIdx = idx === -1 ? 0 : idx;

  return ids[(safeIdx - 1 + ids.length) % ids.length];
};

//
// Rotate dealer clockwise
//
export const rotateDealer = (players, currentDealerId) => {
  return getNextPlayer(players, currentDealerId);
};
