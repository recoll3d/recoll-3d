import { prisma } from '../../../../database/prismaClient';

interface ICreateProfile {
  name: string;
  description: string;
  // images: any;
  image: string;
}

export class CreateProfileUseCase {
  async execute({ name, description, image }: ICreateProfile) {

    const profileExist = await prisma.profiles.findFirst({
      where: {
        name: {
          equals: name,
          mode: "insensitive",
        },
      },
    });

    if (profileExist) {
      throw new Error("Profile already exists");
    }

    const profile = await prisma.profiles.create({
      data: {
        name,
        description,
        image,
        // image: images["profile_image"].map((file: any) => file.filename),
      }
    });

    // const data = {
    //   name,
    //   description,
    //   profile_image: images["profile_image"].map((file: any) => file.filename),
    //   level_image: images["level_image"].map((file: any) => file.filename),
    // }

    return profile;
  }
}