import { Request, Response } from 'express';
import { CreateLevelUseCase } from './CreateLevelUseCase';

export class CreateLevelController {
  async handle(request: Request, response: Response) {
    const {
      name,
      description,
      required_score,
      position,
      profile_id,
    } = request.body;

    const createLevelUseCase = new CreateLevelUseCase();
    const result = await createLevelUseCase.execute({
      name,
      description,
      image: request.file?.filename as string,
      required_score: parseInt(required_score),
      position: parseInt(position),
      profile_id,
    });

    return response.json(result);
  }
}