// actions/joinGame.mjs

import { getItem } from "../data/getItem.mjs";
import { putItem } from "../data/putItem.mjs";
import { generatePlayer } from "../helpers/generatePlayer.mjs";
import { addPlayerToState } from "../helpers/addPlayerToState.mjs";
import { cleanState } from "../helpers/cleanState.mjs";
import { PHASES } from "../engine/stateMachine.mjs";

export const apply = async ({ payload, auth, dynamo }) => {
  const { gameId, name } = payload;

  if (!gameId) {
    throw new Error("gameId is required");
  }

  if (!name || typeof name !== "string" || !name.trim()) {
    throw new Error("Player name is required");
  }

  const trimmedName = name.trim();

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
  // 1. Game must be in lobby
  //
  if (state.phase.name !== PHASES.LOBBY) {
    throw new Error("Cannot join a game that has already started");
  }

  //
  // 2. Game must not be full
  //
  if (state.players.length >= 5) {
    throw new Error("Game is full");
  }

  //
  // 3. Name must be unique
  //
  if (state.players.some(p => p.name.toLowerCase() === trimmedName.toLowerCase())) {
    throw new Error("A player with that name already exists");
  }

  //
  // 4. Generate new player identity
  //
  const { playerId, playerToken } = generatePlayer();

  //
  // 5. Add player to state
  //
  state = addPlayerToState(state, {
    playerId,
    name: trimmedName
  });

  //
  // 6. Update private token map
  //
  priv.playerTokens[playerId] = playerToken;
  priv.authorizedToken = playerToken;

  //
  // 7. Increment version
  //
  state.version += 1;

  //
  // 8. Persist
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
  // 9. Return clean state
  //
  return {
    gameId,
    playerId,
    playerToken,
    state: cleanState(state, playerId)
  };
};
