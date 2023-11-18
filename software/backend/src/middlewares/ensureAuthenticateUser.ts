import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { env } from 'process';
import { prisma } from '../database/prismaClient';

interface IPayload {
  sub: string;
}

export async function ensureAuthenticateUser(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    return response.status(401).json({
      message: "Token missing",
    });
  }

  const unauthorizedToken = await prisma.invalidTokens.findFirst({
    where: {
      token: authHeader,
    }
  });

  if (unauthorizedToken) {
    return response.status(401).json({
      message: "Token unauthorized"
    });
  }

  const [, token] = authHeader.split(" ");

  try {
    const { sub } = verify(
      token,
      env.USER_MD5_HASH as string
    ) as IPayload;

    // const days = 1;

    // response.cookie('token', token, {
    //   expires: new Date(Date.now() + days * 24 * 60 * 60 * 1000),
    //   httpOnly: true,
    // });

    request.user_id = sub;

    return next();
  } catch (err) {
    return response.status(401).json({
      message: "Invalid token!",
    });
  }
}