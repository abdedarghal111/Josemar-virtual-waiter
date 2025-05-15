import type { BaseMessage } from "_shared/wsComunication/baseMessage.mjs";
import toast from "svelte-french-toast";
import { get, writable } from "svelte/store";

export const serverWS = `wss://${window.location.host}`

let localWS = writable<null | WebSocket>(null)
type messageCallbackType = (data: any, ws: WebSocket) => void
let eventSubscriptions: Record<string, messageCallbackType> = {}

export function initConnection(){

    let ws = new WebSocket(serverWS)
    localWS.set(ws)

    ws.addEventListener("open", () => {
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
        localWS.set(null);
    })

    ws.addEventListener("message", (event) => {
        try {
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
    return get(localWS)?.OPEN ?? false
}

export function closeConnection(){
    let ws = get(localWS)
    if(ws?.OPEN){
        ws.close()
        localWS.set(null)
    }
}