import { ListObjectsMessage } from "_shared/wsComunication/ListObjectsMessage.mjs"
import { GetObjectMessage, SetObjectMessage, DeleteObjectMessage } from "_shared/wsComunication/ObjectMessage.mjs"
import { BaseMessage } from "_shared/wsComunication/BaseMessage.mjs"
import { AcceptReserveMessage } from "_shared/wsComunication/AcceptReserveMessage.mjs"
import { SetOrderLineStatusMessage } from "_shared/wsComunication/SetOrderLineStatusMessage.mjs"
import { PushNotificationMessage, pushNotificationType } from "_shared/wsComunication/PushNotificationMessage.mjs"
import WebSocket from "ws"
import { Order, OrderProduct, Product, Reservation, User } from "./DatabaseController.mts"
import bcrypt from "bcrypt"
import { CompleteOrderType } from "_shared/SharedTypes.mjs"

// static class
export class EventsController {

    private static adminConnections: Record<string, WebSocket> = {}
    private static workerConnections: Record<string, WebSocket> = {}

    private static events = {}

    public static addConnection(sessionId: string, permissionLevel: string, ws: WebSocket) {
        let isAdmin = permissionLevel == "admin"
        if (isAdmin) {
            this.adminConnections[sessionId] = ws
        }
        this.workerConnections[sessionId] = ws

        ws.on('message', (message) => {
            console.log(`fromClient: ${message.toString()} \n`)
            try {
                const data = JSON.parse(message.toString())
                const eventName = data?.event

                if (eventName in this.events) {
                    this.events[eventName](sessionId, isAdmin, data)
                }
            } catch (error) { }
        })
    }

    public static removeConnection(sessionId: string) {
        delete this.adminConnections[sessionId]
        delete this.workerConnections[sessionId]
    }

    public static fireAdmins(event: string, message: BaseMessage) {
        for (let key in this.adminConnections) {
            this.adminConnections[key].send(message.toString())
        }
    }

    public static fireWorkers(event: string, message: BaseMessage) {
        for (let key in this.workerConnections) {
            this.workerConnections[key].send(message.toString())
        }
    }

    public static fireSelf(sessionId: string, message: BaseMessage) {
        console.log(`toClient: ${message.toString()}\n`)
        this.workerConnections[sessionId].send(message.toString())
    }

    public static pushNotification(type: pushNotificationType, message: string, soloAdmins: boolean = false) {
        let send = new PushNotificationMessage(type)
        send.setSuccess(message)

        if (soloAdmins) {
            EventsController.fireAdmins(PushNotificationMessage.event, send)
        } else {
            EventsController.fireWorkers(PushNotificationMessage.event, send)
        }
    }

    public static subscribe(event: string, callback: (sessionId: string, isAdmin: boolean, data: any) => void, soloAdmins: boolean = false) {
        this.events[event] = callback
    }
}

export async function getPreparedListReservations(): Promise<ListObjectsMessage> {
    let reservations = await Reservation.findAll()

    let cleanReservations = []
    for (let reservation of reservations) {
        let user = await User.findByPk(reservation.requestedBy)
        cleanReservations.push({
            id: reservation.id,
            requestedBy: user ? user.username : '',
            requestDate: reservation.requestDate,
            status: reservation.status,
            numAdults: reservation.numAdults,
            numMinors: reservation.numMinors
        })
    }

    {
        let send = new ListObjectsMessage("reservation", cleanReservations)

        return send
    }
}

export async function getCompleteOrder(orderId: number): Promise<CompleteOrderType> {
    let order = await Order.findByPk(orderId)

    let orderProducts = await OrderProduct.findAll({
        where: {
            orderId: orderId
        }
    })

    let formalOrder = {
        id: order.id,
        name: order.name,
        status: order.status,
        orderDate: order.orderDate,
        lines: []
    }

    for (let orderProduct of orderProducts) {
        formalOrder.lines.push({
            productId: orderProduct.productId,
            quantity: orderProduct.quantity,
            annotation: orderProduct.annotation,
            status: orderProduct.status,
            name: (await Product.findByPk(orderProduct.productId))?.name
        })
    }

    return formalOrder
}

