import { Request, Response } from 'express';
import { UpdateEndDateUseCase } from './UpdateEndDateUseCase';

export class UpdateEndDateController {
  async handle(request: Request, response: Response) {
    const { user_id } = request;
    const { recycling_id } = request.params;

    const updateEndDateUseCase = new UpdateEndDateUseCase();
    const result = await updateEndDateUseCase.execute({
      recycling_id,
      user_id,
    });

    return response.json(result);
  }
}