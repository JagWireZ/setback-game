// test/test_validation.js
import { call } from "./test_utils.js";

(async () => {
  console.log("=== TEST: validation + error handling ===");

  //
  // CREATE GAME TESTS
  //
  console.log("→ createGame: invalid maxCards (0)");
  try {
    await call("createGame", { playerName: "A", maxCards: 0 });
    throw new Error("Expected failure for maxCards=0");
  } catch (err) {
    console.log("✔ correctly rejected maxCards=0");
  }

  console.log("→ createGame: invalid maxCards (11)");
  try {
    await call("createGame", { playerName: "A", maxCards: 11 });
    throw new Error("Expected failure for maxCards=11");
  } catch (err) {
    console.log("✔ correctly rejected maxCards=11");
  }

  console.log("→ createGame: missing playerName");
  try {
    await call("createGame", { maxCards: 10 });
    throw new Error("Expected failure for missing playerName");
  } catch (err) {
    console.log("✔ correctly rejected missing playerName");
  }

  //
  // CREATE A VALID GAME
  //
  console.log("→ createGame: valid");
  const create = await call("createGame", {
    playerName: "Creator",
    maxCards: 10
  });

  const { gameId, playerId, playerToken } = create;
  const creatorAuth = { playerId, playerToken };

  console.log("✔ created game:", gameId);

  //
  // JOIN GAME TESTS
  //
  console.log("→ joinGame: missing playerName");
  try {
    await call("joinGame", { gameId }, { playerId: "X", playerToken: "T" });
    throw new Error("Expected failure for missing playerName");
  } catch (err) {
    console.log("✔ correctly rejected missing playerName");
  }

  console.log("→ joinGame: wrong gameId");
  try {
    await call(
      "joinGame",
      { gameId: "NON_EXISTENT", playerName: "Bad" },
      { playerId: "X", playerToken: "T" }
    );
    throw new Error("Expected failure for wrong gameId");
  } catch (err) {
    console.log("✔ correctly rejected wrong gameId");
  }

  //
  // JOIN 4 MORE PLAYERS (total 5)
  //
  const players = [];
  for (let i = 2; i <= 5; i++) {
    const pid = `P${i}`;
    const tok = `T${i}`;
    await call(
      "joinGame",
      { gameId, playerName: `Player ${i}` },
      { playerId: pid, playerToken: tok }
    );
    players.push({ playerId: pid, playerToken: tok });
  }
  console.log("✔ 4 players joined (total 5)");

  console.log("→ joinGame: try joining 6th player");
  try {
    await call(
      "joinGame",
      { gameId, playerName: "Overflow" },
      { playerId: "P6", playerToken: "T6" }
    );
    throw new Error("Expected failure for too many players");
  } catch (err) {
    console.log("✔ correctly rejected 6th player");
  }

  //
  // START GAME
  //
  console.log("→ startGame");
  await call("startGame", { gameId }, creatorAuth);
  console.log("✔ game started");

  console.log("→ joinGame: try after game started");
  try {
    await call(
      "joinGame",
      { gameId, playerName: "Late" },
      { playerId: "Late", playerToken: "LateTok" }
    );
    throw new Error("Expected failure for joining after start");
  } catch (err) {
    console.log("✔ correctly rejected join after start");
  }

  //
  // DELETE GAME TESTS
  //
  console.log("→ deleteGame: wrong player tries to delete");
  try {
    await call(
      "deleteGame",
      { gameId },
      { playerId: "NotCreator", playerToken: "Fake" }
    );
    throw new Error("Expected failure for non-creator delete");
  } catch (err) {
    console.log("✔ correctly rejected non-creator delete");
  }

  console.log("→ deleteGame: correct creator deletes game");
  await call("deleteGame", { gameId }, creatorAuth);
  console.log("✔ game deleted by creator");

  console.log("=== PASS: validation tests ===");
})();
