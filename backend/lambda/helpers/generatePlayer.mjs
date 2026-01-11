export const generatePlayer = ({ playerName, seat }) => {
  const playerId = crypto.randomUUID().slice(0, 8);
  const playerToken = crypto.randomUUID();

  return {
    player: {
      playerId,
      name: playerName,
      type: "human",
      seat,
      connected: true
    },
    playerToken
  };
};
