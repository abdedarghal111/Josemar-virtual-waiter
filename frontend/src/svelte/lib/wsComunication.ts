import { get, writable } from "svelte/store";

export const serverWS = `wss://${window.location.host}`

let localWS = writable<null | WebSocket>(null)


export function initConnection(){

    let ws = new WebSocket(serverWS)
    localWS.set(ws)

    ws.addEventListener("open", () => {
        console.log("Connection opened")
    });

    ws.addEventListener("message", (event) => {
        console.log("Message from server ", event.data);
    });
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
    console.log("Connection closed")
}

// ws.addEventListener("open", () => {
//     ws.send("Hello Server!");
// });

// ws.addEventListener("message", (event) => {
//     console.log("Message from server: ", event.data);
// });