import * as io from 'socket.io-client';
// "undefined" means the URL will be computed from the `window.location` object
// const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:4000';

// export const socket = await io.connect('http://localhost:3333');

const execute = async (): Promise<io.Socket> => {
  return await io.connect('http://localhost:3333');
};

export const socket = await execute();