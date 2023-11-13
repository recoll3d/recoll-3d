import { prisma } from '../../../../database/prismaClient';

interface ILevel {
  name: string;
  description: string;
  image: string;
  required_score: number;
  position: number;
  profile_id: string,
}

export class CreateLevelUseCase {
  async execute({
    name,
    description,
    image,
    required_score,
    position,
    profile_id,
  }: ILevel) {
    const positionExists = await prisma.levels.findFirst({
      where: {
        position,
        profile: {
          id: profile_id,
        },
      }
    });

    if (positionExists) {
      throw new Error("Position alerady present on a level.");
    }

    const levelCount = await prisma.levels.count({
      where: {
        profile: {
          id: profile_id,
        }
      }
    });
    const levelPosition = levelCount + 1

    const level = await prisma.levels.create({
      data: {
        name,
        description,
        image,
        required_score,
        position: levelPosition,
        profile_id,
      }
    });

    return level;
  }
}