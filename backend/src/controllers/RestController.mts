import { Op } from "sequelize"
import { User } from "./DatabaseController.mts"
import { HttpController } from "./HttpController.mts"
import bcrypt from "bcrypt"
import { LoginRequest, type ValidFields as LoginValidField } from "_shared/requests/LoginRequest.mjs"
import { RegisterRequest, type ValidFields as RegisterValidField } from "_shared/requests/RegisterRequest.mjs"
import { PrivateUser } from "_shared/SharedTypes.mjs"
import { WhoAmIRequest } from "_shared/requests/WhoAmIRequest.mjs"
import { LogoutRequest } from "_shared/requests/LogoutRequest.mjs"

const app = HttpController.express
const API = '/api/'

app.post(API + WhoAmIRequest.path, async (req, res) => {
    let userData = req.session.userData
    res.header('Content-Type', 'application/json')
    let request: WhoAmIRequest

    if(userData && userData.userId){
        let user = await User.findByPk(userData.userId)
        request = new WhoAmIRequest(true, "Estas registrado", true, {
            id: user.id,
            name: user.name,
            surname: user.surname,
            username: user.username,
            email: user.email,
            permissionLevel: user.permissionLevel
        })
    } else {
        request = new WhoAmIRequest(false, "No estas registrado", false)
    }
    res.send(request.toJson())
})

app.post(API + RegisterRequest.path, async (req, res) => {
    let userData = req.session.userData
    res.header('Content-Type', 'application/json')
    let request: RegisterRequest

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
                request = new RegisterRequest(false, `Falta el campo ${param}`, param as RegisterValidField)
                res.send(request.toJson())
                return
            }
        }

        if(await User.findOne({where: { email: inData.email }})){
            request = new RegisterRequest(false, "El email ya esta en uso", "email")
            res.send(request.toJson())
            return
        }else if(await User.findOne({where: { username: inData.username }})){
            request = new RegisterRequest(false, "El nombre de usuario ya esta en uso", "username")
            res.send(request.toJson())
            return
        }

        for(let param of ["name", "surname", "username"]){
            if(inData[param].length < 3){
                request = new RegisterRequest(false, `El ${param} debe tener al menos 3 caracteres`, param as RegisterValidField)
                res.send(request.toJson())
                return
            }
        }

        if(inData.password.length < 6){
            request = new RegisterRequest(false, "La contrasena debe tener al menos 6 caracteres", "password")
            res.send(request.toJson())
            return
        }

        if(inData.password != inData.password2){
            request = new RegisterRequest(false, "Las contrasenas no coinciden", "password2")
            res.send(request.toJson())
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

        request = new RegisterRequest(true, "Éxito al registrar", null, {
            id: user.id,
            name: user.name,
            surname: user.surname,
            username: user.username,
            email: user.email,
            permissionLevel: user.permissionLevel
        })
        res.send(request.toJson())
    }
})

app.post(API + LoginRequest.path, async (req, res) => {
    let userData = req.session.userData
    res.header('Content-Type', 'application/json')
    let request: LoginRequest

    if(userData && userData.userId){
        request = new LoginRequest(false, "Ya estás registrado")
    } else {

        let inData = req.body
        let reqParams = ["userOrEmail", "password"]

        //ningun campo vacio
        for(let param of reqParams){
            if(!inData[param] || inData[param] == ""){
                request = new LoginRequest(false, `Falta el campo ${param}`, param as LoginValidField)
                res.send(request.toJson())
                return
            }
        }

        let user = await User.findOne({where: { [Op.or]: [{ username: inData.userOrEmail }, { email: inData.userOrEmail }] }})
        
        if(!user){
            request = new LoginRequest(false, "Nombre de usuario o email incorrecto", "userOrEmail")
            res.send(request.toJson())
            return
        }

        if(!bcrypt.compareSync(inData.password, user.password)){
            request = new LoginRequest(false, "Contrasena incorrecta", "password")
            res.send(request.toJson())
            return
        }

        req.session.userData = {
            userId: user.id
        }

        request = new LoginRequest(true, "Éxito al iniciar sesion", null, {
            id: user.id,
            name: user.name,
            surname: user.surname,
            username: user.username,
            email: user.email,
            permissionLevel: user.permissionLevel
        })
    }

    res.send(request.toJson())
})

app.post(API + LogoutRequest.path, (req, res) => {
    let userData = req.session.userData
    res.header('Content-Type', 'application/json')
    
    if(userData && userData.userId){
        userData.userId = null
        req.session.destroy(() => {
            let request = new LogoutRequest(true, "Éxito al cerrar sesion")
            res.send(request.toJson())
        })
    }else{
        let request = new LogoutRequest(false, "No estas registrado")
        res.send(request.toJson())
    }
})

export class RestController {
    static app = app
}