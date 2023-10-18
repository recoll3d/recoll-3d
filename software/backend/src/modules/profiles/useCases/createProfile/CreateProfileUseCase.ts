import { prisma } from '../../../../database/prismaClient';

interface ICreateProfile {
  name: string;
  description: string;
  image: string;
}

export class CreateProfileUseCase {
  async execute({ name, description, image }: ICreateProfile) {

    const profileExist = await prisma.profiles.findFirst({
      where: {
        name,
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
      }
    });

    return profile;
  }
}