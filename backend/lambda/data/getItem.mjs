import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { normalizeState } from "../helpers/normalizeState.mjs";

export const getItem = async ({ client, tableName, gameId }) => {
  const result = await client.send(
    new GetCommand({
      TableName: tableName,
      Key: { gameId }
    })
  );

  if (!result.Item) return null;
  return normalizeState(result.Item);
};
