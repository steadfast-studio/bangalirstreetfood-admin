import { S3Client } from "@aws-sdk/client-s3";

/**
 * Shared S3 client instance
 * Reuses connection for better performance
 */
const s3ClientConfig: {
  region?: string;
  credentials?: {
    accessKeyId: string;
    secretAccessKey: string;
  };
} = {
  region: process.env.AWS_REGION,
};

if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_KEY_ID) {
  s3ClientConfig.credentials = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY_ID,
  };
}

export const s3Client = new S3Client({
  ...s3ClientConfig,
});

/**
 * Constructs the public URL for an S3 object
 */
export function getS3PublicUrl(key: string): string {
  return `https://${process.env.AWS_BUCKET_NAME_ID}.s3.${process.env.AWS_REGION_ID}.amazonaws.com/${key}`;
}

/**
 * Sanitizes file name to prevent security issues
 */
export function sanitizeFileName(fileName: string): string {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, "_").replace(/\.{2,}/g, ".");
}

/**
 * Validates file type against allowed types
 */
export function isValidFileType(
  fileType: string,
  allowedTypes: string[] = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/avif",
    "image/gif",
  ],
): boolean {
  return allowedTypes.includes(fileType);
}
