const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * @swagger
 * components:
 *   schemas:
 *     CartItem:
 *       type: object
 *       required:
 *         - cartId
 *         - productId
 *         - quantity
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         cartId:
 *           type: string
 *           format: uuid
 *           description: Cart ID
 *         productId:
 *           type: string
 *           format: uuid
 *           description: Product ID
 *         quantity:
 *           type: integer
 *           description: Quantity in cart
 *         price:
 *           type: number
 *           format: float
 *           description: Current product price
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

const CartItem = sequelize.define('CartItem', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  cartId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Carts',
      key: 'id'
    }
  },
  productId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Products',
      key: 'id'
    }
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    validate: {
      min: 1
    }
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  }
}, {
  indexes: [
    {
      fields: ['cartId']
    },
    {
      fields: ['productId']
    },
    {
      unique: true,
      fields: ['cartId', 'productId']
    }
  ],
  hooks: {
    beforeCreate: async (cartItem) => {
      // Set price from product if not provided
      if (!cartItem.price) {
        const Product = require('./Product');
        const product = await Product.findByPk(cartItem.productId);
        if (product) {
          cartItem.price = product.price;
        }
      }
    },
    afterCreate: async (cartItem) => {
      // Update cart totals
      const Cart = require('./Cart');
      const cart = await Cart.findByPk(cartItem.cartId);
      if (cart) {
        await cart.updateTotals();
      }
    },
    afterUpdate: async (cartItem) => {
      // Update cart totals
      const Cart = require('./Cart');
      const cart = await Cart.findByPk(cartItem.cartId);
      if (cart) {
        await cart.updateTotals();
      }
    },
    afterDestroy: async (cartItem) => {
      // Update cart totals
      const Cart = require('./Cart');
      const cart = await Cart.findByPk(cartItem.cartId);
      if (cart) {
        await cart.updateTotals();
      }
    }
  }
});

// Instance methods
CartItem.prototype.getTotal = function() {
  return this.price * this.quantity;
};

CartItem.prototype.updateQuantity = function(quantity) {
  if (quantity <= 0) {
    return this.destroy();
  }
  this.quantity = quantity;
  return this.save();
};

module.exports = CartItem; 