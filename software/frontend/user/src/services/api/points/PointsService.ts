import { Api } from '../ApiConfig'
import { ApiException } from '../ApiException';

interface IPoint {
  id?: string;
  image: string;
  name: string;
  email: string;
  whatsapp: number;
  latitude: number;
  longitude: number;
  city: string;
  uf: string;
  created_at: Date
}

async function create(props: Promise<IPoint[] | ApiException>) {
  try {
    const { data } = await Api().post("/points", props);

    return data;
  } catch(error: any) {
    return new ApiException(error.message || 'Erro ao criar o registro.');
  }
}

async function list({}: Promise<IPoint[] | ApiException>) {
  try {
    const { data } = await Api().get("/points");

    return data
  } catch(error: any) {
    return new ApiException(error.message || 'Erro ao consultar a API.');
  }
}

function update() {

}

export const PointsService = {
  create,
  list,
  update,
}