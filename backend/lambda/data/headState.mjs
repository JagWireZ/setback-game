import { HeadObjectCommand } from "@aws-sdk/client-s3";

export const headState = async ({ s3: { client, bucket }, gameId }) => {
  try {
    const res = await client.send(
      new HeadObjectCommand({
        Bucket: bucket,
        Key: `games/${gameId}/state.json`
      })
    );

    return {
      exists: true,
      version: res.Metadata?.version ? Number(res.Metadata.version) : null,
      contentLength: res.ContentLength,
      lastModified: res.LastModified,
      etag: res.ETag
    };
  } catch (err) {
    if (err.$metadata?.httpStatusCode === 404) return { exists: false };
    throw err;
  }
};
