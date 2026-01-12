// actions/createGame.mjs

import { putItem } from "../data/putItem.mjs";
import { generatePlayer } from "../helpers/generatePlayer.mjs";
import { generateState } from "../helpers/generateState.mjs";
import { cleanState } from "../helpers/cleanState.mjs";

export const apply = async ({ payload, auth, dynamo }) => {
  const { options } = payload;

  const { playerId, playerToken } = generatePlayer();

  const state = generateState({
    ownerId: playerId,
    options,
    players: []
  });

  const priv = {
    playerTokens: {
      [playerId]: playerToken
    }
  };

  const gameId = crypto.randomUUID();

  const item = {
    gameId,
    state,
    priv,
    version: 1
  };

  await putItem({
    client: dynamo.client,
    tableName: dynamo.tableName,
    item
  });

  return {
    gameId,
    playerId,
    playerToken,
    state: cleanState(state, playerId)
  };
};
