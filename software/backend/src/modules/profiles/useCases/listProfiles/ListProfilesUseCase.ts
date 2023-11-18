import { request } from 'express';
import { prisma } from '../../../../database/prismaClient';
import Cookies from 'js-cookie';

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
        image_url: `http://localhost:3333/uploads/${image}`
      };
    });

    const token = Cookies.get("token");
    console.log(token);

    return serializedProfiles;
  }
}