EventsController.subscribe(ListObjectsMessage.event, async (sessionId: string, isAdmin: boolean, data: any) => {
    let received = ListObjectsMessage.fromTable(data)

    switch (received.getType()) {
        case "user":
            if (!isAdmin) { return }
            let users = await User.findAll()

            let cleanUsers = users.map(user => {
                let userObject = user.toJSON()
                delete userObject.password
                return userObject
            })

            {
                let send = new ListObjectsMessage("user", cleanUsers)

                return EventsController.fireSelf(sessionId, send)
            }
        case "product":
            if (!isAdmin) { return }
            let products = await Product.findAll()

            let cleanProducts = products.map(product => {
                let productObject = product.toJSON()
                return productObject
            })

            {
                let send = new ListObjectsMessage("product", cleanProducts)

                return EventsController.fireSelf(sessionId, send)
            }

        case "reservation":
            let reservations = await Reservation.findAll()

            let cleanReservations = []
            for (let reservation of reservations) {
                let user = await User.findByPk(reservation.requestedBy)
                cleanReservations.push({
                    id: reservation.id,
                    requestedBy: user ? user.name : '',
                    requestDate: reservation.requestDate,
                    status: reservation.status,
                    numAdults: reservation.numAdults,
                    numMinors: reservation.numMinors
                })
            }

            {
                let send = new ListObjectsMessage("reservation", cleanReservations)

                return EventsController.fireSelf(sessionId, send)
            }

        case "completeOrder":
            let orders = await Order.findAll()

            let cleanOrders = []
            for (let order of orders) {
                cleanOrders.push(await getCompleteOrder(order.id))
            }

            {
                let send = new ListObjectsMessage("completeOrder", cleanOrders)

                return EventsController.fireSelf(sessionId, send)
            }
    }
})

EventsController.subscribe(GetObjectMessage.event, async (sessionId: string, isAdmin: boolean, data: any) => {
    if (!isAdmin) { return }

    let received = GetObjectMessage.fromTable(data)

    switch (received.getType()) {
        case "user":
            let user = received.getUser()

            if (user.id) {
                let foundedUser = await User.findByPk(user.id)
                if (!foundedUser) {
                    let send = new GetObjectMessage("user", {})
                    send.setFailure(`Usuario con id ${user.id} no encontrado`)
                    return EventsController.fireSelf(sessionId, send)
                }

                let cleanUser = foundedUser.toJSON()
                delete cleanUser.password
                let send = new GetObjectMessage("user", cleanUser)
                return EventsController.fireSelf(sessionId, send)
            }
        case "product":
            let product = received.getProduct()

            if (product.id) {
                let foundedProduct = await Product.findByPk(product.id)
                if (!foundedProduct) {
                    let send = new GetObjectMessage("product", {})
                    send.setFailure(`Producto con id ${product.id} no encontrado`)
                    return EventsController.fireSelf(sessionId, send)
                }

                let cleanProduct = foundedProduct.toJSON()
                let send = new GetObjectMessage("product", cleanProduct)
                return EventsController.fireSelf(sessionId, send)
            }
    }
})

