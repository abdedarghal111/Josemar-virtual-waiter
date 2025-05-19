import './controllers/DatabaseController.mjs'
import './controllers/HttpController.mjs'
import './controllers/RestController.mjs'
import './controllers/SocketController.mjs'
import './controllers/EventsController.mjs'

import { HttpController } from './controllers/HttpController.mts'
import { Product, User } from './controllers/DatabaseController.mjs'
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


if(!await Product.count()) {
  Product.create({
    name: "Hamburguesa Clásica",
    description: "Carne de vacuno, lechuga, tomate, cebolla, queso, pan brioche",
    stock: 50,
    price: 8.50
  });

  Product.create({
    name: "Pizza Margarita",
    description: "Salsa de tomate, mozzarella fresca, albahaca",
    stock: 40,
    price: 9.00
  });

  Product.create({
    name: "Ensalada César",
    description: "Lechuga romana, pollo a la parrilla, crutones, parmesano, aderezo César",
    stock: 35,
    price: 7.25
  });

  Product.create({
    name: "Pasta Carbonara",
    description: "Spaghetti, huevo, guanciale, queso pecorino romano, pimienta negra",
    stock: 30,
    price: 10.50
  });

  Product.create({
    name: "Tarta de Chocolate",
    description: "Porción individual de tarta de chocolate casera",
    stock: 25,
    price: 4.50
  });

  Product.create({
    name: "Agua Mineral",
    description: "Botella de agua mineral 500ml",
    stock: 100,
    price: 1.75
  });

  Product.create({
    name: "Refresco de Cola",
    description: "Lata de refresco de cola 33cl",
    stock: 80,
    price: 2.00
  });

  Product.create({
    name: "Café Expreso",
    description: "Taza de café expreso",
    stock: 60,
    price: 2.20
  });

  Product.create({
    name: "Copa de Vino Tinto",
    description: "Copa de vino tinto de la casa",
    stock: 45,
    price: 3.50
  });

  Product.create({
    name: "Sopa de Tomate",
    description: "Tazón de sopa de tomate casera",
    stock: 20,
    price: 5.00
  });
}