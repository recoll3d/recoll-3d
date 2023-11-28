import { Request, Response } from 'express';
import { CreateRecyclingUseCase } from './CreateRecyclingUseCase';
import { socket } from '../../../../http';

interface IPromiseData {
  mac_address: string;
  number_of_bottles: number;
  total_bottles_score: number;
}

// const promiseData = () => new Promise((resolve, reject) => {
//   socket.on('initial_recycling_data', (data: IPromiseData) => {
//     console.log(data);
//     resolve(data);
//   });
// });

export class CreateRecyclingController {
  async handle(request: Request, response: Response) {
    // const {
    //   mac_address,
    //   number_of_bottles,
    //   total_bottles_score,
    // } = await promiseData()
    //   .catch(() => {
    //     response
    //       .status(404)
    //       .json({ message: "Board not found" })
    //   }) as IPromiseData;

    const {
      mac_address,
      number_of_bottles,
      total_bottles_score,
    } = request.body;

    console.log("DADOS AQUI:");
    console.log(mac_address);

    const { user_id } = request;
    // const { user_id } = request.params;

    const createRecyclingUseCase = new CreateRecyclingUseCase();
    const result = await createRecyclingUseCase.execute({
      user_id,
      mac_address,
      number_of_bottles,
      total_bottles_score,
    });

    return response.json(result);
  }
}