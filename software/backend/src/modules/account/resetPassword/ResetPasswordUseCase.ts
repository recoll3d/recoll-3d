import { prisma } from '../../../database/prismaClient';
import { hash } from 'bcrypt';

interface IUser {
  reset_token: string;
}

export class ResetPasswordUseCase {
  async execute(token: string, password: string) {
    if (!token) {
      throw new Error("Invalid or expired password reset token!");
    }

    const userTokenExists = await prisma.users.findFirst({
      where: {
        reset_token: {
          token,
        },
      },
    });

    if (!userTokenExists) {
      throw new Error("Invalid or expired password reset token!");
    }

    const hashPassword = await hash(password, 10);

    const result = await prisma.users.update({
      where: {
        id: userTokenExists.id
      },
      data: {
        password: hashPassword
      },
    });

    await prisma.resetTokens.delete({
      where: {
        user_id: userTokenExists.id
      }
    });

    return result;
  }
}