import { prisma } from '../../../../database/prismaClient';

export class ListBottlesUseCase {
  async execute() {
    const bottles = await prisma.bottles.findMany({
      where: {

      }
    })

    return bottles;
  }
}