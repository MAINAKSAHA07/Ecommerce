const express = require('express');
const router = express.Router();
const { Order, OrderItem, Product } = require('../models');
const auth = require('../middlewares/auth');

// Get all orders for the current user
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['id', 'name', 'images', 'price']
            }
          ]
        }
      ]
    });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch orders' });
  }
});

// Placeholder for create order
router.post('/', (req, res) => {
  res.status(501).json({ message: 'Create order endpoint - not implemented yet' });
});

module.exports = router; 