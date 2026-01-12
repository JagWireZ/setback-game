export const deleteItem = async ({ client, tableName, gameId }) => {
  await client.send(
    new client.commands.DeleteCommand({
      TableName: tableName,
      Key: { gameId }
    })
  );

  return true;
};
