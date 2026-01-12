export const generatePlayer = ({ playerName }) => {
  const playerId = crypto.randomUUID().slice(0, 8);
  const playerToken = crypto.randomUUID();

  return {
    player: {
      playerId,
      name: playerName,
      type: "human",
      connected: true,
      joinedAt: Date.now()
    },
    playerToken
  };
};
