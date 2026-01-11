// actions/deleteGame.mjs

import { deleteState, deletePrivate, getPrivate } from "../data/index.mjs";

//
// 0. Validation (moved to top, consistent with createGame)
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

export const apply = async ({ payload, auth, s3 }) => {
  const { gameId } = payload;
  const { playerToken } = auth;

  //
  // 1. Load private.json (contains ownerToken)
  //
  let priv;
  try {
    priv = await getPrivate({ s3, gameId });
  } catch {
    throw new Error("Game not found");
  }

  //
  // 2. Validate permissions + payload
  //
  validate({ payload, priv, playerToken });

  //
  // 3. Delete both S3 objects
  //
  await deleteState({ s3, gameId });
  await deletePrivate({ s3, gameId });

  //
  // 4. Return success
  //
  return {
    ok: true,
    message: "Game deleted",
    gameId
  };
};
