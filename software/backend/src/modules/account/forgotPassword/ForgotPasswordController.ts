import { Request, Response } from 'express';
import { ForgotPasswordUseCase } from './ForgotPasswordUseCase';

export class ForgotPasswordController {
  async handle(request: Request, response: Response) {
    const { email } = request.body;

    const forgotPasswordUseCase = new ForgotPasswordUseCase();
    const result = await forgotPasswordUseCase.execute({ email });

    return response.json(result);
    // message: "Um link de redefinição foi enviado para seu e-mail."
  }
}