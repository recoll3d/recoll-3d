import { prisma } from '../../../../database/prismaClient';

interface IRecyclingDetails {
  recycling_id: string;
  user_id: string;
}

export class RecyclingDetailsUseCase {
  async execute({ recycling_id, user_id }: IRecyclingDetails) {
    const recycling = await prisma.recycling.findFirst({
      where: {
        user_id,
        id: recycling_id,
      },
      select: {
        collect_point_id: true,
        number_of_bottles: true,
        total_bottles_score: true,
      }
    });

    return recycling;
  }
}