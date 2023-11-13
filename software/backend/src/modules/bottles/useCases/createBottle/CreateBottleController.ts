import { Request, Response } from 'express';
import { CreateBottleUseCase } from './CreateBottleUseCase';
import { socket } from '../../../../http';

interface IPromiseData {
  level: number;
  points: number;
}

const promiseData = () => new Promise((resolve, reject) => {
  socket.on('register_bottle', (data: IPromiseData) => {
    resolve(data);
  });
});

export class CreateBottleController {
  async handle(request: Request, response: Response) {
    // const { level, points } = await promiseData()
    //   .catch(() => {
    //     response
    //       .status(404)
    //       .json({ message: "Board not found" })
    //   }) as IPromiseData;

    // const { user_id } = request;
    const {
      recycling_id,
      level,
      points
    } = request.body;

    const createBottleUseCase = new CreateBottleUseCase();
    const result = await createBottleUseCase.execute({
      recycling_id,
      // user_id,
      level,
      points,
    });


    return response.json(result);
  }
}