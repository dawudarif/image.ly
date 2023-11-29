import { getUploadPresignedUrl } from '../s3.js';

export const getUploadUrl = async (req, res) => {
  const fileType = req.query.type;
  const { url, key } = await getUploadPresignedUrl(fileType);

  res.json({ url, key });
};
