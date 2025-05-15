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