const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * @swagger
 * components:
 *   schemas:
 *     OrderItem:
 *       type: object
 *       required:
 *         - orderId
 *         - productId
 *         - quantity
 *         - price
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         orderId:
 *           type: string
 *           format: uuid
 *           description: Order ID
 *         productId:
 *           type: string
 *           format: uuid
 *           description: Product ID
 *         quantity:
 *           type: integer
 *           description: Quantity ordered
 *         price:
 *           type: number
 *           format: float
 *           description: Price per unit at time of order
 *         total:
 *           type: number
 *           format: float
 *           description: Total price for this item
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

const OrderItem = sequelize.define('OrderItem', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  orderId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Orders',
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
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  productSnapshot: {
    type: DataTypes.JSON,
    allowNull: false,
    comment: 'Snapshot of product data at time of order'
  }
}, {
  indexes: [
    {
      fields: ['orderId']
    },
    {
      fields: ['productId']
    }
  ],
  hooks: {
    beforeCreate: (orderItem) => {
      // Calculate total
      orderItem.total = orderItem.price * orderItem.quantity;
    },
    beforeUpdate: (orderItem) => {
      // Recalculate total if price or quantity changes
      if (orderItem.changed('price') || orderItem.changed('quantity')) {
        orderItem.total = orderItem.price * orderItem.quantity;
      }
    }
  }
});

// Instance methods
OrderItem.prototype.getTotal = function() {
  return this.price * this.quantity;
};

module.exports = OrderItem; 