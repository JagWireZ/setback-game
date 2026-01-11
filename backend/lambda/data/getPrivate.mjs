import { GetObjectCommand } from "@aws-sdk/client-s3";

export async function getPrivate({ s3: { client, bucket }, gameId }) {
  const res = await client.send(new GetObjectCommand({
    Bucket: bucket,
    Key: `games/${gameId}/private.json`
  }));

  return JSON.parse(await res.Body.transformToString());
}
