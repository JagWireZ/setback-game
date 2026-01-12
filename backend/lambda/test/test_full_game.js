// test/test_full_game.js
import { call } from "./test_utils.js";

(async () => {
  console.log("=== FULL GAME ROUND TEST ===");

  // 1. Create game
  const create = await call("createGame", {
    options: { gameRounds: ["5d"] }
  });

  const { gameId, playerId, playerToken } = create;
  const ownerAuth = { playerId, playerToken };

  const players = [{ playerId, playerToken }];

  // 2. Join 4 more players
  for (let i = 2; i <= 5; i++) {
    const pid = `P${i}`;
    const tok = `T${i}`;
    await call("joinGame", { gameId, name: `Player ${i}` }, { playerId: pid, playerToken: tok });
    players.push({ playerId: pid, playerToken: tok });
  }

  // 3. Start game
  await call("startGame", { gameId }, ownerAuth);

  // 4. Deal
  await call("deal", { gameId }, ownerAuth);

  // 5. Bidding (everyone bids 1 for simplicity)
  for (const p of players) {
    await call("submitBid", { gameId, bid: 1 }, p);
  }

  // 6. Play all cards
  let state = null;

  const getState = async (auth) => {
    const res = await call("getGame", { gameId }, auth);
    return res.state;
  };

  while (true) {
    state = await getState(ownerAuth);

    if (state.phase.name === "POST_ROUND") break;

    const current = state.currentPlayerId;
    const auth = players.find(p => p.playerId === current);

    const hand = state.hands[current];
    const card = hand[0];

    await call("playCard", { gameId, card }, auth);
  }

  // 7. Post round
  await call("postRound", { gameId }, ownerAuth);

  // 8. Print scores
  state = await getState(ownerAuth);
  console.log("Final scores:", state.scores);

  console.log("=== PASS: full round ===");
})();
