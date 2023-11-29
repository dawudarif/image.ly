import { prisma } from '../utils/prisma.js';

export const getPost = async (req, res) => {
  const { text, media, mediaType } = req.body;

  const post = await prisma.post.create({
    data: {
      caption: text,
      media,
      mediaType,
    },
  });

  res.status(200).json(post);
};
