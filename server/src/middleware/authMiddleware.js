import jwt from 'jsonwebtoken';
import { prisma } from '../../prisma/prisma.js';

const protect = async (req, res, next) => {
  let token;
  token = await req.headers.cookie;

  if (token && process.env.JWT_SECRET) {
    try {
      const cookies = token.split('; ');
      const jwtCookie = cookies.find((cookie) => cookie.startsWith('jwt='));

      if (jwtCookie) {
        const jwtValue = jwtCookie.split('=')[1];
        token = jwtValue;
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const findUser = await prisma.account.findUnique({
        where: {
          id: decoded?.userId,
        },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          username: true,
          imgUrl: true,
        },
      });

      req.user = findUser;

      next();
    } catch (error) {
      res.status(401);
      console.log(error);
      throw new Error('Not authorized, invalid token');
    }
  } else {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
};

export { protect };
