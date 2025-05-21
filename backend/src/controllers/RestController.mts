import { Op } from "sequelize"
import { Product, Reservation, User } from "./DatabaseController.mts"
import { HttpController, UserSessionDataType } from "./HttpController.mts"
import { EventsController, getPreparedListReservations } from "./EventsController.mts"
import bcrypt from "bcrypt"
import { LoginRequest, type ValidFields as LoginValidField } from "_shared/requests/LoginRequest.mjs"
import { RegisterRequest, type ValidFields as RegisterValidField } from "_shared/requests/RegisterRequest.mjs"
import { WhoAmIRequest } from "_shared/requests/WhoAmIRequest.mjs"
import { LogoutRequest } from "_shared/requests/LogoutRequest.mjs"
import { GetProductsRequest } from "_shared/requests/GetProductsRequest.mjs"
import { GetReservationRequest } from "_shared/requests/GetReservationRequest.mjs"
import { SetReservationRequest } from "_shared/requests/SetReservationRequest.mjs"
import { ListMyReservesRequest } from "_shared/requests/ListMyReservesRequest.mjs"
import { DeleteReservationRequest } from "_shared/requests/DeleteReservationRequest.mjs"
import { ProductAttributes, ReservationAttributes } from "_shared/SharedTypes.mjs"
import { ListObjectsMessage } from "_shared/wsComunication/ListObjectsMessage.mjs"

const app = HttpController.express
const API = '/api/'

