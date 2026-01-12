export const validateIdentity = ({ auth, priv }) => {
  if (!auth) {
    throw new Error("Missing auth");
  }

  const { playerId, playerToken } = auth;

  if (!playerId || !playerToken) {
    throw new Error("Missing player identity");
  }

  const storedToken = priv?.playerTokens?.[playerId];

  if (!storedToken || storedToken !== playerToken) {
    throw new Error("Invalid player token");
  }

  return playerId;
};
