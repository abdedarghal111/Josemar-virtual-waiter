import { STORAGE_DB_FILE_PATH } from "../paths.mts";
import { Sequelize, DataTypes, Model, Optional } from "sequelize";

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: STORAGE_DB_FILE_PATH, // Ruta del archivo SQLite
      logging: (msg) => {
        // Solo loguea si el mensaje contiene "ERROR"
        if (msg.includes('ERROR')) console.error(msg);
      }
})

interface UserAttributes extends Model {
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

export const User = sequelize.define<UserAttributes, any>('User', {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING
    },
    surname: {
        type: DataTypes.STRING
    },
    username: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING
    },
    password: {
        type: DataTypes.STRING
    },
    permissionLevel: {
        type: DataTypes.ENUM('admin', 'worker', 'user'),
        defaultValue: 'user'
    }
}, {
    tableName: 'users',
    timestamps: true
});

interface OrderAttributes extends Model {
  id: number
  name: string
  status: 'requested' | 'done'
  orderDate: Date
  createdAt?: Date
  updatedAt?: Date
}

export const Order = sequelize.define<OrderAttributes, any>('Order', {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING
    },
    status: {
        type: DataTypes.ENUM('requested', 'done'),
        defaultValue: 'requested'
    },
    orderDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'orders',
    timestamps: true
});

