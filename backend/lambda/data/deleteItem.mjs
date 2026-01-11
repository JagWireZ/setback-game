import { DeleteItemCommand } from "@aws-sdk/client-dynamodb";

export const deleteItem = async ({ client, tableName, gameId }) => {
  await client.send(
    new DeleteItemCommand({
      TableName: tableName,
      Key: { gameId: { S: gameId } }
    })
  );
};
