import { Request, Response } from 'express';
import { CreateUserUseCase } from './CreateUserUseCase';

export class CreateUserController {
  async handle(request: Request, response: Response) {
    const {
      name,
      username,
      email,
      password,
      profile_id
    } = request.body;

    const createUserUseCase = new CreateUserUseCase();
    const result = await createUserUseCase.execute({
      name,
      username,
      email,
      password,
      profile_id,
    });

    return response.json(result);
  }
}