import './controllers/DatabaseController.mjs'
import './controllers/HttpController.mjs'
import './controllers/RestController.mjs'
import './controllers/SocketController.mjs'
import './controllers/EventsController.mjs'

import { HttpController } from './controllers/HttpController.mts'
import { User } from './controllers/DatabaseController.mjs'
import bcrypt from 'bcrypt'

HttpController.startServer()

for(let name of ['admin', 'worker', 'user']){
    await User.findOrCreate(
        {
            where: {username: name},
            defaults: {name: name, surname: name, password: bcrypt.hashSync(name, 10), permissionLevel: name}
        }
    )
    // console.log((await User.findOne({where: {username: name}})).toJSON())
}