import { generatePlayer } from "../helpers/generatePlayer.mjs";
import { cleanState } from "../helpers/cleanState.mjs";

import { getItem } from "../data/getItem.mjs";
import { putItem } from "../data/putItem.mjs";

//
// 0. Validation (top-level, consistent with createGame/deleteGame)
//
const validate = ({ gameState, payload }) => {
  const { gameId, playerName } = payload;

  if (gameId == null) {
    throw new Error("gameId is required");
  }

  if (playerName == null) {
    throw new Error("playerName is required");
  }

  if (gameState.started) {
    throw new Error("Game already started");
  }

  if (gameState.players.length >= 5) {
    throw new Error("Game already has the maximum number of players");
  }

  const nameExists = gameState.players.some(
    (p) => p.name.toLowerCase() === playerName.toLowerCase()
  );

  if (nameExists) {
    throw new Error("A player with that name already exists");
  }
};

export const apply = async ({ payload, dynamo }) => {
  const { gameId, playerName } = payload;

  //
  // 1. Load full DynamoDB item (state + priv)
  //
  let item;
  try {
    item = await getItem({
      client: dynamo.client,
      tableName: dynamo.tableName,
      gameId
    });
  } catch {
    throw new Error("Game not found: " + gameId);
  }

  const { state, priv } = item;

  //
  // 2. Validate using fresh DB state
  //
  validate({ gameState: state, payload });

  //
  // 3. Create new player
  //
  const { player, playerToken } = generatePlayer({
    playerName,
    seat: state.players.length
  });

  //
  // 4. Update public state
  //
  const newState = {
    ...state,
    players: [...state.players, player],
    version: state.version + 1
  };

  //
  // 5. Update private section (tokens + authorized player)
  //
  const newPriv = {
    ...priv,
    playerTokens: {
      ...priv.playerTokens,
      [player.playerId]: playerToken
    },
    authorizedToken: playerToken
  };

  //
  // 6. Persist updated item to DynamoDB
  //
  await putItem({
    client: dynamo.client,
    tableName: dynamo.tableName,
    item: {
      gameId,
      state: newState,
      priv: newPriv
    }
  });

  //
  // 7. Return cleaned state + tokens + gameId
  //
  return {
    gameId,
    state: cleanState({ state: newState, playerId: player.playerId }),
    playerId: player.playerId,
    playerToken
  };
};
