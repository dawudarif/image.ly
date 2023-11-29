import bcrypt from 'bcryptjs';
import { prisma } from '../../prisma/prisma.js';
import { generateToken } from '../utils/generateToken.js';
import { getImage, getUploadPresignedUrl, uploadFile } from '../s3.js';

export const authUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.account.findUnique({
    where: { email },
  });

  if (!user) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }

  const passwordValid = await bcrypt.compare(password, user.password);
  if (!passwordValid) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }

  generateToken(res, user.id);
  res.status(201).json({
    id: user.id,
    name: user.name,
    email: user.email,
  });
};

export const registerUser = async (req, res) => {
  const { name, email, password, username } = req.body;

  const emailExists = await prisma.account.findUnique({
    where: { email },
  });

  const userNameExists = await prisma.account.findUnique({
    where: { username },
  });

  if (emailExists) {
    res.status(409).json({ error: 'User with this email already exists.' });
    return;
  }

  if (userNameExists) {
    res.status(409).json({ error: 'User with this username already exists.' });
    return;
  }

  if (!email || !name || !password || !username) {
    res.status(406).json({ error: 'Necessary fields not provided' });
    return;
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await prisma.account.create({
    data: {
      email,
      username,
      name,
      password: hashedPassword,
    },
  });

  await generateToken(res, user.id);

  res.status(201).json(user);
};

export const logoutUser = async (req, res) => {
  const user = req.user;

  if (!user) {
    res
      .status(401)
      .json({ error: 'Something went wrong please try again later.' });
    return;
  }
  res.cookie('jwt', '', {
    httpOnly: true,
    secure: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'User Logged Out' });
};

export const getUserProfile = async (req, res) => {
  const user = req.user;

  if (!user) {
    res
      .status(401)
      .json({ error: 'Something went wrong please try again later.' });
    return;
  }

  res.status(200).json({
    id: user.id,
    name: user.name,
    email: user.email,
    username: user.username,
    image: user.image,
  });
};

export const getProfilePic = async (req, res) => {
  const imgUrl = req.user.id;

  const image = await getImage(imgUrl);

  return res.status(200).send(image);
};

export const updateProfilePic = async (req, res) => {
  const fileBuffer = req.file.buffer;
  const mimeType = req.file.mimetype;

  const upload = await uploadFile(fileBuffer, mimeType);
  console.log(upload);

  await prisma.account.update({
    where: {
      id: req.user.id,
    },
    data: {
      imgUrl: upload.key,
    },
  });

  return res.status(200).json({ success: true });
};
