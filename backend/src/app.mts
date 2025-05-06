import express from 'express';
import { readFileSync } from 'fs';
import https from 'https';
import path from 'path';
import Primus from 'primus'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express();
const server = https.createServer({
  key: readFileSync(path.join(__dirname, '..', 'server.key'), 'utf-8'),
  cert: readFileSync(path.join(__dirname, '..', 'server.crt'), 'utf-8')
}, app);

app.use(express.static(__dirname + '/static/public'));
// const primus = new Primus(server, { transformer: 'websockets' }); // puedes usar también 'engine.io' o 'uws'

// Servir archivos estáticos si tienes una app frontend

// // Evento cuando un cliente se conecta
// primus.on('connection', (spark) => {
//   console.log('Cliente conectado');

//   spark.on('data', (data) => {
//     console.log('Mensaje recibido del cliente:', data);

//     // Enviar mensaje a todos los clientes conectados
//     primus.write(`Echo: ${data}`);
//   });

//   spark.on('end', () => {
//     console.log('Cliente desconectado');
//   });
// });

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/static/index.html');
});

// Iniciar el servidor
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en https://localhost:${PORT}`);
});

