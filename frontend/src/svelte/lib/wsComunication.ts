export const serverWS = `wss://${window.location.host}`

let ws = new WebSocket(serverWS)

ws.addEventListener("open", () => {
    ws.send("Hello Server!");
});

ws.addEventListener("message", (event) => {
    console.log("Message from server: ", event.data);
});