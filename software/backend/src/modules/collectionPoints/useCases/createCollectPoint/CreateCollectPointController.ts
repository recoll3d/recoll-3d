import { Request, Response } from 'express';
import { CreateCollectPointUseCase } from './CreateCollectPointUseCase';
import { socket } from '../../../../http';

interface IPromiseData {
  mac_address: string;
}

const promiseData = () => new Promise((resolve, reject) => {
  socket.on('register_point_collection', (data: IPromiseData) => {
    resolve(data);
  });
});

export class CreateCollectPointController {
  async handle(request: Request, response: Response) {
    const { mac_address } = await promiseData()
      .catch(() => {
        response
          .status(404)
          .json({ message: "Board not found" });
      }) as IPromiseData;

    const {
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf
    } = request.body;

    const createCollectPointUseCase = new CreateCollectPointUseCase();
    const result = await createCollectPointUseCase.execute({
      mac_address,
      name,
      email,
      whatsapp,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      city,
      uf,
      image: request.file?.filename as string,
    });

    return response.json(result);
  }
}