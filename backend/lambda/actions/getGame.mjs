// actions/getGame.mjs

import { getItem } from "../data/getItem.mjs";
import { validateIdentity } from "../helpers/validateIdentity.mjs";
import { cleanState } from "../helpers/cleanState.mjs";

export const apply = async ({ payload, auth, dynamo }) => {
  const { gameId } = payload;

  if (!gameId) {
    throw new Error("gameId is required");
  }

  const item = await getItem({
    client: dynamo.client,
    tableName: dynamo.tableName,
    gameId
  });

  if (!item) {
    throw new Error("Game not found");
  }

  const { state, priv } = item;

  //
  // 1. Validate identity (token + playerId)
  //
  const playerId = validateIdentity({ auth, priv });

  //
  // 2. Ensure player is actually in the game
  //
  if (!state.players.some(p => p.playerId === playerId)) {
    throw new Error("Player not in this game");
  }

  //
  // 3. Return clean state
  //
  return {
    gameId,
    playerId,
    state: cleanState(state, playerId)
  };
};
