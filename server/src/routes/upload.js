const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const { 
  uploadSingleImage, 
  uploadMultipleImages, 
  uploadDocument, 
  uploadAny 
} = require('../middlewares/upload');
const authMiddleware = require('../middlewares/auth');

// Public upload routes
router.post('/image', uploadSingleImage, uploadController.uploadSingleImage);
router.post('/images', uploadMultipleImages, uploadController.uploadMultipleImages);
router.post('/document', uploadDocument, uploadController.uploadDocument);

// Protected upload routes (require authentication)
router.post('/product-images', authMiddleware, uploadMultipleImages, uploadController.uploadProductImages);
router.post('/avatar', authMiddleware, uploadSingleImage, uploadController.uploadUserAvatar);
router.delete('/file/:fileName', authMiddleware, uploadController.deleteFile);
router.get('/file/:fileName/metadata', authMiddleware, uploadController.getFileMetadata);

module.exports = router; 