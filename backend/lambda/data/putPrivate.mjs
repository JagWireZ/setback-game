import { PutObjectCommand } from "@aws-sdk/client-s3";

export async function putPrivate({
  s3: { client, bucket },
  gameId,
  privateData
}) {
  await client.send(new PutObjectCommand({
    Bucket: bucket,
    Key: `games/${gameId}/private.json`,
    Body: JSON.stringify(privateData),
    ContentType: "application/json"
  }));
}
