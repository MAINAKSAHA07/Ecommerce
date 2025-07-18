const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * @swagger
 * components:
 *   schemas:
 *     Payment:
 *       type: object
 *       required:
 *         - orderId
 *         - amount
 *         - currency
 *         - status
 *         - paymentMethod
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         orderId:
 *           type: string
 *           format: uuid
 *           description: Order ID
 *         amount:
 *           type: number
 *           format: float
 *           description: Payment amount
 *         currency:
 *           type: string
 *           description: Payment currency (e.g., INR, USD)
 *         status:
 *           type: string
 *           enum: [pending, completed, failed, refunded]
 *           description: Payment status
 *         paymentMethod:
 *           type: string
 *           description: Payment method used
 *         razorpayPaymentId:
 *           type: string
 *           description: Razorpay payment ID
 *         razorpayOrderId:
 *           type: string
 *           description: Razorpay order ID
 *         transactionId:
 *           type: string
 *           description: Transaction ID from payment gateway
 *         gatewayResponse:
 *           type: object
 *           description: Full response from payment gateway
 *         refundAmount:
 *           type: number
 *           format: float
 *           description: Amount refunded
 *         refundReason:
 *           type: string
 *           description: Reason for refund
 *         refundedAt:
 *           type: string
 *           format: date-time
 *           description: When refund was processed
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

const Payment = sequelize.define('Payment', {
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
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  currency: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'INR',
    validate: {
      len: [3, 3]
    }
  },
  status: {
    type: DataTypes.ENUM('pending', 'completed', 'failed', 'refunded'),
    allowNull: false,
    defaultValue: 'pending'
  },
  paymentMethod: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'razorpay'
  },
  razorpayPaymentId: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  razorpayOrderId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  transactionId: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  gatewayResponse: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Full response from payment gateway'
  },
  refundAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    validate: {
      min: 0
    }
  },
  refundReason: {
    type: DataTypes.STRING,
    allowNull: true
  },
  refundedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  failureReason: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Reason for payment failure'
  },
  failureCode: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Error code from payment gateway'
  },
  processedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'When payment was processed'
  }
}, {
  indexes: [
    {
      fields: ['orderId']
    },
    {
      fields: ['status']
    },
    {
      fields: ['razorpayPaymentId']
    },
    {
      fields: ['transactionId']
    },
    {
      fields: ['createdAt']
    }
  ]
});

// Instance methods
Payment.prototype.markAsCompleted = function(gatewayResponse) {
  this.status = 'completed';
  this.gatewayResponse = gatewayResponse;
  this.processedAt = new Date();
  return this.save();
};

Payment.prototype.markAsFailed = function(failureReason, failureCode) {
  this.status = 'failed';
  this.failureReason = failureReason;
  this.failureCode = failureCode;
  this.processedAt = new Date();
  return this.save();
};

Payment.prototype.refund = function(amount, reason) {
  if (amount > this.amount) {
    throw new Error('Refund amount cannot exceed payment amount');
  }
  
  this.status = 'refunded';
  this.refundAmount = amount;
  this.refundReason = reason;
  this.refundedAt = new Date();
  return this.save();
};

Payment.prototype.isRefundable = function() {
  return this.status === 'completed' && !this.refundAmount;
};

Payment.prototype.getRefundableAmount = function() {
  if (this.status !== 'completed') {
    return 0;
  }
  return this.amount - (this.refundAmount || 0);
};

module.exports = Payment; 