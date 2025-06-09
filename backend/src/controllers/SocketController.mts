import { HttpController } from './HttpController.mts';
import { WebSocketServer } from 'ws'
import { parse as parseCookie } from 'cookie-parse';
import { User } from './DatabaseController.mts';
import { EventsController } from './EventsController.mts';

const wssServer = new WebSocketServer({
  server: HttpController.server, verifyClient: async (info, verify) => {

    if(!info.req.headers.cookie){
      info.req.socket.destroy()
      verify(false, 401)
      return
    }
    let sessionId = parseCookie(info.req.headers.cookie)['connect.sid'].substring(2).split('.')[0]

    HttpController.sessionStore.get(sessionId, async (err, session) => {
      if (err || !session) {
        info.req.socket.destroy()
        verify(false, 401)
        return
      }

      let userData = session?.userData
      if (!userData || !userData.userId) {
        verify(false, 401)
        return
      }

      let user = await User.findByPk(userData.userId)

      if (user.permissionLevel == "user") {
        verify(false, 401)
        return
      }

      (info.req as any).handshake = {
        sessionId: sessionId,
        permissionLevel: user.permissionLevel
      }

      verify(true)
    })
  }
})

let onSocketError = (err) => { console.error(err) }

wssServer.on('connection', (ws, req) => {
  const sessionId = (req as any).handshake.sessionId
  const permissionLevel = (req as any).handshake.permissionLevel

  EventsController.addConnection(sessionId, permissionLevel, ws)

  ws.on('error', onSocketError)

  ws.on('close', () => {
    EventsController.removeConnection(sessionId)
    ws.removeListener('error', onSocketError);
  })
})

export class SocketController {
  static server = wssServer
}