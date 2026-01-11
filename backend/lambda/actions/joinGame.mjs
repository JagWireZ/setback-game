// actions/joinGame.mjs

import { generatePlayer } from "../helpers/generatePlayer.mjs";
import { cleanState } from "../helpers/cleanState.mjs";

import {
  generatePresignedUrl,
  getPrivate,
  getState,
  putPrivate,
  putState
} from "../data/index.mjs";

//
// 0. Validation (moved to top, consistent with createGame/deleteGame)
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

export const apply = async ({ payload, s3 }) => {
  const { gameId, playerName } = payload;

  //
  // 1. Load state.json + private.json from S3
  //
  let state;
  let priv;

  try {
    state = await getState({ s3, gameId });
    priv = await getPrivate({ s3, gameId });
  } catch {
    throw new Error("Game not found: " + gameId);
  }

  //
  // 2. Validate using fresh S3 state
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
  // 4. Update public state.json
  //
  const newState = {
    ...state,
    players: [...state.players, player],
    version: state.version + 1
  };

  //
  // 5. Update private.json (tokens + authorized player)
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
  // 6. Persist both objects to S3
  //
  await putState({ s3, gameId, state: newState });
  await putPrivate({ s3, gameId, privateData: newPriv });

  //
  // 7. Generate presigned URL for state.json
  //
  const url = await generatePresignedUrl({ s3, gameId });

  //
  // 8. Return cleaned state + tokens + presigned URL + gameId
  //
  return {
    gameId,
    state: cleanState({ state: newState, playerId: player.playerId }),
    playerId: player.playerId,
    playerToken,
    url
  };
};
