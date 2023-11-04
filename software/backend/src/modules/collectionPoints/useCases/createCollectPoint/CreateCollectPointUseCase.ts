import { prisma } from '../../../../database/prismaClient';

interface ICollectPoint {
  mac_address: string;
  name: string;
  email: string;
  whatsapp: string;
  latitude: number;
  longitude: number;
  city: string;
  uf: string;
  image: string;
}

export class CreateCollectPointUseCase {
  async execute({
    mac_address,
    name,
    email,
    whatsapp,
    latitude,
    longitude,
    city,
    uf,
    image,
  }: ICollectPoint) {
    const macAddressExits = await prisma.collectionPoints.findFirst({
      where: {
        mac_address,
      }
    });

    if (macAddressExits) {
      throw new Error("Collection point already registred.");
    }

    const collectPoint = await prisma.collectionPoints.create({
      data: {
        mac_address,
        name,
        email,
        whatsapp,
        latitude,
        longitude,
        city,
        uf,
        image,
      }
    });

    return collectPoint;
  }
}