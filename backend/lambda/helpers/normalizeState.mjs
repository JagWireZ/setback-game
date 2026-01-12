export const normalizeState = (state = {}) => {
  // 1. Metadata
  state.gameId = state.gameId ?? null;
  state.version = state.version ?? 1;
  state.ownerId = state.ownerId ?? null;

  // 2. Options
  state.options = state.options ?? {};
  state.options.gameRounds = state.options.gameRounds ?? [];

  // 3. Players
  state.players = state.players ?? [];

  // 4. Phase machine
  state.phase = state.phase ?? {};
  state.phase.name = state.phase.name ?? "LOBBY";
  state.phase.step = state.phase.step ?? null;
  state.phase.roundIndex = state.phase.roundIndex ?? 0;

  // 5. Core game fields
  state.dealerId = state.dealerId ?? null;
  state.currentPlayerId = state.currentPlayerId ?? null;

  state.bids = state.bids ?? {};

  state.deck = state.deck ?? [];
  state.hands = state.hands ?? {};
  state.initialHands = state.initialHands ?? {};
  state.trick = state.trick ?? [];
  state.books = state.books ?? {};
  state.trump = state.trump ?? null;
  state.trumpBroken = state.trumpBroken ?? false;

  state.roundOver = state.roundOver ?? false;
  state.gameOver = state.gameOver ?? false;

  state.scores = state.scores ?? {};

  state.history = state.history ?? [];

  return state;
};
