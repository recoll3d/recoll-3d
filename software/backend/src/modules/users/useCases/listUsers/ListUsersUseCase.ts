import { prisma } from '../../../../database/prismaClient';

export class ListUsersUseCase {
  async execute() {
    const users = await prisma.users.findMany({
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        created_at: true,
        profile: {
          select: {
            id: true,
            name: true
          },
        },
      },
    });

    return users;
  }
}