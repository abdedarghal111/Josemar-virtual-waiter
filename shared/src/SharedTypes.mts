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

export type validObjectType = 'null' | 'user' | 'order' | 'reservation' | 'product'