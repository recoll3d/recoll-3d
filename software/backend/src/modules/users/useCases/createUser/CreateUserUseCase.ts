import { prisma } from '../../../../database/prismaClient'
import { hash } from 'bcrypt';

interface ICreateUser {
  name: string;
  username: string;
  email: string;
  password: string;
  profile_id: string;
}

export class CreateUserUseCase {
  async execute({ name, username, email, password, profile_id }: ICreateUser) {
    const userExist = await prisma.users.findFirst({
      where: {
        username,
        email,
      }
    });

    if (userExist) {
      throw new Error("Username or email already exists");
    }

    const hashPassword = await hash(password, 10);

    const user = await prisma.users.create({
      data: {
        name,
        username,
        email,
        password: hashPassword,
        profile_id,
      }
    });

    return user;
  }
}