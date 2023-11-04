import { Server } from 'socket.io';
import app from 'express';

require('dotenv').config();

const port = Number(process.env.SOCKET_PORT);
const socketEvents = process.env.SOCKET_EVENTS ?? '';
const server = new Server(port);
let sequenceNumberByClient = new Map();

(async () => {
  try {
    server.on('connection', (socket) => {
      console.info(`Client connected [id=${socket.id}]`);
      // initialize this client's sequence number
      sequenceNumberByClient.set(socket, 1);
      socket.on('sports-book', (message) => {
        socket.broadcast.emit(socketEvents, message);
      });
      console.info('Total Connected Client Count:', sequenceNumberByClient.size);

      // when socket disconnects, remove it from the list:
      socket.on('disconnect', () => {
        sequenceNumberByClient.delete(socket);
        console.info(`Client gone [id=${socket.id}]`);
        console.info('Total Connected Client Count:', sequenceNumberByClient.size);
      });
    });
    console.log('[*] Waiting for clients. To exit press CTRL+C');
  } catch (err) {
    console.warn(err);
  }
})();
