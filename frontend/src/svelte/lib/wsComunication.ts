import { get, writable } from "svelte/store";

export const serverWS = `wss://${window.location.host}`

let localWS = writable<null | WebSocket>(null)


export function initConnection(){
    localWS.set(new WebSocket(serverWS))
}

export function closeConnection(){
    let ws = get(localWS)
    if(ws?.OPEN){
        ws.close()
        localWS.set(null)
    }
}

ws.addEventListener("open", () => {
    ws.send("Hello Server!");
});

ws.addEventListener("message", (event) => {
    console.log("Message from server: ", event.data);
});