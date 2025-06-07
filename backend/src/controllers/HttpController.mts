import express from 'express';
import http from 'http';
import https from 'https';
import session from 'express-session'
import { Sequelize } from 'sequelize'
import SessionSequelize from 'connect-session-sequelize'
import { __public, __static, ENV_FILE_PATH, SERVER_CRT_FILE_PATH, SERVER_KEY_FILE_PATH, SESSION_DB_FILE_PATH } from './../paths.mjs';
import dotenv from 'dotenv'
import helmet from 'helmet';
import fs from 'fs';
import path from 'path';

// variables
let secureCookie = true
let httpsMode = true
let PORT = 443;

if(process.argv.find(val => val === '--dev')){
  PORT = 8295;
  secureCookie = false
  httpsMode = false
}


// cargando variables de entorno
dotenv.config({ path: ENV_FILE_PATH })

//userData
export interface UserSessionDataType {
  [key: string]: any
}
declare module 'express-session' {
  interface SessionData {
    userData?: UserSessionDataType
  }
}

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
const httpsServer = httpsMode ? https.createServer({
  key: fs.readFileSync(SERVER_KEY_FILE_PATH, 'utf-8'),
  cert: fs.readFileSync(SERVER_CRT_FILE_PATH, 'utf-8')
}, app) : http.createServer(app);

// Express config
let sessionParser = session({
  secret: process.env.SESION_SIGN_COOKIE_KEY,
  resave: false,
  store: sessionStore,
  saveUninitialized: false,
  cookie: {
    secure: secureCookie,
    // maxAge: 1000 * 60 * 30 // 30 minutos
  }
})
app.use(express.json())
app.use(sessionParser)
if(httpsMode){
  app.use(helmet(
    {
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'"],
        },
      },
    }
  ))
}

//app.use(express.static(__public)) ==> public
app.get('/public/*path', (req, res) => {
  const filePath = path.join(__public, req.params['path'][0])
  const normalizedPath = path.normalize(filePath)

  // Verifica que el archivo esté dentro del directorio público
  if (!normalizedPath.startsWith(__public)) {
    res.status(403).send('Access denied')
  }

  // Verifica si el archivo existe
  fs.access(normalizedPath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).send('File not found')
    }
    res.sendFile(normalizedPath)
  })
})

app.get('/', (req, res) => {
  res.sendFile(`${__static}/index.html`)
});

app.get('/*any', (req, res) => {
  res.sendFile(`${__static}/index.html`)
});



export class HttpController {
    static express = app
    static server = httpsServer
    static sessionParser = sessionParser
    static sessionStore = sessionStore

    static startServer() {
        // Iniciar el servidor
        // httpsServer.
        httpsServer.listen(PORT, () => {
          //listening in my ip
          console.log(`Servidor corriendo en http${httpsMode ? 's' : ''}://localhost:${PORT}`);
        });
    }
}