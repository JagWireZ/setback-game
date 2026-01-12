export const getPartialItem = async ({
  client,
  tableName,
  gameId,
  attributes
}) => {
  if (!Array.isArray(attributes) || attributes.length === 0) {
    throw new Error("attributes must be a non-empty array");
  }

  // Handle reserved words by mapping each attribute to a placeholder
  const ExpressionAttributeNames = {};
  const ProjectionExpression = attributes
    .map((attr, i) => {
      const key = `#attr${i}`;
      ExpressionAttributeNames[key] = attr;
      return key;
    })
    .join(", ");

  const result = await client.send(
    new client.commands.GetCommand({
      TableName: tableName,
      Key: { gameId },
      ProjectionExpression,
      ExpressionAttributeNames
    })
  );

  return result.Item || null;
};
