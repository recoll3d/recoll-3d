import { Request, Response } from 'express';
import { AuthenticateUserUseCase } from './AuthenticateUserUseCase';

export class AuthenticateUserController {
  async handle(request: Request, response: Response) {
    const { username, email, password } = request.body;

    const authenticateUserUseCase = new AuthenticateUserUseCase();
    const result = await authenticateUserUseCase.execute({
      username,
      email,
      password,
    });

    return response.json(result);
  }
}