import { Request, Response } from 'express';
import { CreateLevelUseCase } from './CreateLevelRewardsUseCase';

export class CreateLevelRewardsController {
  async handle(request: Request, response: Response) {
    const {
      name,
      description,
      level_id
    } = request.body;

    const createLevelUseCase = new CreateLevelUseCase();
    const result = await createLevelUseCase.execute({
      name,
      description,
      image: request.file?.filename as string,
      level_id
    });

    response.json(result);
  }
}