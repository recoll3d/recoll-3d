import { Request, Response } from 'express';
import { FindUserUseCase } from './FindUserUseCase';

export class FindUserController {
  async handle(request: Request, response: Response) {
    const { user_id } = request;
    const { id: user_id_parameter } = request.params;

    if (user_id !== user_id_parameter) {
      return response
        .status(404)
        .json({ message: "User not found" });
    }

    const findUserUseCase = new FindUserUseCase();
    const result = await findUserUseCase.execute(user_id);

    return response.json(result);
  }
}