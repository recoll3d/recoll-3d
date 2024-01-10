import { io, socket } from '../http';
import { prisma } from '../database/prismaClient';
import api from './api';

export class HandleCreateBottle {
  async execute(data: any) {
    console.log("CAIU EM INDEX.TS");
    console.log(data);

    const recycling = await prisma.recycling.findFirst({
      where: {
        collect_point: {
          mac_address: data.mac_address,
        },
        end_at: null,
      }
    });

    if (!recycling) {
      return;
    }

    if (data.level > 0 && data.points > 0) {
      console.log(data);
      console.log(recycling.id);

      const bottleData = {
        recycling_id: recycling.id,
        level: data.level,
        points: data.points,
      };

      // const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2OTk3ODEyNTEsImV4cCI6MTY5OTg2NzY1MSwic3ViIjoiN2NkYzFkMGUtNTM0My00NmE3LTk1ZWEtOTg2YzlmMGMyNTk3In0.MZa6xc6pjBbnHtHhID4RS5g0EwkdlsEvTovG-XWv8wo';

      // const config = {
      //   headers: {
      //     Authorization: `Bearer ${token}`
      //   }
      // }

      const bottle = await api.post("/recycling/bottles/", bottleData);

      console.log(bottle.data);
      io.to("reactjs").emit("recycled_bottle", {
        recycling_id: bottle.data.recycling_id,
        level: bottle.data.level,
        points: bottle.data.points,
      });
    }
  }
}