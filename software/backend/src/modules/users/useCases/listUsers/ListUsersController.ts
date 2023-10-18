import { Request, Response } from 'express';
import { ListUsersUseCase } from './ListUsersUseCase';

export class ListUsersController {
  async handle(request: Request, response: Response) {
    const listUsersUseCase = new ListUsersUseCase();
    const result = await listUsersUseCase.execute();

    return response.json(result);
  }
}