app.post(API + WhoAmIRequest.path, async (req, res) => {
    res.header('Content-Type', 'application/json')
    let request: WhoAmIRequest

    let user = await getRequestUser(req.session.userData)

    if(user){
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
    res.header('Content-Type', 'application/json')
    let request: RegisterRequest
    let user = await getRequestUser(req.session.userData)

    if(user){
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
    res.header('Content-Type', 'application/json')
    let request: LoginRequest
    let user = await getRequestUser(req.session.userData)

    if(user){
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

app.post(API + LogoutRequest.path, async (req, res) => {
    res.header('Content-Type', 'application/json')
    
    let user = await getRequestUser(req.session.userData)
    if(user){
        EventsController.removeConnection(req.sessionID)
        req.session.userData = null
        req.session.destroy(() => {
            let request = new LogoutRequest(true, "Éxito al cerrar sesion")
            res.send(request.toJson())
        })
    }else{
        let request = new LogoutRequest(false, "No estas registrado")
        res.send(request.toJson())
    }
})

app.post(API + GetProductsRequest.path, async (req, res) => {
    let products = await Product.findAll()

    let cleanProducts = products.map(product => {
        return {
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price
        }
    })

    res.header('Content-Type', 'application/json')
    
    let request = new GetProductsRequest(true, "", cleanProducts as ProductAttributes[])
    res.send(request.toJson())
})

app.post(API + GetReservationRequest.path, async (req, res) => {
    
    let user = await getRequestUser(req.session.userData)
    
    res.header('Content-Type', 'application/json')

    if(!user){
        let request = new GetReservationRequest(false, "No estas registrado", {} as ReservationAttributes)
        res.send(request.toJson())
        return
    }

    let inData = req.body

    if(!inData.id){
        let request = new GetReservationRequest(false, "Falta el campo productId", {} as ReservationAttributes)
        res.send(request.toJson())
        return
    }

    let reservation = await Reservation.findByPk(inData.id)

    if(!reservation){
        let request = new GetReservationRequest(false, "Reserva no encontrada", {} as ReservationAttributes)
        res.send(request.toJson())
        return
    }

    if(reservation.requestedBy != user.id){
        let request = new GetReservationRequest(false, "Reserva no encontrada", {} as ReservationAttributes)
        res.send(request.toJson())
        return
    }

    let cleanReservation = {
        id: reservation.id,
        requestDate: reservation.requestDate,
        status: reservation.status,
        numAdults: reservation.numAdults,
        numMinors: reservation.numMinors
    }

    let request = new GetReservationRequest(true, "", cleanReservation as ReservationAttributes)
    res.send(request.toJson())
})

app.post(API + SetReservationRequest.path, async (req, res) => {
    
    let user = await getRequestUser(req.session.userData)
    
    res.header('Content-Type', 'application/json')

    if(!user){
        let request = new GetReservationRequest(false, "No estas registrado", {} as ReservationAttributes)
        res.send(request.toJson())
        return
    }

    let inData = req.body
    let requiredFields = ["requestDate"]

    for(let field of requiredFields){
        if(!inData[field]){
            let request = new SetReservationRequest(false, `Falta el campo ${field}`, {} as ReservationAttributes)
            res.send(request.toJson())
            return
        }
    }

    let requestDate = new Date(inData.requestDate)
    let adults = inData.numAdults ?? 0
    let minors = inData.numMinors ?? 0
    let totalPeople = adults + minors

    if(requestDate.getTime() < Date.now()){
        let request = new SetReservationRequest(false, "La fecha de la reserva debe ser posterior a la actual", {} as ReservationAttributes)
        res.send(request.toJson())
        return
    }

    if(totalPeople < 1){
        let request = new SetReservationRequest(false, "La reserva debe tener al menos 1 persona", {} as ReservationAttributes)
        res.send(request.toJson())
        return
    }

    if(inData.id){
        let reservation = await Reservation.findByPk(inData.id)

        if(reservation && reservation.requestedBy == user.id){

            if(reservation.status != 'requested'){
                let request = new SetReservationRequest(false, "Reserva revisada, no se puede editar", {} as ReservationAttributes)
                res.send(request.toJson())
                return
            }

            reservation = await reservation.update({
                requestDate: requestDate,
                numAdults: adults,
                numMinors: minors
            })

            let cleanReservation = {
                id: reservation.id,
                requestDate: reservation.requestDate,
                status: reservation.status,
                numAdults: reservation.numAdults,
                numMinors: reservation.numMinors
            }

            let request = new SetReservationRequest(true, "", cleanReservation as ReservationAttributes)
            res.send(request.toJson())
            let preparedListReservations = await getPreparedListReservations()
            EventsController.fireAdmins(preparedListReservations.event, preparedListReservations)
            EventsController.pushNotification('edited', `${user.name} ha editado la reserva ${inData.id}`, true)
            return
        }
    }

    let newReservation = await Reservation.create({
        requestedBy: user.id,
        requestDate: requestDate,
        status: 'requested',
        numAdults: adults,
        numMinors: minors
    })

    let request = new SetReservationRequest(true, "", {
        id: newReservation.id,
        requestedBy: newReservation.requestedBy,
        requestDate: newReservation.requestDate,
        status: newReservation.status,
        numAdults: newReservation.numAdults,
        numMinors: newReservation.numMinors
    } as ReservationAttributes)
    res.send(request.toJson())

    let preparedListReservations = await getPreparedListReservations()
    EventsController.fireAdmins(preparedListReservations.event, preparedListReservations)
    EventsController.pushNotification('info', `${user.name} ha solicitado una reserva`, true)
})

app.post(API + ListMyReservesRequest.path, async (req, res) => {
    
    let user = await getRequestUser(req.session.userData)
    
    res.header('Content-Type', 'application/json')

    if(!user){
        let request = new GetReservationRequest(false, "No estas registrado", {} as ReservationAttributes)
        res.send(request.toJson())
        return
    }

    let reservations = await Reservation.findAll({
        where: {
            requestedBy: user.id
        }
    })

    let cleanReservations = reservations.map(reservation => {
        let reservationObject = {
            id: reservation.id,
            requestDate: reservation.requestDate,
            status: reservation.status,
            numAdults: reservation.numAdults,
            numMinors: reservation.numMinors
        }
        return reservationObject
    })

    let request = new ListMyReservesRequest(true, "", cleanReservations as ReservationAttributes[])
    res.send(request.toJson())
})

app.post(API + DeleteReservationRequest.path, async (req, res) => {
    
    let userData = req.session.userData
    
    res.header('Content-Type', 'application/json')

    if(!userData || !userData.userId){
        let request = new DeleteReservationRequest(false, "No estas registrado")
        res.send(request.toJson())
        return
    }

    let user = await User.findByPk(userData.userId)

    if(!user){
        let request = new DeleteReservationRequest(false, "No estas registrado")
        res.send(request.toJson())
        return
    }

    let inData = req.body

    if(!inData.id){
        let request = new DeleteReservationRequest(false, "Falta el id de la reserva")
        res.send(request.toJson())
        return
    }

    let reservation = await Reservation.findByPk(inData.id)

    if(!reservation){
        let request = new DeleteReservationRequest(false, "Reserva no encontrada")
        res.send(request.toJson())
        return
    }

    if(reservation.requestedBy != user.id){
        let request = new DeleteReservationRequest(false, "Reserva no encontrada")
        res.send(request.toJson())
        return
    }

    if(reservation.status != 'requested'){
        let request = new DeleteReservationRequest(false, "No se puede borrar la reserva porque ya ha sido revisada.")
        res.send(request.toJson())
        return
    }

    EventsController.pushNotification('warning', `${user.name} ha eliminado su solicitud de reserva.`, true)
    await reservation.destroy()

    let preparedListReservations = await getPreparedListReservations()
    EventsController.fireAdmins(preparedListReservations.event, preparedListReservations)

    let request = new DeleteReservationRequest(true, `Reserva #${inData.id} borrada correctamente`)
    res.send(request.toJson())
})

async function getRequestUser(userData: UserSessionDataType){
    if(!userData || !userData.userId){
        return
    }

    let user = await User.findByPk(userData.userId)

    if(!user){
        return
    }

    return user
}


export class RestController {
    static app = app
}