EventsController.subscribe(SetObjectMessage.event, async (sessionId: string, isAdmin: boolean, data: any) => {
    let received = SetObjectMessage.fromTable(data)

    switch (received.getType()) {
        case "user":
            if (!isAdmin) { return }
            let params = ["name", "surname", "username", "email", "permissionLevel"]

            let user = received.getUser()

            for (let param of params) {
                if (!user[param]) {
                    let send = new SetObjectMessage("user", {})
                    send.setFailure(`Falta el campo ${param}`)
                    return EventsController.fireSelf(sessionId, send)
                }
            }

            if (!["admin", "worker", "user"].includes(user.permissionLevel)) {
                let send = new SetObjectMessage("user", {})
                send.setFailure(`Debes seleccionar un nivel de permiso valido`)
                return EventsController.fireSelf(sessionId, send)
            }

            let foundedUser = await User.findByPk(user.id)

            if (!foundedUser) {
                if (!user.password || user.password == "") {
                    let send = new SetObjectMessage("user", {})
                    send.setFailure(`Falta la contraseña`)
                    return EventsController.fireSelf(sessionId, send)
                }

                let newUser = await User.create({
                    name: user.name,
                    surname: user.surname,
                    username: user.username,
                    email: user.email,
                    password: bcrypt.hashSync(user.password, 10),
                    permissionLevel: user.permissionLevel
                })

                let cleanUser = newUser.toJSON()
                delete cleanUser.password
                let send = new SetObjectMessage("user", cleanUser)
                send.setSuccess("Usuario creado")
                EventsController.fireSelf(sessionId, send)
            } else {
                foundedUser.name = user.name
                foundedUser.surname = user.surname
                foundedUser.username = user.username
                foundedUser.email = user.email
                let passwordUpdated = false
                if (user.password && user.password != "") {
                    passwordUpdated = true
                    foundedUser.password = bcrypt.hashSync(user.password, 10)
                }
                foundedUser.permissionLevel = user.permissionLevel

                try {
                    await foundedUser.save()
                } catch (error) {
                    let send = new SetObjectMessage("user", {})
                    send.setFailure(`Error al actualizar el usuario`)
                    return EventsController.fireSelf(sessionId, send)
                }

                let cleanUser = foundedUser.toJSON()
                delete cleanUser.password
                let send = new SetObjectMessage("user", cleanUser)
                send.setSuccess(`Usuario actualizado${passwordUpdated ? " y contraseña cambiada" : ""}`)
                EventsController.fireSelf(sessionId, send)
            }

            let users = await User.findAll()

            let cleanUsers = users.map(user => {
                let userObject = user.toJSON()
                delete userObject.password
                return userObject
            })

            {
                let sendAll = new ListObjectsMessage("user", cleanUsers)
                sendAll.setSuccess("NEW_USER")
                return EventsController.fireAdmins(sessionId, sendAll)
            }

        case "product":
            if (!isAdmin) { return }
            let product = received.getProduct()

            if (!product.name || product.name == "") {
                let send = new SetObjectMessage("product", {})
                send.setFailure(`Falta el campo name`)
                return EventsController.fireSelf(sessionId, send)
            } else if (isNaN(Number(product.stock))) {
                let send = new SetObjectMessage("product", {})
                send.setFailure(`Falta el campo stock`)
                return EventsController.fireSelf(sessionId, send)
            } else if (isNaN(Number(product.price))) {
                let send = new SetObjectMessage("product", {})
                send.setFailure(`Falta el campo price`)
                return EventsController.fireSelf(sessionId, send)
            }

            let foundedProduct = await Product.findByPk(product.id)

            if (!foundedProduct) {
                let newProduct = await Product.create({
                    name: product.name,
                    description: product.description ?? '',
                    stock: product.stock,
                    price: product.price
                })

                let cleanProduct = newProduct.toJSON()
                let send = new SetObjectMessage("product", cleanProduct)
                send.setSuccess("Producto creado")
                EventsController.fireSelf(sessionId, send)
            } else {
                foundedProduct.name = product.name
                foundedProduct.description = product.description
                foundedProduct.stock = product.stock
                foundedProduct.price = product.price

                try {
                    await foundedProduct.save()
                } catch (error) {
                    let send = new SetObjectMessage("product", {})
                    send.setFailure(`Error al actualizar el producto`)
                    return EventsController.fireSelf(sessionId, send)
                }

                let cleanProduct = foundedProduct.toJSON()
                let send = new SetObjectMessage("product", cleanProduct)
                send.setSuccess("Producto actualizado")
                EventsController.fireSelf(sessionId, send)
            }

            let products = await Product.findAll()

            let cleanProducts = products.map(product => {
                let productObject = product.toJSON()
                return productObject
            })

            {
                let sendAll = new ListObjectsMessage("product", cleanProducts)
                sendAll.setSuccess("NEW_PRODUCT")
                return EventsController.fireWorkers(sessionId, sendAll)
            }

        case "order":

            let order = received.getOrder()

            if (!order.lines || order.lines.length == 0) {
                let send = new SetObjectMessage("order", {})
                send.setFailure(`Pedido sin productos`)
                return EventsController.fireSelf(sessionId, send)
            }

            let foundedOrder = await Order.findByPk(order.id)

            if (!foundedOrder) {

                let newOrder = await Order.create({
                    name: order.name,
                    status: "requested",
                    orderDate: new Date()
                })

                for (let line of order.lines) {
                    await OrderProduct.create({
                        orderId: newOrder.id,
                        productId: line.productId,
                        quantity: line.quantity,
                        annotation: line.annotation ?? '',
                        status: 'notPrepared'
                    })
                }

                let cleanOrder = getCompleteOrder(newOrder.id)

                let send = new SetObjectMessage("completeOrder", cleanOrder)
                send.setSuccess("Pedido guardado")
                EventsController.fireSelf(sessionId, send)
            } else {
                foundedOrder.name = order.name

                try {
                    await foundedOrder.save()

                    let currentLines = await OrderProduct.findAll({
                        where: { orderId: foundedOrder.id }
                    })

                    let receivedProductIds = order.lines.map(line => line.productId)
                    let currentProductIds = currentLines.map(line => line.productId)

                    for (let line of currentLines) {
                        if (!receivedProductIds.includes(line.productId)) {
                            await line.destroy()
                        }
                    }

                    for (let line of order.lines) {
                        if (!currentProductIds.includes(line.productId)) {
                            await OrderProduct.create({
                                orderId: foundedOrder.id,
                                productId: line.productId,
                                annotation: line.annotation ?? '',
                                quantity: line.quantity,
                                status: 'notPrepared'
                            })
                        }else{
                            let duplicatedLine = await OrderProduct.findOne({
                                where: { orderId: foundedOrder.id, productId: line.productId }
                            })

                            if(duplicatedLine.quantity !== line.quantity){
                                duplicatedLine.quantity = line.quantity
                            }

                            if(duplicatedLine.annotation !== line.annotation){
                                duplicatedLine.annotation = line.annotation
                            }

                            await duplicatedLine.save()
                        }
                    }

                } catch (error) {
                    let send = new SetObjectMessage("order", {})
                    send.setFailure(`Error al actualizar el pedido`)
                    return EventsController.fireSelf(sessionId, send)
                }

                let cleanOrder = foundedOrder.toJSON()
                cleanOrder.lines = order.lines

                let send = new SetObjectMessage("order", cleanOrder)
                send.setSuccess("Orden actualizada")
                EventsController.fireSelf(sessionId, send)
            }

            let orders = await Order.findAll()

            let cleanOrders = []

            for (let order of orders) {
                cleanOrders.push(await getCompleteOrder(order.id))
            }

            {
                let sendAll = new ListObjectsMessage("completeOrder", cleanOrders)
                sendAll.setSuccess(`NEW_ORDER:separator:${`#${order.id}(${order.name})`}:separator:${order.lines.length}`)
                return EventsController.fireWorkers(sessionId, sendAll)
            }

    }
})

EventsController.subscribe(DeleteObjectMessage.event, async (sessionId: string, isAdmin: boolean, data: any) => {
    if (!isAdmin) { return }

    let received = DeleteObjectMessage.fromTable(data)

    switch (received.getType()) {
        case "user":
            let user = received.getUser()

            if (user.id) {
                let foundedUser = await User.findByPk(user.id)
                if (!foundedUser) {
                    let send = new DeleteObjectMessage("user", {})
                    send.setFailure(`El usuario no existe`)
                    return EventsController.fireSelf(sessionId, send)
                }

                await foundedUser.destroy()

                let send = new DeleteObjectMessage("user", {})
                EventsController.fireSelf(sessionId, send)

                let users = await User.findAll()

                let cleanUsers = users.map(user => {
                    let userObject = user.toJSON()
                    delete userObject.password
                    return userObject
                })

                let sendAll = new ListObjectsMessage("user", cleanUsers)
                sendAll.setSuccess("DELETED_USER")
                return EventsController.fireAdmins(sessionId, sendAll)
            }

        case "product":
            let product = received.getProduct()

            if (product.id) {
                let foundedProduct = await Product.findByPk(product.id)
                if (!foundedProduct) {
                    let send = new DeleteObjectMessage("product", {})
                    send.setFailure(`El producto no existe`)
                    return EventsController.fireSelf(sessionId, send)
                }

                await foundedProduct.destroy()

                let send = new DeleteObjectMessage("product", {})
                EventsController.fireSelf(sessionId, send)

                let products = await Product.findAll()

                let cleanProducts = products.map(product => {
                    let productObject = product.toJSON()
                    return productObject
                })

                let sendAll = new ListObjectsMessage("product", cleanProducts)
                sendAll.setSuccess("DELETED_PRODUCT")
                return EventsController.fireAdmins(sessionId, sendAll)
            }
    }
})

EventsController.subscribe(AcceptReserveMessage.event, async (sessionId: string, isAdmin: boolean, data: any) => {

    let received = AcceptReserveMessage.fromTable(data)

    let reservation = await Reservation.findByPk(received.getId())

    if (!reservation) {
        let send = new AcceptReserveMessage(received.getId(), received.isAccepted())
        send.setFailure(`La reserva no existe`)
        return EventsController.fireSelf(sessionId, send)
    }

    if (reservation.status !== 'requested') {
        let send = new AcceptReserveMessage(received.getId(), received.isAccepted())
        send.setFailure(`La reserva ya fue revisada`)
        return EventsController.fireSelf(sessionId, send)
    }

    reservation.status = received.isAccepted() ? 'accepted' : 'rejected'
    await reservation.save()

    let send = new AcceptReserveMessage(received.getId(), received.isAccepted())
    send.setSuccess(`Reserva ${received.isAccepted() ? 'aceptada' : 'rechazada'} correctamente!`)
    EventsController.fireSelf(sessionId, send)

    let listReservationsEvent = await getPreparedListReservations()

    EventsController.fireWorkers(listReservationsEvent.event, listReservationsEvent)
})

EventsController.subscribe(SetOrderLineStatusMessage.event, async (sessionId: string, isAdmin: boolean, data: any) => {

    let received = SetOrderLineStatusMessage.fromTable(data)

    let orderLineId = received.getOrderLineId()
    let newStatus = received.getOrderLineStatus()

    let orderLine = await OrderProduct.findOne({
        where: {
            orderId: orderLineId.orderId,
            productId: orderLineId.productId
        }
    })

    if (!orderLine) {
        let send = new SetOrderLineStatusMessage(orderLineId, newStatus)
        send.setFailure(`No se encontró la línea del pedido`)
        return EventsController.fireSelf(sessionId, send)
    }

    orderLine.status = newStatus
    try {
        await orderLine.save()
    } catch (error) {
        let send = new SetOrderLineStatusMessage(orderLineId, newStatus)
        send.setFailure(`Error al actualizar el estado de la línea`)
        return EventsController.fireSelf(sessionId, send)
    }

    let send = new SetOrderLineStatusMessage(orderLineId, newStatus)
    send.setSuccess(`Estado de la línea actualizado correctamente`)
    EventsController.fireSelf(sessionId, send)

    let orders = await Order.findAll()
    let cleanOrders = []
    for (let order of orders) {
        cleanOrders.push(await getCompleteOrder(order.id))
    }

    let prodName = (await Product.findByPk(orderLine.productId))?.name
    let sendAll = new ListObjectsMessage("completeOrder", cleanOrders)
    sendAll.setSuccess("NEW_ORDER_LINE_STATUS:separator:" + orderLine.orderId + ":separator:" + prodName + ":separator:" + newStatus)
    EventsController.fireWorkers(sendAll.event, sendAll)
})