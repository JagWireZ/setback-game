import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export async function generatePresignedUrl({
  s3: { client, bucket },
  gameId
}) {
  return getSignedUrl(
    client,
    new GetObjectCommand({
      Bucket: bucket,
      Key: `games/${gameId}/state.json`
    }),
    { expiresIn: 86400 }
  );
}
