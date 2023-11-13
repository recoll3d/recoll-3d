import { Request, Response } from 'express';
import { ListLevelsUseCase } from './ListLevelsUseCase';

export class ListLevelsController {
  async handle(request: Request, response: Response) {
    const listLevelsUseCase = new ListLevelsUseCase();
    const result = await listLevelsUseCase.execute();

    return response.json(result);
  }
}