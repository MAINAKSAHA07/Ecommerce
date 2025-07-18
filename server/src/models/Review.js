const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * @swagger
 * components:
 *   schemas:
 *     Review:
 *       type: object
 *       required:
 *         - productId
 *         - userId
 *         - rating
 *         - title
 *         - comment
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         productId:
 *           type: string
 *           format: uuid
 *           description: Product ID
 *         userId:
 *           type: string
 *           format: uuid
 *           description: User ID who wrote the review
 *         rating:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *           description: Rating from 1 to 5
 *         title:
 *           type: string
 *           description: Review title
 *         comment:
 *           type: string
 *           description: Review comment
 *         isVerified:
 *           type: boolean
 *           description: Whether the review is from a verified purchase
 *         helpful:
 *           type: integer
 *           description: Number of helpful votes
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

const Review = sequelize.define('Review', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  productId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Products',
      key: 'id'
    }
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    }
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [5, 200]
    }
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      len: [10, 2000]
    }
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  helpful: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  images: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
    validate: {
      isArray: true
    }
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending'
  },
  moderatedBy: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  moderatedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  moderationNotes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  indexes: [
    {
      fields: ['productId']
    },
    {
      fields: ['userId']
    },
    {
      fields: ['rating']
    },
    {
      fields: ['isVerified']
    },
    {
      fields: ['status']
    },
    {
      unique: true,
      fields: ['productId', 'userId']
    }
  ],
  hooks: {
    afterCreate: async (review) => {
      // Update product rating
      const Product = require('./Product');
      const product = await Product.findByPk(review.productId);
      if (product) {
        await product.updateRating(review.rating);
      }
    },
    afterUpdate: async (review) => {
      // Update product rating if rating changed
      if (review.changed('rating')) {
        const Product = require('./Product');
        const product = await Product.findByPk(review.productId);
        if (product) {
          // Recalculate average rating
          const { Review } = require('./index');
          const reviews = await Review.findAll({
            where: { 
              productId: review.productId,
              status: 'approved'
            }
          });
          
          const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
          product.rating = reviews.length > 0 ? totalRating / reviews.length : 0;
          product.reviewCount = reviews.length;
          await product.save();
        }
      }
    },
    afterDestroy: async (review) => {
      // Update product rating
      const Product = require('./Product');
      const product = await Product.findByPk(review.productId);
      if (product) {
        // Recalculate average rating
        const { Review } = require('./index');
        const reviews = await Review.findAll({
          where: { 
            productId: review.productId,
            status: 'approved'
          }
        });
        
        const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
        product.rating = reviews.length > 0 ? totalRating / reviews.length : 0;
        product.reviewCount = reviews.length;
        await product.save();
      }
    }
  }
});

// Instance methods
Review.prototype.markAsHelpful = function() {
  this.helpful += 1;
  return this.save();
};

Review.prototype.approve = function(moderatedBy, notes) {
  this.status = 'approved';
  this.moderatedBy = moderatedBy;
  this.moderatedAt = new Date();
  this.moderationNotes = notes;
  return this.save();
};

Review.prototype.reject = function(moderatedBy, notes) {
  this.status = 'rejected';
  this.moderatedBy = moderatedBy;
  this.moderatedAt = new Date();
  this.moderationNotes = notes;
  return this.save();
};

module.exports = Review; 