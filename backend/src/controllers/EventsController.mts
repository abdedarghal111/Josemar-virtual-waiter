import WebSocket from "ws"
import { ListUsersMessage } from "_shared/wsComunication/ListUsersMessage.mjs"
import { User } from "./DatabaseController.mts"
import { BaseMessage } from "_shared/wsComunication/BaseMessage.mjs"

// static class
export class EventsController {

    private static adminConnections: Record<string, WebSocket> = {}
    private static workerConnections: Record<string, WebSocket> = {}

    private static events = {}

    public static addConnection(sessionId: string, permissionLevel: string, ws: WebSocket) {
        if(permissionLevel == "admin") {
            this.adminConnections[sessionId] = ws
        }
        this.workerConnections[sessionId] = ws

        ws.on('message', (message) => {
            console.log(message.toString())
            try {
                const data = JSON.parse(message.toString())
                const eventName = data?.event

                if (eventName in this.events) {
                    this.events[eventName](sessionId, data)
                }
            } catch (error) {}
        })
    }

    public static removeConnection(sessionId: string) {
        delete this.adminConnections[sessionId]
        delete this.workerConnections[sessionId]
    }

    public static fireAdmins(event: string, data: any) {
        for(let key in this.adminConnections) {
            this.adminConnections[key].emit(event, data)
        }
    }

    public static fireWorkers(event: string, data: any) {
        for(let key in this.workerConnections) {
            this.workerConnections[key].emit(event, data)
        }
    }

    public static fireSelf(sessionId: string, message: BaseMessage) {
        this.workerConnections[sessionId].emit(message.event, message.toString())
    }

    public static subscribe(event: string, callback: (sessionId: string, data: any) => void, soloAdmins: boolean = false) {
        this.events[event] = callback
    }
}

EventsController.subscribe(ListUsersMessage.event, async (sessionId: string, data: any) => {   
    console.log("recibido") 
    let users = await User.findAll()

    let cleanUsers = users.map(user => user.toJSON())

    let message = new ListUsersMessage({ event: ListUsersMessage.event, success: true, users: cleanUsers })
    
    EventsController.fireSelf(sessionId, message)
})