// import { io } from './http';
import { request, response } from 'express';
import { Server } from 'socket.io';
import Cookies from 'js-cookie';

import { HandleCreateRecycling } from './services/handleCreateRecycling';
import { HandleCreateBottle } from './services/handleCreateBottle';

const handleCreateBottle = new HandleCreateBottle();
const handleCreateRecycling = new HandleCreateRecycling();

let connection: any = null;

export class Socket {
  socket: any;

  constructor() {
    this.socket = null;
  }
  connect(server: any) {
    const io = new Server(server, {
      // cookie: {
      //   name: 'token'
      // },
      // Deixar o cors definido, pelo fato do frontend não estar conseguindo se comunicar.
      cors: {
        origin: process.env.FRONTEND_URL,
        // origin: 'http://localhost:3000',
      }
      // cors: {
      //   origin: ['http://localhost:3000', 'http://192.168.43.233:3333/socket.io'],
      //   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      //   credentials: true,
      //   optionsSuccessStatus: 204,
      // }
    });
    // io.use((socket1, next) => {
    //   // var cookief = socket1.handshake.headers.cookie;
    //   let cookies = cookie.parse(String(socket1.request.headers.cookie));
    //   // console.log(cookief);
    //   console.log(cookies);

    //   next();
    // });

    io.on("connection", async (socket: any) => {
      console.log(socket.id);
      console.log('A client connected');

      this.socket = socket;

      // socket.on('get_led', (data: any) => {
      io.emit("turn_on_led", { on: true });

      // });
      console.log("Cookies:")
      console.log(Cookies.get('token'));

      socket.on("register_recycling", async (data: any) => {
        await handleCreateRecycling.execute(data);
      });

      socket.on("register_bottle", async (data: any) => {
        await handleCreateBottle.execute(data);
      });

    });

    return io;
  }
  emit(event: any, data: any) {
    this.socket.emit(event, data);
  }
  on(event: any, data: any) {
    this.socket.on(event, data);
  }
  join(room_name: any) {
    this.socket.join(room_name)
  }
  static init(server: any) {
    if (!connection) {
      connection = new Socket();
      connection.connect(server);
    }
  }
  static getConnection() {
    if (connection) {
      return connection;
    }
  }
}

export default {
  connect: Socket.init,
  connection: Socket.getConnection
}