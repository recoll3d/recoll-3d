import { response } from 'express';
import { io, socket } from '../http';
import { prisma } from '../database/prismaClient';
import api from './api';
import Cookies from 'js-cookie';

interface IHandleCreateRecycling {
  token: string;
  mac_address: string;
  number_of_bottles: number;
  total_bottles_score: number;
  socket_id: string;
}

interface IPromiseData {
  mac_address: string;
  number_of_bottles: number;
  total_bottles_score: number;
}

// const promiseData = () => new Promise((resolve, reject) => {
//   socket.on('initial_recycling_data', (data: IPromiseData) => {
//     console.log(data);
//     resolve(data);
//   });
// });

let reactjsData: any = null;
let esp32Data: any = null;

export class HandleCreateRecycling {
  async execute({
    token,
    mac_address,
    number_of_bottles,
    total_bottles_score
  }: IHandleCreateRecycling) {
    // const promiseData = () => new Promise((resolve, reject) => {
    //   if (mac_address) {
    //     const data = {
    //       mac_address,
    //       number_of_bottles,
    //       total_bottles_score
    //     }

    //     resolve(data);
    //   }
    // });

    // const data = await promiseData()
    //   .catch(() => {
    //     response
    //       .status(404)
    //       .json({ message: "Board not found" })
    //   }) as IPromiseData;

    // =================================================================

    if (token) {
      socket.join('reactjs');

      reactjsData = {
        token,
      }

      handleMergedData();
    } else if (mac_address) {
      socket.join('esp32');

      esp32Data = {
        mac_address,
        number_of_bottles,
        total_bottles_score
      }

      handleMergedData();
    }

    function handleMergedData() {
      if (reactjsData && !esp32Data) {
        return reactjsData = null;
      }

      if (reactjsData && esp32Data) {

        const mergedData = {
          ...reactjsData,
          ...esp32Data,
        }

        console.log('Dados mesclados: ', mergedData);

        const {
          token,
          mac_address,
          number_of_bottles,
          total_bottles_score
        } = mergedData;

        api.
          post('/recycling', {
            mac_address,
            number_of_bottles,
            total_bottles_score,
          }, {
            // params: token,
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
          })
          .then(({ data }) => {
            console.log('DEPOIS DA CONDIÇÃO')

            console.log('DADOS DA REQUISIÇÃO:')
            console.log(data)

            socket.emit('recycling_log_response', {
              id: data.id,
            });
          })
          .catch((err) => {
            window.alert("Ops!!! Tivemos um problema.");
            console.log(err);
          });

        reactjsData = null;
        esp32Data = null;
      }
    }

    // =================================================================

    // const data = [];
    // socket.join('create_now');

    // let valorLido = false;

    // if (mac_address) {
    //   data.push({
    //     mac_address,
    //     number_of_bottles,
    //     total_bottles_score,
    //   });
    // }

    // if (token) {
    //   data.push({
    //     ...data,
    //     token,
    //   });
    // }

    // if (data.length && !valorLido) {
    //   console.log(data);

    //   valorLido = true;
    // } else if (!data.length) {
    //   valorLido = false;
    // }

    // =================================================================

    // let valorLido = false;
    // if (token) {
    //   console.log(token);
    //   // console.log(data);
    //   // valorLido = true;
    //   // console.log('DENTRO DA CONDIÇÃO')


    // }
  }
}