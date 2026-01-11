import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { cleanState } from "./helpers/cleanState.mjs";

import { getItem } from "./data/getItem.mjs";

// Explicit action imports
import { apply as createGame } from "./actions/createGame.mjs";
import { apply as joinGame } from "./actions/joinGame.mjs";
import { apply as deleteGame } from "./actions/deleteGame.mjs";
import { apply as startGame } from "./actions/startGame.mjs";

const ACTIONS = {
  createGame,
  joinGame,
  deleteGame,
  startGame
};

// Initialize DynamoDB client once
const dynamo = {
  client: new DynamoDBClient({}),
  tableName: process.env.TABLE_NAME
};

// Safe body parsing
const parseBody = (event) => {
  let body = event.body;

  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      throw new Error("Invalid JSON body");
    }
  }

  if (!body || typeof body !== "object") {
    throw new Error("Missing request body");
  }

  return body;
};

export const handler = async (event) => {
  try {
    const body = parseBody(event);
    const { action, payload, auth } = body;

    const mod = ACTIONS[action];
    if (!mod) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: `Unknown action: ${action}` })
      };
    }

    //
    // 1. Actions that do NOT require loading existing state
    //
    if (action === "createGame" || action === "joinGame") {
      const result = await mod({ payload, auth, dynamo });

      return {
        statusCode: 200,
        body: JSON.stringify(result)
      };
    }

    //
    // 2. All other actions require:
    //    - loading DynamoDB item
    //    - validating token
    //
    const gameId = payload?.gameId;

    if (!gameId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "gameId is required" })
      };
    }

    let item;
    try {
      item = await getItem({
        client: dynamo.client,
        tableName: dynamo.tableName,
        gameId
      });
    } catch {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Game not found" })
      };
    }

    const { priv } = item;

    // Token validation
    if (!auth || priv.playerTokens[auth.playerId] !== auth.playerToken) {
      return {
        statusCode: 403,
        body: JSON.stringify({ error: "Invalid player token" })
      };
    }

    //
    // 3. Execute action
    //
    const result = await mod({ payload, auth, dynamo });

    //
    // 4. If the action returned a state, clean it
    //
    if (result?.state) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          ...result,
          state: cleanState({
            state: result.state,
            playerId: auth.playerId
          })
        })
      };
    }

    //
    // 5. Otherwise return raw result
    //
    return {
      statusCode: 200,
      body: JSON.stringify(result)
    };

  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: err.message })
    };
  }
};
