import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

export const getPartialItem = async ({
  client,
  tableName,
  gameId,
  attributes
}) => {
  const ProjectionExpression = attributes.join(", ");

  const res = await client.send(
    new GetItemCommand({
      TableName: tableName,
      Key: { gameId: { S: gameId } },
      ProjectionExpression
    })
  );

  if (!res.Item) {
    throw new Error("Game not found");
  }

  return unmarshall(res.Item);
};
