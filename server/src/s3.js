import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

const generateFileName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString('hex');

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const s3Client = new S3Client({
  region: region,
  credentials: {
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
  },
});

export const getUploadPresignedUrl = async (fileType) => {
  const key = `${generateFileName()}.${fileType.split('/')[1]}`;

  const params = {
    Bucket: bucketName,
    Key: key,
    ContentType: fileType,
  };

  const command = new PutObjectCommand(params);
  const url = await getSignedUrl(s3Client, command, { expiresIn: 60 * 5 });

  return { url, key };
};

export const uploadFile = async (fileBuffer, mimetype) => {
  const key = `${generateFileName()}.${mimetype.split('/')[1]}`;

  const uploadParams = {
    Bucket: bucketName,
    Body: fileBuffer,
    Key: key,
    ContentType: mimetype,
  };

  const command = new PutObjectCommand(uploadParams);

  const response = await s3Client.send(command);

  return { key, response };
};

export const getImage = async (key) => {
  const params = {
    Bucket: bucketName,
    Key: key,
  };

  const command = new GetObjectCommand(params);
  const seconds = 3600;
  const url = await getSignedUrl(s3Client, command, { expiresIn: seconds });

  return url;
};

export const deleteImage = async (key) => {
  const deleteParams = {
    Bucket: bucketName,
    Key: key,
  };

  return s3Client.send(new DeleteObjectCommand(deleteParams));
};
