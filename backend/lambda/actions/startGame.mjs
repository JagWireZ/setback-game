// actions/startGame.mjs

import { PHASES } from "../engine/phases.mjs";

import { getState } from "../data/getState.mjs";
import { putState } from "../data/putState.mjs";
import { getPrivate } from "../data/getPrivate.mjs";
import { putPrivate } from "../data/putPrivate.mjs";

//
// 0. Validation (moved to top, consistent with createGame/joinGame/deleteGame)
//
const validate = ({ state, ownerToken, playerToken }) => {
  if (state.phase.name !== PHASES.LOBBY) {
    throw new Error("Game has already started");
  }

  if (ownerToken !== playerToken) {
    throw new Error("Only the game creator can start the game");
  }
};

export const apply = async ({ payload, auth, s3 }) => {
  const { gameId } = payload;
  const { playerToken } = auth;

  //
  // 1. Load state.json + private.json
  //
  let state;
  let priv;

  try {
    state = await getState({ s3, gameId });
    priv = await getPrivate({ s3, gameId });
  } catch {
    throw new Error("Game not found");
  }

  //
  // 2. Validate permissions + phase
  //
  validate({
    state,
    ownerToken: priv.ownerToken,
    playerToken
  });

  //
  // 3. Build updated state
  //
  const newState = {
    ...state,
    phase: {
      ...state.phase,
      name: PHASES.DEALING,
      roundIndex:
        typeof state.phase.roundIndex === "number"
          ? state.phase.roundIndex
          : 0
    },
    version: state.version + 1
  };

  //
  // 4. Persist updated state + private (unchanged)
  //
  await putState({ s3, gameId, state: newState });
  await putPrivate({ s3, gameId, privateData: priv });

  //
  // 5. Return updated state + gameId
  //
  return {
    gameId,
    state: newState
  };
};
