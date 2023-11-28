import { Request, Response } from 'express';
import { RecyclingDetailsUseCase } from './RecyclingDetailsUseCase';

export class RecyclingDetailsController {
  async handle(request: Request, response: Response) {
    const { user_id } = request;
    const { recycling_id } = request.params;

    const recyclingDetailsUseCase = new RecyclingDetailsUseCase();
    const result = await recyclingDetailsUseCase.execute({ recycling_id, user_id });

    return response.json(result);
  }
}