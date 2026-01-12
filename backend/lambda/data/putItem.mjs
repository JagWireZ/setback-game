import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { normalizeState } from "../helpers/normalizeState.mjs";

export const putItem = async ({ client, tableName, item }) => {
  const safe = normalizeState(item);

  await client.send(
    new PutCommand({
      TableName: tableName,
      Item: safe
    })
  );

  return safe;
};
