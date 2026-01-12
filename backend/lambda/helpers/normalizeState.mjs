export const normalizeState = (state = {}) => {
  state.gameId = state.gameId ?? null;
  state.version = state.version ?? 1;
  state.ownerId = state.ownerId ?? null;

  state.options = state.options ?? {};
  state.options.gameRounds = Array.isArray(state.options.gameRounds)
    ? state.options.gameRounds
    : [];

  state.players = Array.isArray(state.players) ? state.players : [];

  state.phase = state.phase ?? {};
  state.phase.name = state.phase.name ?? "LOBBY";
  state.phase.step = state.phase.step ?? null;
  state.phase.roundIndex = state.phase.roundIndex ?? 0;

  state.dealerId = state.dealerId ?? null;
  state.currentPlayerId = state.currentPlayerId ?? null;

  state.bids = state.bids ?? {};

  state.deck = Array.isArray(state.deck) ? state.deck : [];
  state.hands = state.hands ?? {};
  state.initialHands = state.initialHands ?? {};
  state.trick = Array.isArray(state.trick) ? state.trick : [];
  state.books = state.books ?? {};
  state.trump = state.trump ?? null;
  state.trumpBroken = state.trumpBroken ?? false;

  state.roundOver = state.roundOver ?? false;
  state.gameOver = state.gameOver ?? false;

  state.scores = state.scores ?? {};

  state.history = Array.isArray(state.history) ? state.history : [];

  return state;
};
