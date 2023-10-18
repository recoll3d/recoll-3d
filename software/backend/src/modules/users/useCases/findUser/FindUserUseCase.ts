import { prisma } from '../../../../database/prismaClient';

interface IUser {
  profile_id?: string;
}

interface IProfile {
  image: string;
}

export class FindUserUseCase {
  async execute(user_id: string) {
    const user = await prisma.users.findUnique({
      where: {
        id: user_id
      },
    }) as IUser;

    const { profile_id } = user;

    const profile = await prisma.profiles.findUnique({
      where: {
        id: profile_id
      },
      select: {
        id: true,
        name: true,
        description: true,
        image: true
      }
    }) as IProfile;

    const { image, ...restProfile } = profile;

    const serializedUser = {
      ...user,
      profile: {
        ...restProfile,
        image_url: `http://localhost:3000/uploads/${image}`
      },
    };

    delete serializedUser.profile_id;

    return serializedUser;
  }
}