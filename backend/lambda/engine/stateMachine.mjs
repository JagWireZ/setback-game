//
// 1. Top‑level phases
//
export const PHASES = {
  LOBBY: "LOBBY",
  PRE_ROUND: "PRE_ROUND",
  DEALING: "DEALING",
  BIDDING: "BIDDING",
  PLAYING: "PLAYING",
  POST_ROUND: "POST_ROUND",
  GAME_OVER: "GAME_OVER"
};

//
// 2. Sub‑steps for each phase
//
export const STEPS = {
  [PHASES.LOBBY]: {
    WAITING_FOR_PLAYERS: "WAITING_FOR_PLAYERS",
    ASSIGNING_FIRST_DEALER: "ASSIGNING_FIRST_DEALER"
  },

  [PHASES.PRE_ROUND]: {
    SET_ROUND_INDEX: "SET_ROUND_INDEX",
    SET_DEALER: "SET_DEALER",
    INIT_ROUND_STATE: "INIT_ROUND_STATE"
  },

  [PHASES.DEALING]: {
    SHUFFLING: "SHUFFLING",
    DEALING_CARDS: "DEALING_CARDS",
    REVEALING_TRUMP: "REVEALING_TRUMP"
  },

  [PHASES.BIDDING]: {
    WAITING_FOR_PLAYER: "WAITING_FOR_PLAYER",
    BID_SUBMITTED: "BID_SUBMITTED",
    ALL_BIDS_IN: "ALL_BIDS_IN"
  },

  [PHASES.PLAYING]: {
    WAITING_FOR_CARD: "WAITING_FOR_CARD",
    CARD_PLAYED: "CARD_PLAYED",
    RESOLVING_TRICK: "RESOLVING_TRICK",
    CHECK_HAND_EMPTY: "CHECK_HAND_EMPTY"
  },

  [PHASES.POST_ROUND]: {
    CALCULATING_SCORES: "CALCULATING_SCORES",
    CLEAR_BOOKS: "CLEAR_BOOKS",
    CLEAR_DECK: "CLEAR_DECK",
    SET_NEXT_DEALER: "SET_NEXT_DEALER",
    CHECK_GAME_END: "CHECK_GAME_END"
  },

  [PHASES.GAME_OVER]: {
    SHOW_RESULTS: "SHOW_RESULTS"
  }
};

//
// 3. Step order for each phase
//
export const NEXT_STEP = {
  [PHASES.LOBBY]: [
    STEPS[PHASES.LOBBY].WAITING_FOR_PLAYERS,
    STEPS[PHASES.LOBBY].ASSIGNING_FIRST_DEALER
  ],

  [PHASES.PRE_ROUND]: [
    STEPS[PHASES.PRE_ROUND].SET_ROUND_INDEX,
    STEPS[PHASES.PRE_ROUND].SET_DEALER,
    STEPS[PHASES.PRE_ROUND].INIT_ROUND_STATE
  ],

  [PHASES.DEALING]: [
    STEPS[PHASES.DEALING].SHUFFLING,
    STEPS[PHASES.DEALING].DEALING_CARDS,
    STEPS[PHASES.DEALING].REVEALING_TRUMP
  ],

  [PHASES.BIDDING]: [
    STEPS[PHASES.BIDDING].WAITING_FOR_PLAYER,
    STEPS[PHASES.BIDDING].BID_SUBMITTED,
    STEPS[PHASES.BIDDING].ALL_BIDS_IN
  ],

  [PHASES.PLAYING]: [
    STEPS[PHASES.PLAYING].WAITING_FOR_CARD,
    STEPS[PHASES.PLAYING].CARD_PLAYED,
    STEPS[PHASES.PLAYING].RESOLVING_TRICK,
    STEPS[PHASES.PLAYING].CHECK_HAND_EMPTY
  ],

  [PHASES.POST_ROUND]: [
    STEPS[PHASES.POST_ROUND].CALCULATING_SCORES,
    STEPS[PHASES.POST_ROUND].CLEAR_BOOKS,
    STEPS[PHASES.POST_ROUND].CLEAR_DECK,
    STEPS[PHASES.POST_ROUND].SET_NEXT_DEALER,
    STEPS[PHASES.POST_ROUND].CHECK_GAME_END
  ],

  [PHASES.GAME_OVER]: [
    STEPS[PHASES.GAME_OVER].SHOW_RESULTS
  ]
};

//
// 4. Phase‑to‑phase transitions
//
export const NEXT_PHASE = {
  [PHASES.LOBBY]: PHASES.PRE_ROUND,
  [PHASES.PRE_ROUND]: PHASES.DEALING,
  [PHASES.DEALING]: PHASES.BIDDING,
  [PHASES.BIDDING]: PHASES.PLAYING,
  [PHASES.PLAYING]: PHASES.POST_ROUND,
  [PHASES.POST_ROUND]: null, // depends on roundIndex
  [PHASES.GAME_OVER]: PHASES.GAME_OVER
};

//
// 5. Helpers
//
export const phaseIs = (state, phase) =>
  state.phase.name === phase;

export const stepIs = (state, step) =>
  state.phase.step === step;

export const getNextStep = (state) => {
  const { name, step } = state.phase;
  const steps = NEXT_STEP[name];

  if (!step) return steps[0];

  const idx = steps.indexOf(step);
  if (idx === -1) {
    throw new Error(`Unknown step ${step} in phase ${name}`);
  }

  return steps[idx + 1] || null;
};

export const getNextPhase = (state) => {
  const { name, roundIndex } = state.phase;

  if (name === PHASES.POST_ROUND) {
    const nextRound = roundIndex + 1;
    const isFinal = nextRound >= state.options.gameRounds.length;

    return {
      name: isFinal ? PHASES.GAME_OVER : PHASES.PRE_ROUND,
      step: null,
      roundIndex: nextRound
    };
  }

  const next = NEXT_PHASE[name];
  if (!next) {
    throw new Error(`No next phase defined for ${name}`);
  }

  return {
    name: next,
    step: null,
    roundIndex
  };
};

//
// 6. Validation helpers
//
export const assertPhase = (state, expected) => {
  if (state.phase.name !== expected) {
    throw new Error(`Invalid phase: expected ${expected}, got ${state.phase.name}`);
  }
};

export const assertStep = (state, expected) => {
  if (state.phase.step !== expected) {
    throw new Error(`Invalid step: expected ${expected}, got ${state.phase.step}`);
  }
};

export const assertTurn = (state, playerId) => {
  if (state.currentPlayerId !== playerId) {
    throw new Error("Not your turn");
  }
};

//
// 7. Unified advance() function
//
export const advance = (state) => {
  const { name, step } = state.phase;

  // GAME_OVER is terminal
  if (name === PHASES.GAME_OVER) {
    throw new Error("Cannot advance: game is already over");
  }

  const nextStep = getNextStep(state);

  // A. If no step yet → start first step
  if (step == null) {
    return {
      ...state,
      phase: {
        ...state.phase,
        step: nextStep
      }
    };
  }

  // B. If there is a next step → move to it
  if (nextStep) {
    return {
      ...state,
      phase: {
        ...state.phase,
        step: nextStep
      }
    };
  }

  // C. No next step → move to next phase
  return {
    ...state,
    phase: getNextPhase(state)
  };
};
