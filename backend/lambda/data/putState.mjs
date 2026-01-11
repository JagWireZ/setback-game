import { PutObjectCommand } from "@aws-sdk/client-s3";

export async function putState({
  s3: { client, bucket },
  gameId,
  state
}) {
  await client.send(new PutObjectCommand({
    Bucket: bucket,
    Key: `games/${gameId}/state.json`,
    Body: JSON.stringify(state),
    ContentType: "application/json",
    Metadata: { version: String(state.version) }
  }));
}
