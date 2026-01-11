import { generatePlayer } from "../helpers/generatePlayer.mjs";
import { generateGameId } from "../helpers/generateGameId.mjs";
import { generateRounds } from "../helpers/generateRounds.mjs";
import { generateState } from "../helpers/generateState.mjs";
import { cleanState } from "../helpers/cleanState.mjs";

import { generatePresignedUrl, putPrivate, putState } from "../data/index.mjs";

const validate = (payload) => {
  if (payload.maxCards == null) throw new Error("maxCards is required");
  if (payload.playerName == null) throw new Error("playerName is required");
};

export const apply = async ({ payload, s3 }) => {
  validate(payload);

  const { maxCards, playerName } = payload;

  //
  // 1. Create initial player
  //
  const { player, playerToken } = generatePlayer({
    playerName,
    seat: 0
  });

  //
  // 2. Create game metadata
  //
  const gameId = generateGameId();
  const rounds = generateRounds({ maxCards });

  //
  // 3. Build initial state.json (public)
  //
  const base = generateState();

  const state = {
    ...base,
    gameId,
    options: {
      ...base.options,
      gameRounds: rounds
    },
    players: [player],
    phase: {
      ...base.phase,
      turnPlayerId: player.playerId
    },
    version: 1
  };

  //
  // 4. Build private.json (never exposed to clients)
  //
  const priv = {
    ownerToken: playerToken,
    authorizedToken: playerToken,
    playerTokens: {
      [player.playerId]: playerToken
    }
  };

  //
  // 5. Persist both objects to S3
  //
  await putState({ s3, state, gameId });
  await putPrivate({ s3, gameId, privateData: priv });

  //
  // 6. Generate presigned URL for the client to fetch state.json
  //
  const url = await generatePresignedUrl({ s3, gameId });

  //
  // 7. Return initial state to the client
  //
  return {
    gameId,
    state: cleanState({ state, playerId: player.playerId }),
    playerId: player.playerId,
    playerToken,
    url
  };
};
