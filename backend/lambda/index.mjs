// index.mjs
//
// Unified Lambda entrypoint for all S3-based game actions.

import { S3Client } from "@aws-sdk/client-s3";
import { cleanState } from "./helpers/cleanState.mjs";
import { getPrivate } from "./data/getPrivate.mjs";

// Explicit action imports
import { apply as createGame } from "./actions/createGame.mjs";
import { apply as joinGame } from "./actions/joinGame.mjs";
import { apply as deleteGame } from "./actions/deleteGame.mjs";
import { apply as startGame } from "./actions/startGame.mjs";

// Add more as you convert them:
// import { apply as playCard } from "./actions/playCard.mjs";
// import { apply as submitBid } from "./actions/submitBid.mjs";
// import { apply as endRound } from "./actions/endRound.mjs";

const ACTIONS = {
  createGame,
  joinGame,
  deleteGame,
  startGame
  // playCard,
  // submitBid,
  // endRound
};

// Initialize S3 client once
const s3 = {
  client: new S3Client({}),
  bucket: process.env.BUCKET_NAME
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
    const { action, payload, auth, gameId } = body;

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
      const result = await mod({ payload, auth, s3 });

      return {
        statusCode: 200,
        body: JSON.stringify(result)
      };
    }

    //
    // 2. All other actions require:
    //    - loading private.json
    //    - validating token
    //
    let priv;
    try {
      priv = await getPrivate({ s3, gameId });
    } catch {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Game not found" })
      };
    }

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
    const result = await mod({ payload, auth, s3 });

    //
    // 4. If the action returned a state, clean it
    //
    if (result?.state) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          ...result,
          state: cleanState({ state: result.state, playerId: auth.playerId })
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
