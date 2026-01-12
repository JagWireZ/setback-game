//
// Push a structured history entry
//
export const pushHistoryEntry = (state, entry) => {
  return {
    ...state,
    history: [
      ...state.history,
      {
        timestamp: Date.now(),
        ...entry
      }
    ]
  };
};
