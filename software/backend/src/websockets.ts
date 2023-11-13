// import { io } from './http';
import { request, response } from 'express';
import { Server } from 'socket.io';
import { CallCreateBottle } from './modules/bottles/useCases/callCreateBottle';
import cookie from 'cookie';
import console from 'console';

let connection: any = null;
const callCreateBottle = new CallCreateBottle();

export class Socket {
  socket: any;

  constructor() {
    this.socket = null;
  }
  connect(server: any) {
    const io = new Server(server, {
      cookie: {
        name: 'token'
      },
    });
    io.use((socket1, next) => {
      // var cookief = socket1.handshake.headers.cookie;
      let cookies = cookie.parse(String(socket1.request.headers.cookie));
      // console.log(cookief);
      console.log(cookies);

      next();
    })

    io.on("connection", async (socket: any) => {
      console.log(socket.id);
      console.log('A client connected');

      socket.emit("turn_on_led", { on: true });

      this.socket = socket;

      await callCreateBottle.execute();

    });

    return io;
  }
  emit(event: any, data: any) {
    this.socket.emit(event, data);
  }
  on(event: any, data: any) {
    this.socket.on(event, data);
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