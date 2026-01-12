// test/test_join_and_start.js
import { call } from "./test_utils.js";

(async () => {
  console.log("=== TEST: create + join + start + deal ===");

  // 1. Create game
  const create = await call("createGame", {
    options: { gameRounds: ["10d", "9d", "8d"] }
  });

  const { gameId, playerId, playerToken } = create;
  const ownerAuth = { playerId, playerToken };

  console.log("Game created:", gameId);

  // 2. Join 4 more players
  const players = [ownerAuth];

  for (let i = 2; i <= 5; i++) {
    const join = await call(
      "joinGame",
      { gameId, name: `Player ${i}` },
      { playerId: `P${i}`, playerToken: `T${i}` }
    );
    players.push({ playerId: `P${i}`, playerToken: `T${i}` });
  }

  console.log("Players joined:", players.length);

  // 3. Start game
  await call("startGame", { gameId }, ownerAuth);
  console.log("Game started");

  // 4. Deal
  await call("deal", { gameId }, ownerAuth);
  console.log("Cards dealt + trump revealed");

  console.log("=== PASS: join/start/deal ===");
})();
