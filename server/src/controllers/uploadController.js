const cloudStorage = require('../services/cloudStorage');

// Upload single image
const uploadSingleImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided',
      });
    }

    // Upload to cloud storage
    const result = await cloudStorage.uploadFile(req.file, 'images');
    
    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        url: result.url,
        fileName: result.fileName,
        originalName: result.originalName,
        size: result.size,
        mimetype: result.mimetype,
      },
    });
  } catch (error) {
    console.error('Upload single image error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload image',
      error: error.message,
    });
  }
};

// Upload multiple images
const uploadMultipleImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No image files provided',
      });
    }

    // Upload multiple files to cloud storage
    const results = await cloudStorage.uploadMultipleFiles(req.files, 'images');
    
    res.status(200).json({
      success: true,
      message: `${results.length} images uploaded successfully`,
      data: results.map(result => ({
        url: result.url,
        fileName: result.fileName,
        originalName: result.originalName,
        size: result.size,
        mimetype: result.mimetype,
      })),
    });
  } catch (error) {
    console.error('Upload multiple images error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload images',
      error: error.message,
    });
  }
};

// Upload document
const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No document file provided',
      });
    }

    // Upload to cloud storage
    const result = await cloudStorage.uploadFile(req.file, 'documents');
    
    res.status(200).json({
      success: true,
      message: 'Document uploaded successfully',
      data: {
        url: result.url,
        fileName: result.fileName,
        originalName: result.originalName,
        size: result.size,
        mimetype: result.mimetype,
      },
    });
  } catch (error) {
    console.error('Upload document error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload document',
      error: error.message,
    });
  }
};

// Upload product images
const uploadProductImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No product images provided',
      });
    }

    // Upload multiple files to cloud storage
    const results = await cloudStorage.uploadMultipleFiles(req.files, 'products');
    
    res.status(200).json({
      success: true,
      message: `${results.length} product images uploaded successfully`,
      data: results.map(result => ({
        url: result.url,
        fileName: result.fileName,
        originalName: result.originalName,
        size: result.size,
        mimetype: result.mimetype,
      })),
    });
  } catch (error) {
    console.error('Upload product images error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload product images',
      error: error.message,
    });
  }
};

// Upload user avatar
const uploadUserAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No avatar image provided',
      });
    }

    // Upload to cloud storage
    const result = await cloudStorage.uploadFile(req.file, 'avatars');
    
    res.status(200).json({
      success: true,
      message: 'Avatar uploaded successfully',
      data: {
        url: result.url,
        fileName: result.fileName,
        originalName: result.originalName,
        size: result.size,
        mimetype: result.mimetype,
      },
    });
  } catch (error) {
    console.error('Upload user avatar error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload avatar',
      error: error.message,
    });
  }
};

// Delete file
const deleteFile = async (req, res) => {
  try {
    const { fileName } = req.params;
    
    if (!fileName) {
      return res.status(400).json({
        success: false,
        message: 'File name is required',
      });
    }

    // Delete from cloud storage
    await cloudStorage.deleteFile(fileName);
    
    res.status(200).json({
      success: true,
      message: 'File deleted successfully',
    });
  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete file',
      error: error.message,
    });
  }
};

// Get file metadata
const getFileMetadata = async (req, res) => {
  try {
    const { fileName } = req.params;
    
    if (!fileName) {
      return res.status(400).json({
        success: false,
        message: 'File name is required',
      });
    }

    // Get metadata from cloud storage
    const metadata = await cloudStorage.getFileMetadata(fileName);
    
    res.status(200).json({
      success: true,
      data: metadata,
    });
  } catch (error) {
    console.error('Get file metadata error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get file metadata',
      error: error.message,
    });
  }
};

module.exports = {
  uploadSingleImage,
  uploadMultipleImages,
  uploadDocument,
  uploadProductImages,
  uploadUserAvatar,
  deleteFile,
  getFileMetadata,
}; 