import toast from "svelte-french-toast";
import { get, writable } from "svelte/store";
import { BaseMessage } from "_shared/wsComunication/BaseMessage.mts";

let isSecure = window.location.protocol === 'https'
export const serverWS = `ws${isSecure ? 's' : ''}://${window.location.host}`

let socket = writable<null | WebSocket>(null)
type messageCallbackType = (data: any) => void
let eventSubscriptions: Record<string, messageCallbackType> = {}
let waitSubscriptions: Record<string, ((data:any) => any )[]> = {}

export async function sendEvent(message: BaseMessage) {
    let socket = await getWebSocket()
    console.log(`toServer: ${message.toString()}`)
    socket.send(message.toString())
}

let resolve: (value: WebSocket) => void
let webSocket = new Promise<WebSocket>((res, reject) => {
    resolve = res
})

export async function waitEvent(event: string) {
    let resolve: (data: any) => any
    let prom = new Promise<any>((res, reject) => {
        resolve = res
    })
    if(!waitSubscriptions[event]){
        waitSubscriptions[event] = []
    }
    waitSubscriptions[event].push(resolve)

    return prom
}

export async function sendMessage(message: string) {
    let socket = await getWebSocket()
    console.log(`toServer: ${message.toString()}`)
    socket.send(message.toString())
}

export async function getWebSocket() : Promise<WebSocket> {
    if(!webSocket) {
        webSocket = new Promise<WebSocket>((res, reject) => {
            resolve = res
        })
        initConnection()
    }
    return webSocket
}

export function initConnection(){

    let ws = new WebSocket(serverWS)
    socket.set(ws)

    webSocket = new Promise<WebSocket>((res, reject) => {
        resolve = res
    })

    ws.addEventListener("open", () => {
        resolve(ws)
        // toast.success("Conectado correctamente")
        console.log("Conectado correctamente")
    });

    // ws.addEventListener("error", () => {
    //     toast.error("No se ha conectado correctamente")
    // })

    ws.addEventListener("close", (event) => {
        if (event.code >= 1000 && event.code <= 1003) {
            toast.success("Desconectado correctamente");
        } else {
            toast.success('Escucha cerrada')
            console.error(`Error de conexión (código ${event.code}): ${event.reason || 'Conexión rechazada'}`);
        }
        socket.set(null);
    })

    ws.addEventListener("message", (received) => {
        console.log(`fromServer: ${received.data}`)
        try {
            const data = JSON.parse(received.data)
            const eventName = data?.event
            let catched = false

            if(!eventName){
                console.error(`No existe ningún evento en la petición: ${received.data}`)
            }

            if(waitSubscriptions[eventName]){
                catched = true
                for(let resolve of waitSubscriptions[eventName]){
                    resolve(data)
                }
                waitSubscriptions[eventName] = []
            }

            if (eventName in eventSubscriptions) {
                catched = true
                eventSubscriptions[eventName](data)
            } 
            
            if(!catched){
                console.error(`No existe ninguna suscripción para el evento: ${eventName}`)
            }
            
        } catch (error) {
            console.error(`Error al parsear el mensaje WebSocket: ${received.data}`)
        }
    })
}

export function onSocketEvent(event: string, callback: messageCallbackType) {
    eventSubscriptions[event] = callback
}

export function existingConnection(){
    return get(socket)?.OPEN ?? false
}

export function closeConnection(){
    let ws = get(socket)
    if(ws?.OPEN){
        ws.close()
        socket.set(null)
    }
}