import { prisma } from '../../../../database/prismaClient';

interface ICreateBottle {
  recycling_id: string;
  // user_id: string;
  level: number;
  points: number;
}

export class CreateBottleUseCase {
  async execute({
    recycling_id,
    // user_id,
    level,
    points
  }: ICreateBottle) {
    // if (!user_id) {
    //   throw new Error("User not found");
    // }

    const bottle = await prisma.bottles.create({
      data: {
        recycling: {
          connect: {
            id: recycling_id,
            // user_id,
          },
        },
        level,
        points,
      },
    });

    return bottle;
  }
}