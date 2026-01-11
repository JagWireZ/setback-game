import { getItem } from "../data/getItem.mjs";
import { deleteItem } from "../data/deleteItem.mjs";

//
// 0. Validation (top-level, consistent with createGame)
//
const validate = ({ payload, priv, playerToken }) => {
  if (payload.gameId == null) {
    throw new Error("gameId is required");
  }

  if (!priv) {
    throw new Error("Game not found");
  }

  if (priv.ownerToken !== playerToken) {
    throw new Error("Only the game creator can delete this game");
  }
};

export const apply = async ({ payload, auth, dynamo }) => {
  const { gameId } = payload;
  const { playerToken } = auth;

  //
  // 1. Load full game item (state + priv)
  //
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

  const { priv } = item;

  //
  // 2. Validate permissions + payload
  //
  validate({ payload, priv, playerToken });

  //
  // 3. Delete the DynamoDB item
  //
  await deleteItem({
    client: dynamo.client,
    tableName: dynamo.tableName,
    gameId
  });

  //
  // 4. Return success
  //
  return {
    ok: true,
    message: "Game deleted",
    gameId
  };
};
