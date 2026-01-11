import { GetObjectCommand } from "@aws-sdk/client-s3";

export async function getState({ s3: { client, bucket }, gameId }) {
  const res = await client.send(new GetObjectCommand({
    Bucket: bucket,
    Key: `games/${gameId}/state.json`
  }));

  return JSON.parse(await res.Body.transformToString());
}
