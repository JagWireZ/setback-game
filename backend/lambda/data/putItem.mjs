export const putItem = async ({ client, tableName, item }) => {
  await client.send(
    new client.commands.PutCommand({
      TableName: tableName,
      Item: item
    })
  );

  return item;
};
