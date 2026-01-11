import { generatePlayer } from "../helpers/generatePlayer.mjs";
import { generateGameId } from "../helpers/generateGameId.mjs";
import { generateRounds } from "../helpers/generateRounds.mjs";
import { generateState } from "../helpers/generateState.mjs";
import { cleanState } from "../helpers/cleanState.mjs";

import { putItem } from "../data/putItem.mjs";

const validate = (payload) => {
  if (payload.maxCards == null) throw new Error("maxCards is required");
  if (payload.playerName == null) throw new Error("playerName is required");
};

export const apply = async ({ payload, dynamo }) => {
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
  // 3. Build initial public state
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
  // 4. Build private section (never exposed to clients)
  //
  const priv = {
    ownerToken: playerToken,
    authorizedToken: playerToken,
    playerTokens: {
      [player.playerId]: playerToken
    }
  };

  //
  // 5. Build DynamoDB item (single record)
  //
  const item = {
    gameId,
    state,
    priv
  };

  //
  // 6. Persist to DynamoDB
  //
  await putItem({
    client: dynamo.client,
    tableName: dynamo.tableName,
    item
  });

  //
  // 7. Return initial state to the client
  //
  return {
    gameId,
    state: cleanState({ state, playerId: player.playerId }),
    playerId: player.playerId,
    playerToken
  };
};
