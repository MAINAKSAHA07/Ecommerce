const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       required:
 *         - userId
 *         - total
 *         - status
 *         - paymentStatus
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         userId:
 *           type: string
 *           format: uuid
 *           description: Customer user ID
 *         sellerId:
 *           type: string
 *           format: uuid
 *           description: Seller user ID
 *         status:
 *           type: string
 *           enum: [pending, confirmed, processing, shipped, delivered, cancelled, refunded]
 *           description: Order status
 *         total:
 *           type: number
 *           format: float
 *           description: Total order amount
 *         subtotal:
 *           type: number
 *           format: float
 *           description: Subtotal before taxes and shipping
 *         tax:
 *           type: number
 *           format: float
 *           description: Tax amount
 *         shipping:
 *           type: number
 *           format: float
 *           description: Shipping cost
 *         discount:
 *           type: number
 *           format: float
 *           description: Discount amount
 *         paymentStatus:
 *           type: string
 *           enum: [pending, completed, failed, refunded]
 *           description: Payment status
 *         paymentMethod:
 *           type: string
 *           description: Payment method used
 *         shippingAddress:
 *           type: object
 *           description: Shipping address details
 *         billingAddress:
 *           type: object
 *           description: Billing address details
 *         notes:
 *           type: string
 *           description: Order notes
 *         trackingNumber:
 *           type: string
 *           description: Shipping tracking number
 *         estimatedDelivery:
 *           type: string
 *           format: date
 *           description: Estimated delivery date
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

const Order = sequelize.define('Order', {
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
  sellerId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'),
    allowNull: false,
    defaultValue: 'pending'
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  tax: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  shipping: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  discount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  paymentStatus: {
    type: DataTypes.ENUM('pending', 'completed', 'failed', 'refunded'),
    allowNull: false,
    defaultValue: 'pending'
  },
  paymentMethod: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'razorpay'
  },
  shippingAddress: {
    type: DataTypes.JSON,
    allowNull: false,
    validate: {
      isValidAddress(value) {
        if (!value.street || !value.city || !value.state || !value.zipCode || !value.country) {
          throw new Error('Shipping address must include street, city, state, zipCode, and country');
        }
      }
    }
  },
  billingAddress: {
    type: DataTypes.JSON,
    allowNull: false,
    validate: {
      isValidAddress(value) {
        if (!value.street || !value.city || !value.state || !value.zipCode || !value.country) {
          throw new Error('Billing address must include street, city, state, zipCode, and country');
        }
      }
    }
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  trackingNumber: {
    type: DataTypes.STRING,
    allowNull: true
  },
  estimatedDelivery: {
    type: DataTypes.DATE,
    allowNull: true
  },
  shippedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  deliveredAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  cancelledAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  cancelReason: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  indexes: [
    {
      fields: ['userId']
    },
    {
      fields: ['sellerId']
    },
    {
      fields: ['status']
    },
    {
      fields: ['paymentStatus']
    },
    {
      fields: ['createdAt']
    }
  ]
});

// Instance methods
Order.prototype.canBeCancelled = function() {
  return ['pending', 'confirmed', 'processing'].includes(this.status);
};

Order.prototype.canBeShipped = function() {
  return ['confirmed', 'processing'].includes(this.status);
};

Order.prototype.markAsShipped = function(trackingNumber) {
  this.status = 'shipped';
  this.shippedAt = new Date();
  if (trackingNumber) {
    this.trackingNumber = trackingNumber;
  }
  return this.save();
};

Order.prototype.markAsDelivered = function() {
  this.status = 'delivered';
  this.deliveredAt = new Date();
  return this.save();
};

Order.prototype.cancel = function(reason) {
  if (!this.canBeCancelled()) {
    throw new Error('Order cannot be cancelled in its current status');
  }
  this.status = 'cancelled';
  this.cancelledAt = new Date();
  this.cancelReason = reason;
  return this.save();
};

Order.prototype.updatePaymentStatus = function(status) {
  this.paymentStatus = status;
  if (status === 'completed' && this.status === 'pending') {
    this.status = 'confirmed';
  }
  return this.save();
};

module.exports = Order; 