import { getItem } from "../data/getItem.mjs";
import { putItem } from "../data/putItem.mjs";
import { validateIdentity } from "../helpers/validateIdentity.mjs";
import { cleanState } from "../helpers/cleanState.mjs";
import { assertPhase } from "../engine/validate.mjs";
import { PHASES, advance } from "../engine/stateMachine.mjs";

export const apply = async ({ payload, auth, dynamo }) => {
  const { gameId } = payload;

  if (!gameId) {
    throw new Error("gameId is required");
  }

  const item = await getItem({
    client: dynamo.client,
    tableName: dynamo.tableName,
    gameId
  });

  if (!item) {
    throw new Error("Game not found");
  }

  let { state, priv } = item;

  const playerId = validateIdentity({ auth, priv });

  //
  // 1. Only owner can start (must match ownerId + ownerToken)
  //
  if (state.ownerId !== playerId || auth.playerToken !== priv.ownerToken) {
    throw new Error("Only the game creator can start the game");
  }

  //
  // 2. Must be in LOBBY
  //
  assertPhase(state, PHASES.LOBBY);

  //
  // 3. Must have exactly 5 players
  //
  if (state.players.length !== 5) {
    throw new Error("Game requires exactly 5 players to start");
  }

  //
  // 4. Assign first dealer (seat 0)
  //
  state.dealerId = state.players[0].playerId;

  //
  // 5. Move from LOBBY → PRE_ROUND
  //
  state = advance(state);

  //
  // 6. Increment version
  //
  state.version += 1;

  //
  // 7. Persist
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
  // 8. Return clean state
  //
  return {
    gameId,
    state: cleanState(state, playerId)
  };
};
