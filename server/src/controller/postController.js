import { prisma } from '../../prisma/prisma.js';
import { deleteImage, getImage, getUploadPresignedUrl } from '../s3.js';

export const getUploadUrl = async (req, res) => {
  const fileType = req.query.type;

  const { url, key } = await getUploadPresignedUrl(fileType);

  res.json({ url, key });
};

export const getPosts = async (req, res) => {
  const posts = await prisma.post.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      createdBy: {
        select: {
          id: true,
          username: true,
          imgUrl: true,
        },
      },
      likes: {
        where: {
          accountId: req.user.id,
        },
        select: {
          id: true,
          accountId: true,
        },
      },
      _count: {
        select: {
          likes: true,
        },
      },
    },
  });

  const getImagePromises = posts.map(async (item) => ({
    ...item,
    createdBy: {
      ...item.createdBy,
      imgUrl: await getImage(item.createdBy.imgUrl),
    },
    likes: item.likes[0],
    media: await getImage(item.media),
  }));

  const imageDataResolved = await Promise.all(getImagePromises);

  res.status(200).json(imageDataResolved);
};

export const myPosts = async (req, res) => {
  const posts = await prisma.post.findMany({
    where: {
      createdById: req.user.id,
    },
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

export const createPost = async (req, res) => {
  const { text, media, mediaType } = req.body;

  const post = await prisma.post.create({
    data: {
      createdById: req.user.id,
      caption: text,
      media,
      mediaType,
    },
  });

  res.status(200).json(post);
};

export const deletePost = async (req, res) => {
  const { id } = req.params;

  const deletePost = await prisma.post.delete({
    where: { id: id, createdById: req.user.id },
  });

  if (deletePost) {
    res.status(401);
  }

  const deletePostImage = await deleteImage(deletePost.media);

  if (deleteImage && deletePost) {
    res.status(200).json(deletePost);
  } else {
    res.status(500);
  }
};

export const addLike = async (req, res) => {
  const { id } = req.params;

  const likePost = await prisma.like.create({
    data: { postId: id, accountId: req.user.id },
  });

  res.status(200).json(likePost);
};

export const removeLike = async (req, res) => {
  const { id, likeId } = req.body;
  console.log(req.body);

  const removeLike = await prisma.like.delete({
    where: { id: likeId, postId: id, accountId: req.user.id },
  });

  res.status(200).json(removeLike);
};
