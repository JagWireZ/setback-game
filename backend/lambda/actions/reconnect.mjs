// actions/reconnect.mjs

import { getItem } from "../data/getItem.mjs";
import { putItem } from "../data/putItem.mjs";
import { validateIdentity } from "../helpers/validateIdentity.mjs";
import { cleanState } from "../helpers/cleanState.mjs";

export const apply = async ({ payload, auth, dynamo }) => {
  const { gameId } = payload;

  if (!gameId) {
    throw new Error("gameId is required");
  }

  //
  // 1. Load game
  //
  const item = await getItem({
    client: dynamo.client,
    tableName: dynamo.tableName,
    gameId
  });

  if (!item) {
    throw new Error("Game not found");
  }

  let { state, priv, version } = item;

  //
  // 2. Validate identity
  //
  const playerId = validateIdentity({ auth, priv });

  //
  // 3. Mark player as connected
  //
  const players = state.players.map((p) =>
    p.playerId === playerId
      ? { ...p, connected: true }
      : p
  );

  state = {
    ...state,
    players
  };

  //
  // 4. Persist updated connection status
  //
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

  //
  // 5. Return clean state
  //
  return {
    gameId,
    state: cleanState(state, playerId)
  };
};
