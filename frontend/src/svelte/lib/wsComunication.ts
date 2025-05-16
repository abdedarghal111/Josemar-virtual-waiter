import toast from "svelte-french-toast";
import { get, writable } from "svelte/store";
import { BaseMessage } from "_shared/wsComunication/BaseMessage.mts";

export const serverWS = `wss://${window.location.host}`

let socket = writable<null | WebSocket>(null)
type messageCallbackType = (data: any, ws: WebSocket) => void
let eventSubscriptions: Record<string, messageCallbackType> = {}
let waitSubscriptions: Record<string, (() => void)[]> = {}

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
    let resolve: () => void
    let prom = new Promise<void>((res, reject) => {
        resolve = res
    })
    if(!waitSubscriptions[event]){
        waitSubscriptions[event] = []
    }
    waitSubscriptions[event].push(resolve)

    return prom
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
        toast.success("Conectado correctamente")
    });

    // ws.addEventListener("error", () => {
    //     toast.error("No se ha conectado correctamente")
    // })

    ws.addEventListener("close", (event) => {
        if (event.code >= 1000 && event.code <= 1003) {
            toast.success("Desconectado correctamente");
        } else {
            toast.error(`Error de conexión (código ${event.code}): ${event.reason || 'Conexión rechazada'}`);
        }
        socket.set(null);
    })

    ws.addEventListener("message", (event) => {
        console.log(`fromServer: ${event.data}`)
        try {
            const data = JSON.parse(event.data)
            const eventName = data?.event

            if (eventName in eventSubscriptions) {
                if(waitSubscriptions[eventName]){
                    for(let resolve of waitSubscriptions[eventName]){
                        resolve()
                    }
                    waitSubscriptions[eventName] = []
                }
                eventSubscriptions[eventName](data, ws)
            } else if (data) {
                console.error(`No existe el evento ${eventName} en el cliente para los datos: ${data}`)
            } else {
                console.error(`Mensaje WebSocket sin datos o sin propiedad 'event': ${event.data}`)
            }
        } catch (error) {
            console.error(`Error al parsear el mensaje WebSocket: ${event.data}`)
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