import { prisma } from '../../../../database/prismaClient';

export class ListProfilesUseCase {
  async execute() {
    const profiles = await prisma.profiles.findMany();

    const serializedProfiles = profiles.map(profile => {
      const { image, ...rest } = profile

      return {
        ...rest,
        image_url: `http://localhost:3000/uploads/${image}`
      };
    });

    return serializedProfiles;
  }
}