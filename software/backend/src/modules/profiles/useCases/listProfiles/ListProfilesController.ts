import { Request, Response } from 'express';
import { ListProfilesUseCase } from './ListProfilesUseCase';

export class ListProfilesController {
  async handle(request: Request, response: Response) {
    const listProfilesUseCase = new ListProfilesUseCase();
    const result = await listProfilesUseCase.execute();

    return response.json(result);
  }
}