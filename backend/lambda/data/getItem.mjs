export const getItem = async ({ client, tableName, gameId }) => {
  const result = await client.send(
    new client.commands.GetCommand({
      TableName: tableName,
      Key: { gameId }
    })
  );

  return result.Item || null;
};
