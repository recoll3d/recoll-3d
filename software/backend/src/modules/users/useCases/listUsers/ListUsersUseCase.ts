import { prisma } from '../../../../database/prismaClient';

export class ListUsersUseCase {
  async execute() {
    const users = await prisma.users.findMany({
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        profile: {
          select: {
            id: true,
            name: true,
          },
        },
        level: {
          select: {
            id: true,
            name: true,
            position: true,
            unlocked: true,
          }
        },
        created_at: true,
      },
    });

    // const serializedUsers = users.map(user => {

    // })

    return users;
  }
}