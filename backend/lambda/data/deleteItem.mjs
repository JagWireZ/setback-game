import { DeleteCommand } from "@aws-sdk/lib-dynamodb";

export const deleteItem = async ({ client, tableName, gameId }) => {
  await client.send(
    new DeleteCommand({
      TableName: tableName,
      Key: { gameId }
    })
  );

  return true;
};
