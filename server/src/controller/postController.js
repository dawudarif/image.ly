import { prisma } from '../../prisma/prisma.js';
import { deleteImage, getImage, getUploadPresignedUrl } from '../s3.js';

// gets upload url for post image
export const getUploadUrl = async (req, res) => {
  const fileType = req.query.type;

  const { url, key } = await getUploadPresignedUrl(fileType);

  res.json({ url, key });
};

// get posts for the feed
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

// get my posts for profile page
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

// create a new post
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

// delete post
export const deletePost = async (req, res) => {
  const { id } = req.params;

  const checkPost = await prisma.post.findFirst({
    where: { id, createdById: req.user.id },
  });

  if (!checkPost) {
    res.status(400);
  }

  const deleteLikes = await prisma.like.deleteMany({
    where: {
      postId: id,
    },
  });

  if (!deleteLikes) {
    res.status(400);
  }

  const deletedPost = await prisma.post.delete({
    where: {
      id,
      createdById: req.user.id,
    },
  });

  if (deletedPost) {
    res.status(401);
  }

  const deletePostImage = await deleteImage(deletedPost.media);

  if (deletedPost && deletePostImage && deleteLikes) {
    res.status(200).json(deletedPost);
  } else {
    res.status(500);
  }
};

// adds like to post
export const addLike = async (req, res) => {
  const { id } = req.params;

  const checkLike = await prisma.like.findFirst({
    where: {
      postId: id,
      accountId: req.user.id,
    },
  });

  if (checkLike) {
    res.status(400);
  }

  const likePost = await prisma.like.create({
    data: { postId: id, accountId: req.user.id },
  });

  res.status(200).json(likePost);
};

// removes like from post
export const removeLike = async (req, res) => {
  const { id, likeId } = req.body;

  const checkLike = await prisma.like.findFirst({
    where: {
      id: likeId,
      postId: id,
      accountId: req.user.id,
    },
  });

  if (!checkLike) {
    res.status(400);
  }

  const removeLike = await prisma.like.delete({
    where: { id: likeId, postId: id, accountId: req.user.id },
  });

  res.status(200).json(removeLike);
};
