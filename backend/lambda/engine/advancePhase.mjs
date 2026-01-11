// engine/advancePhase.mjs

import { PHASES } from "./phases.mjs";

export const advancePhase = (state) => {
  switch (state.phase.name) {
    case PHASES.LOBBY:
      return {
        ...state,
        phase: {
          ...state.phase,
          name: PHASES.DEALING,
          step: null
        }
      };

    case PHASES.DEALING:
      return {
        ...state,
        phase: {
          ...state.phase,
          name: PHASES.PLAYING,
          step: null
        }
      };

    case PHASES.PLAYING:
      return {
        ...state,
        phase: {
          ...state.phase,
          name: PHASES.BETWEEN_ROUNDS,
          step: null
        }
      };

    case PHASES.BETWEEN_ROUNDS:
      return {
        ...state,
        phase: {
          ...state.phase,
          name: PHASES.DEALING,
          step: null,
          roundIndex: state.phase.roundIndex + 1
        }
      };

    default:
      return state;
  }
};
