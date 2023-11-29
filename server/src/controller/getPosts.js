import { getImage } from '../s3.js';
import { prisma } from '../utils/prisma.js';

export const getPosts = async (req, res) => {
  const posts = await prisma.post.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  const getImagePromises = posts.map(async (item) => ({
    ...item,
    media: await getImage(item.media),
  }));

  const imageDataResolved = await Promise.all(getImagePromises);

  res.status(200).json(imageDataResolved);
};
