import express from 'express';
import { readFileSync } from 'fs';
import https from 'https';
import session from 'express-session'
import { Sequelize } from 'sequelize'
import SessionSequelize from 'connect-session-sequelize'
import { __public, __static, ENV_FILE_PATH, SERVER_CRT_FILE_PATH, SERVER_KEY_FILE_PATH, SESSION_DB_FILE_PATH } from './../paths.mjs';
import dotenv from 'dotenv'

// cargando variables de entorno
dotenv.config({ path: ENV_FILE_PATH })

// Iniciar guardado de las sesiones
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: SESSION_DB_FILE_PATH, // Ruta del archivo SQLite
  logging: (msg) => {
    // Solo loguea si el mensaje contiene "ERROR"
    if (msg.includes('ERROR')) console.error(msg);
  }
})

const sessionStore = new (SessionSequelize(session.Store))({
  db: sequelize,
  expiration: 30 * 24 * 60 * 60 * 1000,
});

await sequelize.sync()

// Iniciar del servidor
const app = express();
const httpsServer = https.createServer({
  key: readFileSync(SERVER_KEY_FILE_PATH, 'utf-8'),
  cert: readFileSync(SERVER_CRT_FILE_PATH, 'utf-8')
}, app);

// Express config
app.use(express.static(__public));
console.log(process.env.SESION_SIGN_COOKIE_KEY)
app.use(session({
  secret: process.env.SESION_SIGN_COOKIE_KEY,
  resave: false,
  store: sessionStore,
  saveUninitialized: false,
  cookie: {
    secure: true,
    // maxAge: 1000 * 60 * 30 // 30 minutos
  }
}))
app.get('/', (req, res) => {
  res.sendFile(`${__static}/index.html`);
});


export class HttpController {
    static express = app
    static server = httpsServer

    static startServer() {
        // Iniciar el servidor
        const PORT = 403;
        httpsServer.listen(PORT, () => {
        console.log(`Servidor corriendo en https://localhost:${PORT}`);
        });
    }
}