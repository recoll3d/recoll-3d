import { prisma } from '../../../../database/prismaClient';

interface ICreateRecycling {
  user_id: string;
  mac_address: string;
  number_of_bottles: number;
  total_bottles_score: number;
}

export class CreateRecyclingUseCase {
  async execute({
    user_id,
    mac_address,
    number_of_bottles,
    total_bottles_score,
  }: ICreateRecycling) {
    const collect_point = await prisma.collectionPoints.findFirst({
      where: {
        mac_address,
      }
    });

    if (!collect_point) {
      throw new Error("Collection point not exists!");
    }

    const recycling = await prisma.recycling.create({
      data: {
        user: {
          connect: {
            id: user_id,
          }
        },
        collect_point: {
          connect: {
            id: collect_point.id,
          }
        },
        number_of_bottles,
        total_bottles_score,
      },
    });

    return recycling;
  }
}