import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

// Action modules
import * as createGame from "./actions/createGame.mjs";
import * as joinGame from "./actions/joinGame.mjs";
import * as startGame from "./actions/startGame.mjs";
import * as deal from "./actions/deal.mjs";
import * as submitBid from "./actions/submitBid.mjs";
import * as playCard from "./actions/playCard.mjs";
import * as postRound from "./actions/postRound.mjs";
import * as deleteGame from "./actions/deleteGame.mjs";
import * as reconnect from "./actions/reconnect.mjs";
import * as getGame from "./actions/getGame.mjs";

const raw = new DynamoDBClient({ region: process.env.AWS_REGION });
globalThis.dynamoClient = DynamoDBDocumentClient.from(raw);

// Registry
const ACTIONS = {
  createGame,
  joinGame,
  startGame,
  deal,
  submitBid,
  playCard,
  postRound,
  deleteGame,
  reconnect,
  getGame
};

// Public actions do NOT require auth
const PUBLIC_ACTIONS = new Set([
  "createGame",
  "joinGame"
]);

export const handler = async (event) => {
  try {
    //
    // 1. Parse request
    //
    let body;
    try {
      body = JSON.parse(event.body || "{}");
    } catch {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid JSON body" })
      };
    }

    const { action, payload, auth } = body;

    //
    // 2. Validate action
    //
    if (!action || typeof action !== "string") {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing or invalid action" })
      };
    }

    const mod = ACTIONS[action];
    if (!mod) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: `Unknown action: ${action}` })
      };
    }

    //
    // 3. Validate identity for protected actions
    //
    if (!PUBLIC_ACTIONS.has(action)) {
      if (!auth || !auth.playerId || !auth.playerToken) {
        return {
          statusCode: 401,
          body: JSON.stringify({ error: "Missing player identity" })
        };
      }
    }

    //
    // 4. Dynamo context
    //
    const dynamo = {
      client: dynamoClient, // injected by Lambda bootstrap
      tableName: process.env.TABLE_NAME
    };

    //
    // 5. Execute action
    //
    const result = await mod.apply({
      payload,
      auth,
      dynamo
    });

    //
    // 6. Return result
    //
    return {
      statusCode: 200,
      body: JSON.stringify(result)
    };

  } catch (err) {
    console.error("Lambda error:", err);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: err.message || "Internal server error"
      })
    };
  }
};
