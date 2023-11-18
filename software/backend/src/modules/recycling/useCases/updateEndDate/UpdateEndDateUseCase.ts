import { prisma } from '../../../../database/prismaClient';

interface IUpdateEndDate {
  recycling_id: string;
  user_id: string;
}

export class UpdateEndDateUseCase {
  async execute({
    recycling_id,
    user_id,
  }: IUpdateEndDate) {
    const bottles = await prisma.bottles.findMany({
      where: {
        recycling: {
          id: recycling_id,
          user_id,
          end_at: null,
        }
      },
      select: {
        points: true,
      }
    });

    const recyclingScore = bottles.reduce((accumulator, currentValue) => {
      return accumulator = accumulator + currentValue.points;
    }, 0);

    const updatedRecycling = await prisma.recycling.updateMany({
      where: {
        id: recycling_id,
        user_id,
        end_at: null
      },
      data: {
        end_at: new Date(),
        number_of_bottles: bottles.length,
        total_bottles_score: recyclingScore,
      },
    });

    return updatedRecycling;
  }
}