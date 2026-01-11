// actions/startGame.mjs

import { PHASES } from "../engine/phases.mjs";

import { getItem } from "../data/getItem.mjs";
import { putItem } from "../data/putItem.mjs";

const validate = ({ state, ownerToken, playerToken }) => {
  if (state.phase.name !== PHASES.LOBBY) {
    throw new Error("Game has already started");
  }

  if (ownerToken !== playerToken) {
    throw new Error("Only the game creator can start the game");
  }
};

export const apply = async ({ payload, auth, dynamo }) => {
  const { gameId } = payload;
  const { playerToken } = auth;

  let item;
  try {
    item = await getItem({
      client: dynamo.client,
      tableName: dynamo.tableName,
      gameId
    });
  } catch {
    throw new Error("Game not found");
  }

  const { state, priv } = item;

  validate({
    state,
    ownerToken: priv.ownerToken,
    playerToken
  });

  const newState = {
    ...state,
    phase: {
      ...state.phase,
      name: PHASES.DEALING,
      step: null,
      roundIndex: state.phase.roundIndex ?? 0
    },
    started: true,
    version: state.version + 1
  };

  await putItem({
    client: dynamo.client,
    tableName: dynamo.tableName,
    item: {
      gameId,
      state: newState,
      priv
    }
  });

  return {
    gameId,
    state: newState
  };
};
