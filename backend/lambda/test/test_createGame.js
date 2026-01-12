// test/test_createGame.js
import { call } from "./test_utils.js";

(async () => {
  console.log("=== TEST: createGame ===");

  // 1. Call createGame with maxCards
  const result = await call("createGame", {
    maxCards: 10,
    playerName: "Timothy1"
  });

  const { gameId, playerId, playerToken, state } = result;

  // 2. Basic validations
  if (!gameId) throw new Error("Missing gameId");
  if (!playerId) throw new Error("Missing playerId");
  if (!playerToken) throw new Error("Missing playerToken");

  // 3. State validations
  if (!state) throw new Error("Missing state");
  if (!state.options || !state.options.rounds) {
    throw new Error("Rounds not generated");
  }

  if (!Array.isArray(state.options.rounds)) {
    throw new Error("Rounds must be an array");
  }

  console.log("Game created:", gameId);
  console.log("Rounds:", state.options.rounds);

  console.log("=== PASS: createGame ===");
})();
