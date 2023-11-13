import { prisma } from '../../../../database/prismaClient';

interface ILevelReward {
  name: string;
  description: string;
  image: string;
  level_id: string,
}

export class CreateLevelUseCase {
  async execute({
    name,
    description,
    image,
    level_id
  }: ILevelReward) {
    const levelRewards = await prisma.levelRewards.createMany({
      data: {
        name,
        description,
        image,
        level_id
      }
    });

    return levelRewards;
  }
}