interface ReservationAttributes extends Model {
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

export const Reservation = sequelize.define<ReservationAttributes, any>('Reservation', {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    requestedBy: {
        type: DataTypes.INTEGER.UNSIGNED,
        references: {
            model: User,
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
    },
    orderId: {
        type: DataTypes.INTEGER.UNSIGNED,
        references: {
            model: Order,
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
    },
    requestDate: {
        type: DataTypes.DATE
    },
    status: {
        type: DataTypes.ENUM('requested', 'accepted', 'rejected'),
        defaultValue: 'requested'
    },
    numAdults: {
        type: DataTypes.INTEGER.UNSIGNED,
        defaultValue: 0
    },
    numMinors: {
        type: DataTypes.INTEGER.UNSIGNED,
        defaultValue: 0
    }
}, {
    tableName: 'reservations',
    timestamps: true
});

export const Category = sequelize.define('Category', {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    productType: {
        type: DataTypes.STRING
    },
    foodType: {
        type: DataTypes.STRING
    },
    foodSubType: {
        type: DataTypes.STRING
    }
}, {
    tableName: 'categories',
    timestamps: true
});

interface ProductAttributes extends Model {
    id: number
    name: string
    categoryId: number
    description: string
    stock: number
    price: number
    createdAt?: Date
    updatedAt?: Date
}

export const Product = sequelize.define<ProductAttributes, any>('Product', {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING
    },
    categoryId: {
        type: DataTypes.INTEGER.UNSIGNED,
        references: {
            model: Category,
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
    },
    description: {
        type: DataTypes.TEXT
    },
    stock: {
        type: DataTypes.INTEGER.UNSIGNED,
        defaultValue: 0
    },
    price: {
        type: DataTypes.FLOAT.UNSIGNED
    }
}, {
    tableName: 'products',
    timestamps: true
});

export const ProductImage = sequelize.define('ProductImage', {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    productId: {
        type: DataTypes.INTEGER.UNSIGNED,
        references: {
            model: Product,
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
    },
    imageUrl: {
        type: DataTypes.STRING
    }
}, {
    tableName: 'product_images',
    timestamps: true
});

interface OrderProductAttributes extends Model {
    orderId: number
    productId: number
    quantity: number
    annotation: string
    status: 'notPrepared' | 'making' | 'ready' | 'delivered'
    createdAt?: Date
    updatedAt?: Date
}

export const OrderProduct = sequelize.define<OrderProductAttributes, any>('OrderProduct', {
    quantity: {
        type: DataTypes.INTEGER.UNSIGNED,
        defaultValue: 1
    },
    status: {
        type: DataTypes.ENUM('notPrepared', 'making', 'ready', 'delivered'),
        defaultValue: 'requested'
    },
    annotation: {
        type: DataTypes.STRING
    },
    orderId: {
        type: DataTypes.INTEGER.UNSIGNED,
        references: {
            model: Order,
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
    },
    productId: {
        type: DataTypes.INTEGER.UNSIGNED,
        references: {
            model: Product,
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
    }
}, {
    tableName: 'order_product',
    timestamps: false
});

export const Menu = sequelize.define('Menu', {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        references: {
            model: Product,
            key: 'id'
        }
    },
    name: {
        type: DataTypes.STRING
    },
    description: {
        type: DataTypes.TEXT
    }
}, {
    tableName: 'menus',
    timestamps: true
});

export const MenuProduct = sequelize.define('MenuProduct', {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    order: {
        type: DataTypes.INTEGER.UNSIGNED,
        defaultValue: 0
    },
    menuId: {
        type: DataTypes.INTEGER.UNSIGNED,
        references: {
            model: Menu,
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
    },
    productId: {
        type: DataTypes.INTEGER.UNSIGNED,
        references: {
            model: Product,
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
    }
}, {
    tableName: 'menu_product',
    timestamps: true
});

export const Drink = sequelize.define('Drink', {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        references: {
            model: Product,
            key: 'id'
        }
    },
    size: {
        type: DataTypes.STRING
    }
}, {
    tableName: 'drinks',
    timestamps: true
});

export const Dish = sequelize.define('Dish', {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        references: {
            model: Product,
            key: 'id'
        }
    },
    portions: {
        type: DataTypes.STRING
    }
}, {
    tableName: 'dishes',
    timestamps: true
});

export const Ingredient = sequelize.define('Ingredient', {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING
    },
    description: {
        type: DataTypes.TEXT
    },
    allergens: {
        type: DataTypes.STRING
    }
}, {
    tableName: 'ingredients',
    timestamps: true
});

export const DishIngredient = sequelize.define('DishIngredient', {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    order: {
        type: DataTypes.INTEGER.UNSIGNED,
        defaultValue: 0
    },
    dishId: {
        type: DataTypes.INTEGER.UNSIGNED,
        references: {
            model: Dish,
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
    },
    ingredientId: {
        type: DataTypes.INTEGER.UNSIGNED,
        references: {
            model: Ingredient,
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
    }
}, {
    tableName: 'dish_ingredient',
    timestamps: true
});


//constraints
User.hasMany(Reservation, { foreignKey: 'requestedBy' });
Reservation.belongsTo(User, { foreignKey: 'requestedBy' });

Order.hasOne(Reservation, { foreignKey: 'orderId' });
Reservation.belongsTo(Order, { foreignKey: 'orderId' });

Category.hasMany(Product, { foreignKey: 'categoryId' });
Product.belongsTo(Category, { foreignKey: 'categoryId' });

Product.hasMany(ProductImage, { foreignKey: 'productId' });
ProductImage.belongsTo(Product, { foreignKey: 'productId' });

Order.belongsToMany(Product, { through: OrderProduct, foreignKey: 'orderId' });
Product.belongsToMany(Order, { through: OrderProduct, foreignKey: 'productId' });

Menu.belongsToMany(Product, { through: MenuProduct, foreignKey: 'menuId' });
Product.belongsToMany(Menu, { through: MenuProduct, foreignKey: 'productId' });

Drink.belongsTo(Product, { foreignKey: 'id' });
Product.hasOne(Drink, { foreignKey: 'id' });

Menu.belongsTo(Product, { foreignKey: 'id' });
Product.hasOne(Menu, { foreignKey: 'id' });

Dish.belongsTo(Product, { foreignKey: 'id' });
Product.hasOne(Dish, { foreignKey: 'id' });

Dish.belongsToMany(Ingredient, { through: DishIngredient, foreignKey: 'dishId' });
Ingredient.belongsToMany(Dish, { through: DishIngredient, foreignKey: 'ingredientId' });

//syncing
await sequelize.sync()
User.sync()
Product.sync()
Category.sync()
Order.sync()
OrderProduct.sync()
ProductImage.sync()
Menu.sync()
MenuProduct.sync()
Drink.sync()
Dish.sync()
DishIngredient.sync()
Ingredient.sync()

export class DatabaseController {
    static sequelize = sequelize
}