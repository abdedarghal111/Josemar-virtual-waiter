import WebSocket from "ws"
import { ListObjectsMessage } from "_shared/wsComunication/ListObjectsMessage.mjs"
import { GetObjectMessage, SetObjectMessage, DeleteObjectMessage } from "_shared/wsComunication/ObjectMessage.mjs"
import { User } from "./DatabaseController.mts"
import { BaseMessage } from "_shared/wsComunication/BaseMessage.mjs"
import bcrypt from "bcrypt"

// static class
export class EventsController {

    private static adminConnections: Record<string, WebSocket> = {}
    private static workerConnections: Record<string, WebSocket> = {}

    private static events = {}

    public static addConnection(sessionId: string, permissionLevel: string, ws: WebSocket) {
        let isAdmin = permissionLevel == "admin"
        if(isAdmin) {
            this.adminConnections[sessionId] = ws
        }
        this.workerConnections[sessionId] = ws

        ws.on('message', (message) => {
            console.log(`fromClient: ${message.toString()} \n`)
            try {
                const data = JSON.parse(message.toString())
                const eventName = data?.event

                if (eventName in this.events) {
                    this.events[eventName](sessionId, isAdmin, data)
                }
            } catch (error) {}
        })
    }

    public static removeConnection(sessionId: string) {
        delete this.adminConnections[sessionId]
        delete this.workerConnections[sessionId]
    }

    public static fireAdmins(event: string, message: BaseMessage) {
        for(let key in this.adminConnections) {
            this.adminConnections[key].send(message.toString())
        }
    }

    public static fireWorkers(event: string, message: BaseMessage) {
        for(let key in this.workerConnections) {
            this.workerConnections[key].send(message.toString())
        }
    }

    public static fireSelf(sessionId: string, message: BaseMessage) {
        console.log(`toClient: ${message.toString()}\n`)
        this.workerConnections[sessionId].send(message.toString())
    }

    public static subscribe(event: string, callback: (sessionId: string, isAdmin: boolean, data: any) => void, soloAdmins: boolean = false) {
        this.events[event] = callback
    }
}

EventsController.subscribe(ListObjectsMessage.event, async (sessionId: string, isAdmin: boolean, data: any) => {
    if(!isAdmin) {return}

    let received = ListObjectsMessage.fromTable(data)

    switch (received.getType()) {
        case "user":
            let users = await User.findAll()

            let cleanUsers = users.map(user => {
                let userObject = user.toJSON()
                delete userObject.password
                return userObject
            })

            let send = new ListObjectsMessage("user", cleanUsers)
            
            return EventsController.fireSelf(sessionId, send)
    }    
})

EventsController.subscribe(GetObjectMessage.event, async (sessionId: string, isAdmin: boolean, data: any) => {
    if(!isAdmin) {return}

    let received = GetObjectMessage.fromTable(data)

    switch (received.getType()) {
        case "user":
            let user = received.getUser()

            if(user.id){
                let foundedUser = await User.findByPk(user.id)
                if(!foundedUser){
                    let send = new GetObjectMessage("user", {})
                    send.setFailure(`Usuario con id ${user.id} no encontrado`)
                    return EventsController.fireSelf(sessionId, send)
                }

                let cleanUser = foundedUser.toJSON()
                delete cleanUser.password
                let send = new GetObjectMessage("user", cleanUser)
                return EventsController.fireSelf(sessionId, send)
            }
    }
})

EventsController.subscribe(SetObjectMessage.event, async (sessionId: string, isAdmin: boolean, data: any) => {
    if(!isAdmin) {return}

    let received = SetObjectMessage.fromTable(data)

    switch (received.getType()) {
        case "user":

            let params = ["name", "surname", "username", "email", "permissionLevel"]

            let user = received.getUser()

            for (let param of params) {
                if (!user[param]) {
                    let send = new SetObjectMessage("user", {})
                    send.setFailure(`Falta el campo ${param}`)
                    return EventsController.fireSelf(sessionId, send)
                }
            }

            if(!["admin", "worker", "user"].includes(user.permissionLevel)){
                let send = new SetObjectMessage("user", {})
                send.setFailure(`Debes seleccionar un nivel de permiso valido`)
                return EventsController.fireSelf(sessionId, send)
            }

            let foundedUser = await User.findByPk(user.id)

            if (!foundedUser) {
                if (!user.password || user.password == "") {
                    let send = new SetObjectMessage("user", {})
                    send.setFailure(`Falta la contraseña`)
                    return EventsController.fireSelf(sessionId, send)
                }

                let newUser = await User.create({
                    name: user.name,
                    surname: user.surname,
                    username: user.username,
                    email: user.email,
                    password: bcrypt.hashSync(user.password, 10),
                    permissionLevel: user.permissionLevel
                })

                let cleanUser = newUser.toJSON()
                delete cleanUser.password
                let send = new SetObjectMessage("user", cleanUser)
                send.setSuccess("Usuario creado")
                EventsController.fireSelf(sessionId, send)
            } else {
                foundedUser.name = user.name
                foundedUser.surname = user.surname
                foundedUser.username = user.username
                foundedUser.email = user.email
                let passwordUpdated = false
                if (user.password && user.password != "") {
                    passwordUpdated = true
                    foundedUser.password = bcrypt.hashSync(user.password, 10)
                }
                foundedUser.permissionLevel = user.permissionLevel

                try {
                    await foundedUser.save()
                } catch (error) {
                    let send = new SetObjectMessage("user", {})
                    send.setFailure(`Error al actualizar el usuario`)
                    return EventsController.fireSelf(sessionId, send)
                }

                let cleanUser = foundedUser.toJSON()
                delete cleanUser.password
                let send = new SetObjectMessage("user", cleanUser)
                send.setSuccess(`Usuario actualizado${passwordUpdated ? " y contraseña cambiada" : ""}`)
                EventsController.fireSelf(sessionId, send)
            }

            let users = await User.findAll()

            let cleanUsers = users.map(user => {
                let userObject = user.toJSON()
                delete userObject.password
                return userObject
            })

            let sendAll = new ListObjectsMessage("user", cleanUsers)
            sendAll.setSuccess("NEW_USER")
            return EventsController.fireAdmins(sessionId, sendAll)

    }
})

EventsController.subscribe(DeleteObjectMessage.event, async (sessionId: string, isAdmin: boolean, data: any) => {
    if(!isAdmin) {return}

    let received = DeleteObjectMessage.fromTable(data)

    switch (received.getType()) {
        case "user":
            let user = received.getUser()

            if(user.id){
                let foundedUser = await User.findByPk(user.id)
                if(!foundedUser){
                    let send = new DeleteObjectMessage("user", {})
                    send.setFailure(`El usuario no existe`)
                    return EventsController.fireSelf(sessionId, send)
                }

                await foundedUser.destroy()

                let send = new DeleteObjectMessage("user", {})
                EventsController.fireSelf(sessionId, send)

                let users = await User.findAll()

                let cleanUsers = users.map(user => {
                    let userObject = user.toJSON()
                    delete userObject.password
                    return userObject
                })

                let sendAll = new ListObjectsMessage("user", cleanUsers)
                sendAll.setSuccess("NEW_USER")
                return EventsController.fireAdmins(sessionId, sendAll)
            }
    }
})
