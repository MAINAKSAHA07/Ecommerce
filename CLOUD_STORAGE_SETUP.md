# 🚀 Google Cloud Storage Setup Guide

This guide will help you set up Google Cloud Storage for the e-commerce platform to handle file uploads, images, and documents.

## 📋 Prerequisites

1. **Google Cloud Account**: You need a Google Cloud account with billing enabled
2. **Google Cloud SDK**: Install the Google Cloud CLI
3. **Node.js & npm**: For running the application

## 🔧 Quick Setup

### 1. Install Google Cloud SDK

**macOS (using Homebrew):**
```bash
brew install google-cloud-sdk
```

**Windows:**
Download from: https://cloud.google.com/sdk/docs/install

**Linux:**
```bash
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
```

### 2. Authenticate with Google Cloud

```bash
gcloud auth login
gcloud auth application-default login
```

### 3. Run the Setup Script

```bash
# Make the script executable
chmod +x setup-cloud-storage.sh

# Run the setup script
./setup-cloud-storage.sh
```

The script will:
- ✅ Enable required Google Cloud APIs
- ✅ Create a storage bucket
- ✅ Create a service account with proper permissions
- ✅ Generate and download the service account key
- ✅ Create the environment configuration file

## 🛠️ Manual Setup (Alternative)

If you prefer to set up manually or the script doesn't work:

### 1. Create a Google Cloud Project

```bash
# List existing projects
gcloud projects list

# Create a new project (optional)
gcloud projects create YOUR_PROJECT_ID --name="E-commerce Platform"

# Set the project
gcloud config set project YOUR_PROJECT_ID
```

### 2. Enable Required APIs

```bash
gcloud services enable storage.googleapis.com
gcloud services enable storage-component.googleapis.com
```

### 3. Create Storage Bucket

```bash
# Create bucket with unique name
gsutil mb -p YOUR_PROJECT_ID -c STANDARD -l US-CENTRAL1 gs://ecommerce-platform-bucket-YOUR_UNIQUE_ID

# Set public read permissions
gsutil iam ch allUsers:objectViewer gs://ecommerce-platform-bucket-YOUR_UNIQUE_ID
```

### 4. Create Service Account

```bash
# Create service account
gcloud iam service-accounts create ecommerce-storage-sa \
    --display-name="E-commerce Storage Service Account" \
    --description="Service account for e-commerce platform file uploads"

# Grant storage permissions
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
    --member="serviceAccount:ecommerce-storage-sa@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/storage.admin"

# Create and download key
gcloud iam service-accounts keys create server/gcp-key.json \
    --iam-account=ecommerce-storage-sa@YOUR_PROJECT_ID.iam.gserviceaccount.com
```

### 5. Create Environment File

Create `server/.env` with the following content:

```env
# Server Configuration
PORT=5001
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ecommerce_db
DB_USER=postgres
DB_PASSWORD=password
DATABASE_URL=postgresql://postgres:password@localhost:5432/ecommerce_db

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Google Cloud Configuration
GOOGLE_CLOUD_PROJECT_ID=YOUR_PROJECT_ID
GOOGLE_CLOUD_KEY_FILE=./gcp-key.json
GOOGLE_CLOUD_STORAGE_BUCKET=ecommerce-platform-bucket-YOUR_UNIQUE_ID

# Razorpay Configuration
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-secret-key

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=noreply@ecommerce.com

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# File Upload Limits
MAX_FILE_SIZE=10485760
MAX_FILES=10
```

## 🧪 Testing the Setup

### 1. Start the Backend Server

```bash
cd server
npm install
npm run dev
```

### 2. Start the Frontend

```bash
cd client
npm install
npm start
```

### 3. Test File Uploads

Visit: `http://localhost:3000/test/upload`

This page allows you to test:
- ✅ Single image upload
- ✅ Multiple images upload
- ✅ Document upload
- ✅ Product images upload (requires authentication)
- ✅ File validation
- ✅ Error handling

