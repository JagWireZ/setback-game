// actions/createGame.mjs

import crypto from "node:crypto";
import { putItem } from "../data/putItem.mjs";
import { generatePlayer } from "../helpers/generatePlayer.mjs";
import { generateState } from "../helpers/generateState.mjs";
import { generateRounds } from "../helpers/generateRounds.mjs";
import { addPlayerToState } from "../helpers/addPlayerToState.mjs";
import { cleanState } from "../helpers/cleanState.mjs";

export const apply = async ({ payload, auth, dynamo }) => {
  const { playerName, maxCards } = payload;

  //
  // 1. Validate inputs
  //
  if (!playerName || typeof playerName !== "string") {
    throw new Error("playerName is required");
  }

  if (
    typeof maxCards !== "number" ||
    !Number.isInteger(maxCards) ||
    maxCards < 1 ||
    maxCards > 10
  ) {
    throw new Error("maxCards must be between 1 and 10");
  }

  //
  // 2. Generate identity for the creator
  //
  const { playerId, playerToken } = generatePlayer();

  //
  // 3. Generate canonical rounds
  //
  const rounds = generateRounds({ maxCards });

  //
  // 4. Build initial empty state
  //
  let state = generateState({
    ownerId: playerId,
    players: [],
    options: { rounds }
  });

  //
  // 5. Add the creator as the first player
  //
  state = addPlayerToState(state, {
    playerId,
    name: playerName
  });

  //
  // 6. Add version to state
  //
  state.version = 1;

  //
  // 7. Private token map
  //
  const priv = {
    ownerToken: playerToken,
    authorizedToken: playerToken,
    playerTokens: {
      [playerId]: playerToken
    }
  };

  //
  // 8. Persist
  //
  const gameId = crypto.randomUUID();

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
  // 9. Return clean state
  //
  return {
    gameId,
    playerId,
    playerToken,
    state: cleanState(state, playerId)
  };
};
