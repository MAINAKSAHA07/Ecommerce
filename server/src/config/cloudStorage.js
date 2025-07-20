const path = require('path');

const cloudStorageConfig = {
  // Google Cloud Storage Configuration
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID || 'your-gcp-project-id',
  keyFilename: process.env.GOOGLE_CLOUD_KEY_FILE || path.join(__dirname, '../../gcp-key.json/gcp-key.json'),
  bucketName: process.env.GOOGLE_CLOUD_STORAGE_BUCKET || 'ecommerce-platform-bucket',
  
  // File upload limits
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB
  maxFiles: parseInt(process.env.MAX_FILES) || 10,
  
  // Allowed file types
  allowedImageTypes: [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/webp',
    'image/gif'
  ],
  
  allowedDocumentTypes: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ],
  
  // Folder structure
  folders: {
    images: 'images',
    products: 'products',
    avatars: 'avatars',
    documents: 'documents',
    temp: 'temp'
  },
  
  // URL configuration
  baseUrl: 'https://storage.googleapis.com',
  
  // Validation
  validateConfig() {
    const required = ['projectId', 'bucketName'];
    const missing = required.filter(key => !this[key]);
    
    if (missing.length > 0) {
      throw new Error(`Missing required cloud storage configuration: ${missing.join(', ')}`);
    }
    
    return true;
  },
  
  // Get public URL for a file
  getPublicUrl(fileName) {
    return `${this.baseUrl}/${this.bucketName}/${fileName}`;
  },
  
  // Validate file type
  isValidImageType(mimetype) {
    return this.allowedImageTypes.includes(mimetype);
  },
  
  isValidDocumentType(mimetype) {
    return this.allowedDocumentTypes.includes(mimetype);
  },
  
  // Get folder path
  getFolderPath(folder) {
    return this.folders[folder] || 'uploads';
  }
};

module.exports = cloudStorageConfig; 