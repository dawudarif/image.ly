import { deleteImage } from '../s3.js';
import { prisma } from '../utils/prisma.js';

export const deletePost = async (req, res) => {
  const { id } = req.params;

  const deletePost = await prisma.post.delete({
    where: { id: Number(id) },
  });

  const deletePostImage = await deleteImage(deletePost.media);

  if (deleteImage && deletePost) {
    res.status(200).json(deletePost);
  } else {
    res.status(500);
  }
};
