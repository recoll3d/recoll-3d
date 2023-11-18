import { prisma } from '../../../../database/prismaClient';

interface IProfile {
  image: string;
}

export class FindUserUseCase {
  async execute(user_id: string) {
    if (!user_id) {
      return {};
    }

    const user = await prisma.users.findUnique({
      where: {
        id: user_id
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        profile: {
          select: {
            id: true,
            name: true,
            image: true,
          }
        },
        level: {
          select: {
            id: true,
            name: true,
            position: true,
          }
        },
        created_at: true,
      },
    });

    // const { profile_id } = user;

    // const profile = await prisma.profiles.findUnique({
    //   where: {
    //     id: profile_id
    //   },
    //   select: {
    //     id: true,
    //     name: true,
    //     description: true,
    //     image: true
    //   },
    // }) as IProfile;

    // const { image, ...restProfile } = profile;

    // const serializedUser = {
    //   ...user,
    //   profile: {
    //     ...restProfile,
    //     image_url: `http://localhost:3000/uploads/${image}`
    //   },
    // };

    // delete serializedUser.profile_id;

    // return serializedUser;

    const { image, ...restProfile } = user?.profile as IProfile;

    const serializedUser = {
      ...user,
      profile: {
        ...restProfile,
        image_url: `http://localhost:3333/uploads/${image}`
      }
    }

    return serializedUser;
  }
}