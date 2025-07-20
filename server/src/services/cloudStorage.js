const { Storage } = require('@google-cloud/storage');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const config = require('../config/cloudStorage');

// Initialize Google Cloud Storage
const storage = new Storage({
  keyFilename: config.keyFilename,
  projectId: config.projectId,
});

const bucketName = config.bucketName;

class CloudStorageService {
  constructor() {
    this.bucket = storage.bucket(bucketName);
    // Validate configuration
    try {
      config.validateConfig();
    } catch (error) {
      console.error('Cloud storage configuration error:', error.message);
    }
  }

  // Upload a file to Google Cloud Storage
  async uploadFile(file, folder = 'uploads') {
    try {
      if (!file) {
        throw new Error('No file provided');
      }

      // Generate unique filename
      const fileExtension = path.extname(file.originalname);
      const fileName = `${folder}/${uuidv4()}${fileExtension}`;
      
      // Create file reference
      const fileRef = this.bucket.file(fileName);
      
      // Create write stream
      const stream = fileRef.createWriteStream({
        metadata: {
          contentType: file.mimetype,
          metadata: {
            originalName: file.originalname,
            uploadedAt: new Date().toISOString(),
          },
        },
        resumable: false,
      });

      return new Promise((resolve, reject) => {
        stream.on('error', (error) => {
          console.error('Upload error:', error);
          reject(new Error('File upload failed'));
        });

        stream.on('finish', async () => {
          try {
            // Make file publicly accessible
            await fileRef.makePublic();
            
            // Get public URL using config
            const publicUrl = config.getPublicUrl(fileName);
            
            resolve({
              url: publicUrl,
              fileName: fileName,
              originalName: file.originalname,
              size: file.size,
              mimetype: file.mimetype,
            });
          } catch (error) {
            console.error('Error making file public:', error);
            reject(new Error('Failed to make file public'));
          }
        });

        // Write file buffer to stream
        stream.end(file.buffer);
      });
    } catch (error) {
      console.error('Cloud storage upload error:', error);
      throw error;
    }
  }

  // Upload multiple files
  async uploadMultipleFiles(files, folder = 'uploads') {
    try {
      const uploadPromises = files.map(file => this.uploadFile(file, folder));
      const results = await Promise.all(uploadPromises);
      return results;
    } catch (error) {
      console.error('Multiple files upload error:', error);
      throw error;
    }
  }

  // Delete a file from Google Cloud Storage
  async deleteFile(fileName) {
    try {
      const fileRef = this.bucket.file(fileName);
      await fileRef.delete();
      return true;
    } catch (error) {
      console.error('Delete file error:', error);
      throw new Error('Failed to delete file');
    }
  }

  // Get file metadata
  async getFileMetadata(fileName) {
    try {
      const fileRef = this.bucket.file(fileName);
      const [metadata] = await fileRef.getMetadata();
      return metadata;
    } catch (error) {
      console.error('Get file metadata error:', error);
      throw new Error('Failed to get file metadata');
    }
  }

  // Check if file exists
  async fileExists(fileName) {
    try {
      const fileRef = this.bucket.file(fileName);
      const [exists] = await fileRef.exists();
      return exists;
    } catch (error) {
      console.error('File exists check error:', error);
      return false;
    }
  }

  // Generate signed URL for private files (if needed)
  async generateSignedUrl(fileName, expirationMinutes = 60) {
    try {
      const fileRef = this.bucket.file(fileName);
      const [signedUrl] = await fileRef.getSignedUrl({
        action: 'read',
        expires: Date.now() + expirationMinutes * 60 * 1000,
      });
      return signedUrl;
    } catch (error) {
      console.error('Generate signed URL error:', error);
      throw new Error('Failed to generate signed URL');
    }
  }
}

module.exports = new CloudStorageService(); 