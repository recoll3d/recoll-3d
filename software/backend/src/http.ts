import 'dotenv/config';
import 'express-async-errors';

import express, { Request, Response, NextFunction } from 'express';
// import { Server } from 'socket.io';
import { Socket } from './websockets';
import http from 'http';
import cors from 'cors';
import path from 'path';

import { routes } from './routes';

const app = express();

const serverHttp = http.createServer(app);

const socket = new Socket();

socket.connect(serverHttp);

// const io = new Server(serverHttp);

app.use(cors());

app.use(express.json());

app.use(routes);

app.use('/uploads/', express.static(path.resolve(__dirname, 'uploads')));

app.use(
  (err: Error, request: Request, response: Response, next: NextFunction) => {
    if (err instanceof Error) {
      return response.status(400).json({
        message: err.message,
      });
    }

    return response.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
)

export {
  serverHttp,
  socket,
  // io 
};