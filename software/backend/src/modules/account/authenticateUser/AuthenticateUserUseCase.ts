import { prisma } from '../../../database/prismaClient';
import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { env } from 'process';

interface IAuthenticateUser {
  username: string;
  email: string;
  password: string;
}

export class AuthenticateUserUseCase {
  async execute({ username, email, password }: IAuthenticateUser) {
    // Receber username, email e password

    // Verificar se username ou email cadastrado
    const user = await prisma.users.findFirst({
      where: {
        OR: [
          { username },
          { email },
        ],
      },
    });

    if (!user) {
      throw new Error("Invalid access credentials!");
    }

    // Verificar se a senha corresponde ao username
    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      throw new Error("Invalid access credentials!");
    }

    const invalidTokens = await prisma.invalidTokens.findFirst({
      where: {
        user_id: user.id
      }
    });

    if (invalidTokens) {
      await prisma.invalidTokens.deleteMany({
        where: {
          user_id: user.id,
        }
      });
    }

    // Gerar token
    const token = sign({ email }, env.USER_MD5_HASH as string, {
      subject: user.id,
      expiresIn: "1d",
    });

    return token;
  }
}