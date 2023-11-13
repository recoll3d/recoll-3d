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
        OR: [
          {
            username: {
              equals: username,
              mode: "insensitive",
            },
          },
          {
            email: {
              equals: email,
              mode: "insensitive",
            },
          }
        ]
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
        profile: {
          connect: {
            id: profile_id,
          }
        },
      }
    });

    const level = await prisma.levels.findFirst({
      where: {
        profile_id,
        position: 1,
      },
    });

    const updatedUser = await prisma.users.update({
      where: {
        id: user.id,
      },
      data: {
        level: {
          connect: {
            id: level?.id,
          },
          update: {
            unlocked: true,
          },
        },
      },
    });

    return updatedUser;
  }
}