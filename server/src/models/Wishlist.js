const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * @swagger
 * components:
 *   schemas:
 *     Wishlist:
 *       type: object
 *       required:
 *         - userId
 *         - productId
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         userId:
 *           type: string
 *           format: uuid
 *           description: User ID
 *         productId:
 *           type: string
 *           format: uuid
 *           description: Product ID
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

const Wishlist = sequelize.define('Wishlist', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
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
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'User notes about this wishlist item'
  }
}, {
  indexes: [
    {
      fields: ['userId']
    },
    {
      fields: ['productId']
    },
    {
      unique: true,
      fields: ['userId', 'productId']
    }
  ]
});

// Instance methods
Wishlist.prototype.addNote = function(note) {
  this.notes = note;
  return this.save();
};

module.exports = Wishlist; 