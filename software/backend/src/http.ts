import 'dotenv/config';
import 'express-async-errors';

import express, { Request, Response, NextFunction } from 'express';
import http from 'http';
import cors from 'cors';
import path from 'path';
import cookieParser from 'cookie-parser';

import { routes } from './routes';
import { Socket } from './websockets';

const app = express();

const serverHttp = http.createServer(app);

const socket = new Socket();

const io = socket.connect(serverHttp);

// const io = new Server(serverHttp);

app.use(cors());

app.use(cookieParser());

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
  io
};