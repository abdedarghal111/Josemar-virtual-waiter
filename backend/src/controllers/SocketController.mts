import { Request, Response } from 'express';
import { HttpController, type UserSessionDataType } from './HttpController.mts';
import { WebSocketServer } from 'ws'
import { Session } from 'express-session';
import { User } from './DatabaseController.mts';

let sockets = {}
let socketsCount = 0

const wssServer = new WebSocketServer({ server: HttpController.server })

// wssServer.options.verifyClient = (info, callback) => {
//   console.log(info, callback)
// }

HttpController.server.on('upgrade', function (request, socket, head) {
  socket.on('error', (err) => { console.error(err) })

  console.log('Parsing session from request...');
  HttpController.sessionParser(request as Request<{}, any, any, any, Record<string, any>>, {} as Response<any, Record<string, number>>, async () => {
    let userData = (request as any).session.userData as UserSessionDataType
    console.log(userData)
    if(!userData.userId) {
      socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
      socket.destroy();
      return;
    }

    console.log("primera capa superada")
    let user = await User.findByPk(userData.userId)
    console.log(user)

    if(user.permissionLevel == "user"){
      socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
      socket.destroy();
      return;
    }

    console.log('Session is parsed!');

    // socket.removeListener('error', (err) => { console.error(err) });

    wssServer.handleUpgrade(request, socket, head, function (ws) {
      wssServer.emit('connection', ws, request);
    });
  });
});


// wssServer.on("connection", (ws, req) => {

//   // ws.
//   // let userData = req.session.userData
//   console.log("Client connected");
//   console.log(req)
//   ws.on("message", (message) => {
//     console.log("received: %s", message);
//     ws.send("Hello from secure server!");
//   });
// });

export class SocketController {
  static server = wssServer
}