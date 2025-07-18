const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * @swagger
 * components:
 *   schemas:
 *     Cart:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         userId:
 *           type: string
 *           format: uuid
 *           description: User ID
 *         total:
 *           type: number
 *           format: float
 *           description: Total cart value
 *         itemCount:
 *           type: integer
 *           description: Number of items in cart
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

const Cart = sequelize.define('Cart', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  itemCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  }
}, {
  indexes: [
    {
      fields: ['userId']
    }
  ]
});

// Instance methods
Cart.prototype.updateTotals = async function() {
  const { CartItem } = require('./index');
  
  const items = await CartItem.findAll({
    where: { cartId: this.id },
    include: [{ model: require('./Product'), as: 'product' }]
  });

  this.total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  this.itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  
  return this.save();
};

Cart.prototype.isEmpty = function() {
  return this.itemCount === 0;
};

module.exports = Cart; 