// actions/joinGame.mjs

import { getItem } from "../data/getItem.mjs";
import { putItem } from "../data/putItem.mjs";
import { validateIdentity } from "../helpers/validateIdentity.mjs";
import { addPlayerToState } from "../helpers/addPlayerToState.mjs";
import { cleanState } from "../helpers/cleanState.mjs";
import { PHASES } from "../engine/stateMachine.mjs";

export const apply = async ({ payload, auth, dynamo }) => {
  const { gameId, name } = payload;

  if (!gameId) {
    throw new Error("gameId is required");
  }

  if (!name || typeof name !== "string") {
    throw new Error("Player name is required");
  }

  const item = await getItem({
    client: dynamo.client,
    tableName: dynamo.tableName,
    gameId
  });

  if (!item) {
    throw new Error("Game not found");
  }

  let { state, priv, version } = item;

  const playerId = validateIdentity({ auth, priv });

  if (state.phase.name !== PHASES.LOBBY) {
    throw new Error("Cannot join a game that has already started");
  }

  if (state.players.some(p => p.playerId === playerId)) {
    throw new Error("Player already joined");
  }

  if (state.players.length >= 5) {
    throw new Error("Game is full");
  }

  const player = {
    playerId,
    name
  };

  state = addPlayerToState(state, player);

  await putItem({
    client: dynamo.client,
    tableName: dynamo.tableName,
    item: {
      gameId,
      state,
      priv,
      version: version + 1
    }
  });

  return {
    gameId,
    state: cleanState(state, playerId)
  };
};
