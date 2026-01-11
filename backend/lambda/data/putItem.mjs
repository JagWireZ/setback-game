import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";

export const putItem = async ({ client, tableName, item }) => {
  await client.send(
    new PutItemCommand({
      TableName: tableName,
      Item: marshall(item)
    })
  );
};
