import { Request, Response } from 'express';
import { ResetPasswordUseCase } from './ResetPasswordUseCase';

export class ResetPasswordController {
  async handle(request: Request, response: Response) {
    const { token } = request.params;
    const { password } = request.body;

    const resetPasswordUseCase = new ResetPasswordUseCase();
    const result = await resetPasswordUseCase.execute(token, password);

    return response.json(result);
  }
}