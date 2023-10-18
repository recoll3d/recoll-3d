import { Request, Response } from 'express';
import { DisconnectUserUseCase } from './DisconnectUserUseCase';

export class DisconnectUserController {
  async handle(request: Request, response: Response) {
    const authHeader = request.headers.authorization as string;
    const { user_id } = request;

    const disconnectUserUseCase = new DisconnectUserUseCase();
    const result = await disconnectUserUseCase.execute({ authHeader, user_id });

    return response.json(result);
  }
}