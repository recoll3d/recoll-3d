import { prisma } from '../../../../database/prismaClient';

interface ICreateProfile {
  name: string;
  description: string;
  image: string;
}

export class CreateProfileUseCase {
  async execute({ name, description, image }: ICreateProfile) {

    // const profileExist = await prisma.profile.findFirst({
    //   where: {
    //     name: {
    //       mode: "insensitive",
    //     },
    //   },
    // });

    // if (profileExist) {
    //   throw new Error("Profile already exists");
    // }

    const profile = await prisma.profile.create({
      data: {
        name,
        description,
        image,
      }
    });

    return profile;
  }
}