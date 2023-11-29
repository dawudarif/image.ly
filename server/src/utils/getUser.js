import { getTokenFromCookie } from './extractToken.js';

export const getUser = async (cookie, prisma) => {
  const token = getTokenFromCookie('jwt', cookie);
  if (token && process.env.JWT_SECRET) {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    const findUser = await prisma.account.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return findUser;
  }
};
