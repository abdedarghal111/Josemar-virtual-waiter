import { Op } from "sequelize"
import { User } from "./DatabaseController.mts"
import { HttpController } from "./HttpController.mts"
import bcrypt from "bcrypt"

const app = HttpController.express
const API = '/api/'

app.post(API + 'whoAmI', async (req, res) => {
    let userData = req.session.userData
    res.header('Content-Type', 'application/json')
    
    if(userData && userData.userId){
        let user = await User.findByPk(userData.userId)
        res.send(JSON.stringify({
            success: true,
            message: "Estas registrado",
            user: {
                id: user.id,
                name: user.name,
                surname: user.surname,
                username: user.username,
                email: user.email,
                permissionLevel: user.permissionLevel
            }
        }))
    } else {
        res.send(JSON.stringify({
            success: true,
            message: "No estas registrado",
            user: null
        }))
    }
})

app.post(API + 'register', async (req, res) => {
    let userData = req.session.userData
    res.header('Content-Type', 'application/json')

    if(userData && userData.userId){
        res.send(JSON.stringify({
            success: false,
            message: "Ya estás registrado"
        }))
    } else {

        let inData = req.body
        let reqParams = ["name", "surname", "username", "email", "password", "password2"]

        //ningun campo vacio
        for(let param of reqParams){
            if(!inData[param] || inData[param] == ""){
                res.send(JSON.stringify({
                    success: false,
                    message: `Falta el campo ${param}`
                }))
                return
            }
        }

        if(await User.findOne({where: { email: inData.email }})){
            res.send(JSON.stringify({
                success: false,
                message: "El email ya esta en uso"
            }))
            return
        }else if(await User.findOne({where: { username: inData.username }})){
            res.send(JSON.stringify({
                success: false,
                message: "El nombre de usuario ya esta en uso"
            }))
            return
        }

        if(inData.name.length < 3 || inData.surname.length < 3 || inData.username.length < 3){
            res.send(JSON.stringify({
                success: false,
                message: "El nombre, apellido o nombre de usuario debe tener al menos 3 caracteres"
            }))
            return
        }

        if(inData.password.length < 6){
            res.send(JSON.stringify({
                success: false,
                message: "La contrasena debe tener al menos 8 caracteres"
            }))
            return
        }

        if(inData.password != inData.password2){
            res.send(JSON.stringify({
                success: false,
                message: "Las contrasenas no coinciden"
            }))
            return
        }
        
        let passwordHash = bcrypt.hashSync(inData.password, 10)

        let user = await User.create({
            name: inData.name,
            surname: inData.surname,
            username: inData.username,
            email: inData.email,
            password: passwordHash,
            permissionLevel: "user"
        })

        req.session.userData = {
            userId: user.id
        }

        res.send(JSON.stringify({
            success: true,
            message: "Éxito al registrar",
            user: {
                id: user.id,
                name: user.name,
                surname: user.surname,
                username: user.username,
                email: user.email,
                permissionLevel: user.permissionLevel
            }
        }))
    }
})

app.post(API + 'login', async (req, res) => {
    let userData = req.session.userData
    res.header('Content-Type', 'application/json')

    if(userData && userData.userId){
        res.send(JSON.stringify({
            success: false,
            message: "Ya estás registrado"
        }))
    } else {

        let inData = req.body
        let reqParams = ["userOrEmail", "password"]

        //ningun campo vacio
        for(let param of reqParams){
            if(!inData[param] || inData[param] == ""){
                res.send(JSON.stringify({
                    success: false,
                    message: `Falta el campo ${param}`
                }))
                return
            }
        }

        let user = await User.findOne({where: { [Op.or]: [{ username: inData.userOrEmail }, { email: inData.userOrEmail }] }})
        
        if(!user){
            res.send(JSON.stringify({
                success: false,
                message: "Nombre de usuario o email incorrecto"
            }))
            return
        }

        if(!bcrypt.compareSync(inData.password, user.password)){
            res.send(JSON.stringify({
                success: false,
                message: "Contrasena incorrecta"
            }))
            return
        }

        req.session.userData = {
            userId: user.id
        }

        res.send(JSON.stringify({
            success: true,
            message: "Éxito al iniciar sesion",
            user: {
                id: user.id,
                name: user.name,
                surname: user.surname,
                username: user.username,
                email: user.email,
                permissionLevel: user.permissionLevel
            }
        }))
    }
})

app.post(API + 'logout', (req, res) => {
    let userData = req.session.userData
    res.header('Content-Type', 'application/json')
    
    if(userData && userData.userId){
        userData.userId = null
    }

    res.send(JSON.stringify({
        success: false,
        message: "Sesión cerrada"
    }))
})

export class RestController {
    static app = app
}