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

  const playerId = validateIdentity({ auth, priv });

  return {
    gameId,
    state: cleanState(state, playerId)
  };
};
