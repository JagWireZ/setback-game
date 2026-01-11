import { DeleteObjectCommand } from "@aws-sdk/client-s3";

export async function deleteState({ s3: { client, bucket }, gameId }) {
  await client.send(new DeleteObjectCommand({
    Bucket: bucket,
    Key: `games/${gameId}/state.json`
  }));
}
