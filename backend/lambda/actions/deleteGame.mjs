import { getItem } from "../data/getItem.mjs";
import { deleteItem } from "../data/deleteItem.mjs";
import { validateIdentity } from "../helpers/validateIdentity.mjs";

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
  // 1. Validate identity (playerId + token match)
  //
  const playerId = validateIdentity({ auth, priv });

  //
  // 2. Only the game creator can delete the game
  //
  if (state.ownerId !== playerId || auth.playerToken !== priv.ownerToken) {
    throw new Error("Only the game creator can delete this game");
  }

  //
  // 3. Delete the game record
  //
  await deleteItem({
    client: dynamo.client,
    tableName: dynamo.tableName,
    gameId
  });

  //
  // 4. Return confirmation
  //
  return {
    gameId,
    deleted: true
  };
};
