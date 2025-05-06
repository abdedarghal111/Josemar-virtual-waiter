import { HttpController } from './HttpController.mts';
import { WebSocketServer } from 'ws'
import { __src as __dirname } from './../paths.mjs';


const wssServer = new WebSocketServer({ server: HttpController.server });

wssServer.on("connection", (ws) => {
  ws.on("message", (message) => {
    console.log("received: %s", message);
    ws.send("Hello from secure server!");
  });
});

export class SocketController {
  static server = wssServer
}