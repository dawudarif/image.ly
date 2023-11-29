import bcrypt from 'bcryptjs';
import { prisma } from '../../prisma/prisma.js';
import { generateToken } from '../utils/generateToken.js';

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
