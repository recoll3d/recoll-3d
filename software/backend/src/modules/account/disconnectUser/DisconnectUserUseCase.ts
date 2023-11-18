import { response } from 'express';
import { prisma } from '../../../database/prismaClient';
import Cookies from 'js-cookie';

interface IInvalidTokens {
  authHeader: string;
  user_id: string;
}

export class DisconnectUserUseCase {
  async execute({ authHeader, user_id }: IInvalidTokens) {
    const tokenExist = await prisma.invalidTokens.findFirst({
      where: {
        token: authHeader,
      }
    });

    if (tokenExist) {
      throw new Error("Token already exists in list of invalid tokens!");
    }

    const token = await prisma.invalidTokens.create({
      data: {
        token: authHeader,
        user_id,
      }
    });

    // response.cookie('token', undefined);
    Cookies.remove('token');

    return token;
  }
}