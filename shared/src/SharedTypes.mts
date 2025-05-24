export interface PrivateUser {
  id?: number
  name: string
  surname: string
  username: string
  email: string
  permissionLevel: string
}

export interface UserAttributes {
  id: number
  name: string
  surname: string
  username: string
  email: string
  password: string
  permissionLevel: 'admin' | 'worker' | 'user'
  createdAt?: Date
  updatedAt?: Date
}

export interface ProductAttributes {
  id: number
  name: string
  categoryId: number
  description: string
  stock: number
  price: number
  createdAt?: Date
  updatedAt?: Date
}

export interface ReservationAttributes {
  id: number
  requestedBy: number
  orderId: number
  requestDate: Date
  status: 'requested' | 'accepted' | 'rejected'
  numAdults: number
  numMinors: number
  createdAt?: Date
  updatedAt?: Date
}

export interface anyObject {
  [key: string]: any
}

export interface lineType {
  quantity: number,
  productId: number,
  name: string,
  annotation: string
}

export interface OrderType {
  id: number
  name: string
  lines: lineType[]
}

export type orderLineStatus = 'notPrepared' | 'making' | 'ready' | 'delivered'

export type CompleteOrderType = {
    id: number
    name: string
    status: 'requested' | 'done'
    orderDate: Date
    lines: {
        productId: number
        quantity: number
        annotation: string
        status: orderLineStatus
        name: string | undefined
    }[]
}

export type orderLineId = { orderId: number, productId: number }

export type validObjectType = 'null' | 'user' | 'order' | 'reservation' | 'product' | 'completeOrder'