import { Api } from '../ApiConfig'
import { ApiException } from '../ApiException';

interface IPoint {
  id?: string;
  image: string;
  title: string;
  created_at: Date;
}

async function create(props: Promise<IPoint[] | ApiException>) {
  try {
    const { data } = await Api().post("/items", props);

    return data;
  } catch(error: any) {
    return new ApiException(error.message || 'Erro ao criar o registro.');
  }
}

async function list({}: Promise<IPoint[] | ApiException>) {
  try {
    const { data } = await Api().get("/items");

    return data
  } catch(error: any) {
    return new ApiException(error.message || 'Erro ao consultar a API.');
  }
}

export const PointsService = {
  create,
  list,
}