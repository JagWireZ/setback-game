import { PutCommand } from "@aws-sdk/lib-dynamodb";

export const putItem = async ({ client, tableName, item }) => {
  await client.send(
    new PutCommand({
      TableName: tableName,
      Item: item
    })
  );

  return item;
};
