// import { prisma } from '../../../../database/prismaClient';
import axios from 'axios';
import { env } from 'process';

interface IProduct {
  description: string;
  thumbnail: string;
  brand: {
    name?: string,
  };
}

interface IBottle {
  name: string;
  quantity: number;
  unit: string;
  description: string;
  brand: string;
  packaging_type: string;
  packaging_quantity: string;
}

export class BottleDetailsUseCase {
  async execute(barcode: string) {
    // const url = `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`

    // const {
    //   product_name,
    //   quantity,
    //   generic_name,
    //   brands,
    //   packaging,
    // } = (await axios.get(url)).data.product;

    // const bottleData = {
    //   name: product_name,
    //   quantity,
    //   description: generic_name,
    //   brands,
    //   packaging,
    // }

    // function parseBottleData(data: IBottle) {
    //   const { name, description, brands, packaging } = data;

    //   let quantity = extractQuantity(data);
    //   let unit = extractUnit(data);

    //   return {
    //     name,
    //     quantity,
    //     unit,
    //     description,
    //     brands,
    //     packaging,
    //   }
    // }

    // function extractQuantity(data: IBottle) {
    //   let quantityMatch = data.description && data.description.match(/\b(\d+)\s*(ml|L)\b/i);

    //   if (!quantityMatch) {
    //     quantityMatch = data.quantity && data.quantity.match(/(\d+)\s*(ml|L)/i);
    //   }
    //   if (!quantityMatch && data.name) {
    //     quantityMatch = data.name.match(/\b(\d+)\s*(ml|L)\b/i);
    //   }

    //   return quantityMatch ? parseFloat(quantityMatch[1]) : 1; // Valor padrão
    // }

    // function extractUnit(data: IBottle) {
    //   let unitMatch = data.description && data.description.match(/\b(\d+)\s*(ml|L)\b/i);

    //   if (!unitMatch) {
    //     unitMatch = data.quantity && data.quantity.match(/(\d+)\s*(ml|L)/i);
    //   }
    //   if (!unitMatch && data.name) {
    //     unitMatch = data.name.match(/\b(\d+)\s*(ml|L)\b/i);
    //   }

    //   return unitMatch ? unitMatch[2] : "ml";
    // }

    // const result = bottleData;

    const url = `https://api.cosmos.bluesoft.io/gtins/${barcode}.json`;
    const apiKey = env.API_KEY_COSMOS;
    const userAgent = 'Solicitação de API do Cosmos';

    const headers = {
      'X-Cosmos-Token': apiKey,
      'Content-Type': 'application/json',
      'User-Agent': userAgent
    };

    const { data: productData } = await axios.get(url, { headers });

    function parseBottleData(data: IProduct) {
      const {
        description,
        thumbnail,
        brand
      } = data;

      const {
        quantity,
        unit,
      } = extractQuantityAndUnit(description) as IBottle;

      return {
        name: brand?.name,
        quantity,
        unit,
        thumbnail,
        description,
      };
    }

    function extractQuantityAndUnit(description: string) {
      const regex = /(\d+(?:\.\d+)?)(?:\s*)(ml|L)/i;
      const match = description.match(regex);

      if (match) {
        const quantity = parseFloat(match[1]);
        const unit = match[2].toLowerCase();

        return { quantity, unit };
      }

      if (!match) {
        return {
          quantity: 1,
          unit: 'ml',
        };
      }
    }

    const result = parseBottleData(productData);

    return result;
  }
}