## 📁 File Structure

```
server/
├── src/
│   ├── services/
│   │   └── cloudStorage.js          # Cloud storage service
│   ├── controllers/
│   │   └── uploadController.js      # Upload endpoints
│   ├── middlewares/
│   │   └── upload.js                # Upload middleware
│   ├── config/
│   │   └── cloudStorage.js          # Configuration
│   └── routes/
│       └── upload.js                # Upload routes
├── gcp-key.json                     # Service account key
└── .env                             # Environment variables

client/
├── src/
│   ├── services/
│   │   └── uploadService.ts         # Frontend upload service
│   ├── components/
│   │   └── common/
│   │       └── FileUpload.tsx       # Reusable upload component
│   └── pages/
│       └── test/
│           └── TestUpload.tsx       # Test upload page
```

## 🔌 Available API Endpoints

### Public Endpoints
- `POST /api/upload/image` - Upload single image
- `POST /api/upload/images` - Upload multiple images
- `POST /api/upload/document` - Upload document

### Protected Endpoints (Require Authentication)
- `POST /api/upload/product-images` - Upload product images
- `POST /api/upload/avatar` - Upload user avatar
- `DELETE /api/upload/file/:fileName` - Delete file
- `GET /api/upload/file/:fileName/metadata` - Get file metadata

## 📊 File Types & Limits

### Supported Image Types
- JPEG (.jpg, .jpeg)
- PNG (.png)
- WebP (.webp)
- GIF (.gif)

### Supported Document Types
- PDF (.pdf)
- DOC (.doc)
- DOCX (.docx)

### File Limits
- **Max file size**: 10MB
- **Max files per upload**: 10
- **Total storage**: Unlimited (based on your GCP quota)

## 🔒 Security Features

- ✅ File type validation
- ✅ File size limits
- ✅ Unique file naming (UUID)
- ✅ Public read access for images
- ✅ Protected endpoints for sensitive uploads
- ✅ Service account with minimal permissions

## 🚀 Production Deployment

### 1. Environment Variables

For production, use environment variables instead of the key file:

```env
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_CLOUD_STORAGE_BUCKET=your-bucket-name
GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account-key.json
```

### 2. CORS Configuration

Update CORS origin for production:

```env
CORS_ORIGIN=https://yourdomain.com
```

### 3. Security Best Practices

- 🔐 Use environment variables for sensitive data
- 🔑 Regularly rotate service account keys
- 🛡️ Implement proper authentication for all uploads
- 📝 Monitor storage usage and costs
- 🔍 Set up Cloud Storage audit logs

## 🐛 Troubleshooting

### Common Issues

1. **"Permission denied" error**
   - Check if service account has proper permissions
   - Verify the key file path in .env

2. **"Bucket not found" error**
   - Verify bucket name in .env
   - Check if bucket exists in Google Cloud Console

3. **"Invalid project ID" error**
   - Verify project ID in .env
   - Check if project exists and is accessible

4. **CORS errors**
   - Verify CORS_ORIGIN in .env matches your frontend URL
   - Check if bucket has proper CORS configuration

### Debug Commands

```bash
# Test Google Cloud authentication
gcloud auth list

# Test bucket access
gsutil ls gs://your-bucket-name

# Test service account
gcloud auth activate-service-account --key-file=server/gcp-key.json

# Check project configuration
gcloud config list
```

## 📞 Support

If you encounter issues:

1. Check the Google Cloud Console for errors
2. Review the server logs for detailed error messages
3. Verify all environment variables are set correctly
4. Ensure the service account has proper permissions

## 🎉 Success!

Once setup is complete, you'll have:
- ✅ Scalable cloud storage for all file uploads
- ✅ Automatic file organization by type
- ✅ Public URLs for easy access
- ✅ Secure authentication for protected uploads
- ✅ Comprehensive error handling
- ✅ File validation and size limits

Your e-commerce platform is now ready to handle unlimited file uploads with Google Cloud Storage! 🚀 