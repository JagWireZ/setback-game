import "./helpers/idGenerators.mjs";

export const handler = async (event) => {
  try {
    // Parse incoming JSON
    const body = typeof event.body === "string"
      ? JSON.parse(event.body)
      : event.body || {};

    const { action, data } = body;

    if (!action) {
      return jsonResponse(400, { error: "Missing 'action' field" });
    }

    switch (action) {
      case "createGame":
        return await handleCreateGame(data);

      case "joinGame":
        return await handleJoinGame(data);

      case "updateGame":
        return await handleUpdateGame(data);

      default:
        return jsonResponse(400, { error: `Unknown action: ${action}` });
    }

  } catch (err) {
    console.error("Lambda error:", err);
    return jsonResponse(500, { error: "Internal server error" });
  }
};

// -------------------------
// Action Handlers
// -------------------------

async function handleCreateGame(data) {
  // Example: call helper functions, write to S3, etc.
  const gameId = generateGameId();
  const initialState = buildInitialState(data);

  // TODO: write to S3 or DynamoDB

  return jsonResponse(200, { gameId, state: initialState });
}

async function handleJoinGame(data) {
  const { gameId, name } = data;

  // TODO: load game state, add player, save back to S3

  return jsonResponse(200, { joined: true });
}

async function handleUpdateGame(data) {
  // TODO: update game state in S3
  return jsonResponse(200, { updated: true });
}

// -------------------------
// Helpers
// -------------------------

function jsonResponse(statusCode, body) {
  return {
    statusCode,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
}

// Example helper functions (replace with your real ones)
function generateGameId() {
  return "GAME-" + Math.random().toString(36).substring(2, 8).toUpperCase();
}

function buildInitialState(options = {}) {
  return {
    createdAt: Date.now(),
    players: [],
    options,
  };
}
