import { prisma } from '../../../../database/prismaClient';

export class ListLevelsUseCase {
  async execute() {
    const levels = await prisma.levels.findMany();

    const serializedLevels = levels.map(level => {
      const { image, ...rest } = level;

      return {
        ...rest,
        image_url: `http://localhost:3000/uploads/${image}`
      };
    });

    return serializedLevels;
  }
}