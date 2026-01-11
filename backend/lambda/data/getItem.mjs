import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

export const getItem = async ({ client, tableName, gameId }) => {
  const res = await client.send(
    new GetItemCommand({
      TableName: tableName,
      Key: { gameId: { S: gameId } }
    })
  );

  if (!res.Item) {
    throw new Error("Game not found");
  }

  return unmarshall(res.Item);
};
