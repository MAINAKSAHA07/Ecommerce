const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - price
 *         - categoryId
 *         - sellerId
 *         - stock
 *         - sku
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *           description: Product name
 *         description:
 *           type: string
 *           description: Product description
 *         price:
 *           type: number
 *           format: float
 *           description: Product price
 *         comparePrice:
 *           type: number
 *           format: float
 *           description: Original price for comparison
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of product image URLs
 *         categoryId:
 *           type: string
 *           format: uuid
 *           description: Category ID
 *         sellerId:
 *           type: string
 *           format: uuid
 *           description: Seller user ID
 *         stock:
 *           type: integer
 *           description: Available stock quantity
 *         sku:
 *           type: string
 *           description: Stock keeping unit
 *         isActive:
 *           type: boolean
 *           description: Whether the product is active
 *         rating:
 *           type: number
 *           format: float
 *           description: Average product rating
 *         reviewCount:
 *           type: integer
 *           description: Number of reviews
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [2, 200]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  comparePrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    validate: {
      min: 0
    }
  },
  images: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: [],
    validate: {
      isArray: true
    }
  },
  categoryId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Categories',
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
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  sku: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      len: [3, 50]
    }
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  rating: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0,
    validate: {
      min: 0,
      max: 5
    }
  },
  reviewCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  weight: {
    type: DataTypes.DECIMAL(8, 2),
    allowNull: true,
    validate: {
      min: 0
    }
  },
  dimensions: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Object with length, width, height'
  },
  tags: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
    validate: {
      isArray: true
    }
  },
  featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  trending: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  indexes: [
    {
      fields: ['categoryId']
    },
    {
      fields: ['sellerId']
    },
    {
      fields: ['isActive']
    },
    {
      fields: ['featured']
    },
    {
      fields: ['trending']
    },
    {
      fields: ['rating']
    },
    {
      fields: ['price']
    }
  ]
});

// Instance methods
Product.prototype.isInStock = function() {
  return this.stock > 0;
};

Product.prototype.updateStock = function(quantity) {
  this.stock = Math.max(0, this.stock - quantity);
  return this.save();
};

Product.prototype.updateRating = function(newRating) {
  const totalRating = (this.rating * this.reviewCount) + newRating;
  this.reviewCount += 1;
  this.rating = totalRating / this.reviewCount;
  return this.save();
};

module.exports = Product; 