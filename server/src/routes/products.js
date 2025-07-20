const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middlewares/auth');
const sellerMiddleware = require('../middlewares/seller');

// Public routes - specific routes first
router.get('/search', productController.searchProducts);
router.get('/featured', productController.getFeaturedProducts);
router.get('/seller/products', authMiddleware, sellerMiddleware, productController.getSellerProducts);

// General routes
router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);

// Protected routes (seller only)
router.post('/', authMiddleware, sellerMiddleware, productController.createProduct);
router.put('/:id', authMiddleware, sellerMiddleware, productController.updateProduct);
router.delete('/:id', authMiddleware, sellerMiddleware, productController.deleteProduct);

module.exports = router; 