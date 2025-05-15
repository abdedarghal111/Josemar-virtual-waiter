import toast from "svelte-french-toast";
import { get, writable } from "svelte/store";

export const serverWS = `wss://${window.location.host}`

export let socket = writable<null | WebSocket>(null)
type messageCallbackType = (data: any, ws: WebSocket) => void
let eventSubscriptions: Record<string, messageCallbackType> = {}

let resolve: () => void
let resolved = false
let awaitSocket = new Promise<void>((res, reject) => {
    resolve = res
})
export async function getSocket(){
    if(!resolved){
        await awaitSocket
    }
    return get(socket)
}

export function initConnection(){

    let ws = new WebSocket(serverWS)
    socket.set(ws)

    ws.addEventListener("open", () => {
        resolved = true
        resolve()
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
        try {
            console.log(event)
            const data = JSON.parse(event.data)
            const eventName = data?.event

            if (eventName in eventSubscriptions) {
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