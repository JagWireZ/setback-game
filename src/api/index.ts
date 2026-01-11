export const API_BASE = "https://jtvblqphsnjy2d3h4r6kandcwu0ntbys.lambda-url.us-east-1.on.aws";

export const ENDPOINTS = {
  createGame: `${API_BASE}/create-game`,
  joinGame: `${API_BASE}/join-game`,
  getGame: (id: string) => `${API_BASE}/game/${id}`,
  updateGame: `${API_BASE}/update-game`,
};
