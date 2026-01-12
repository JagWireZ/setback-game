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

  let { state, priv } = item;

  //
  // 2. Validate identity
  //
  const playerId = validateIdentity({ auth, priv });

  //
  // 3. Ensure player is actually in the game
  //
  if (!state.players.some(p => p.playerId === playerId)) {
    throw new Error("Player not in this game");
  }

  //
  // 4. Mark player as connected
  //
  state.players = state.players.map(p =>
    p.playerId === playerId
      ? { ...p, connected: true }
      : p
  );

  //
  // 5. Increment version
  //
  state.version += 1;

  //
  // 6. Persist updated connection status
  //
  await putItem({
    client: dynamo.client,
    tableName: dynamo.tableName,
    item: {
      gameId,
      state,
      priv
    }
  });

  //
  // 7. Return clean state
  //
  return {
    gameId,
    state: cleanState(state, playerId)
  };
};
