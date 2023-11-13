import { prisma } from '../../../../database/prismaClient';

export class ListProfilesUseCase {
  async execute() {
    const profiles = await prisma.profiles.findMany({
      include: {
        levels: true,
      }
    });

    const serializedProfiles = profiles.map(profile => {
      const { image, ...rest } = profile;

      return {
        ...rest,
        image_url: `http://recoll3d.com.br:3333/uploads/${image}`
      };
    });

    return serializedProfiles;
  }
}