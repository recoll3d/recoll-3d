import { Request, Response } from 'express';
import { BottleDetailsUseCase } from './BottleDetailsUseCase';

export class BottleDetailsController {
  async handle(request: Request, response: Response) {
    const { barcode } = request.body;

    const bottleDetailsUseCase = new BottleDetailsUseCase();

    const result = await bottleDetailsUseCase.execute(barcode)

    return response.json(result);
  }
}