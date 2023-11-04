// import { io } from './http';
import { Server } from 'socket.io';

let connection: any = null;

export class Socket {
  socket: any;

  constructor() {
    this.socket = null;
  }
  connect(server: any) {
    const io = new Server(server);

    io.on("connection", (socket: any) => {
      console.log(socket.id);
      console.log('A client connected');

      socket.emit("turn_on_led", { on: true });

      this.socket = socket;
    });
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