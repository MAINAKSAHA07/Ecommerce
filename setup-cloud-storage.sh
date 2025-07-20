#!/bin/bash

echo "🚀 Setting up Google Cloud Storage for E-commerce Platform"
echo "=================================================="

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ Google Cloud SDK is not installed."
    echo "Please install it from: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Check if user is authenticated
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    echo "❌ You are not authenticated with Google Cloud."
    echo "Please run: gcloud auth login"
    exit 1
fi

# Get project ID
echo "📋 Available projects:"
gcloud projects list --format="table(projectId,name)"

echo ""
read -p "Enter your Google Cloud Project ID: " PROJECT_ID

if [ -z "$PROJECT_ID" ]; then
    echo "❌ Project ID is required"
    exit 1
fi

# Set the project
gcloud config set project $PROJECT_ID

# Enable required APIs
echo "🔧 Enabling required APIs..."
gcloud services enable storage.googleapis.com
gcloud services enable storage-component.googleapis.com

# Create storage bucket
BUCKET_NAME="ecommerce-platform-bucket-$(date +%s)"
echo "🪣 Creating storage bucket: $BUCKET_NAME"

gsutil mb -p $PROJECT_ID -c STANDARD -l US-CENTRAL1 gs://$BUCKET_NAME

# Set bucket permissions for public read
echo "🔓 Setting bucket permissions for public read access..."
gsutil iam ch allUsers:objectViewer gs://$BUCKET_NAME

# Create service account
SERVICE_ACCOUNT_NAME="ecommerce-storage-sa"
echo "👤 Creating service account: $SERVICE_ACCOUNT_NAME"

gcloud iam service-accounts create $SERVICE_ACCOUNT_NAME \
    --display-name="E-commerce Storage Service Account" \
    --description="Service account for e-commerce platform file uploads"

# Grant storage permissions
echo "🔑 Granting storage permissions..."
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$SERVICE_ACCOUNT_NAME@$PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/storage.admin"

# Create and download key
echo "📄 Creating service account key..."
gcloud iam service-accounts keys create server/gcp-key.json \
    --iam-account=$SERVICE_ACCOUNT_NAME@$PROJECT_ID.iam.gserviceaccount.com

# Create environment file
echo "📝 Creating environment configuration..."
cat > server/.env << EOF
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
GOOGLE_CLOUD_PROJECT_ID=$PROJECT_ID
GOOGLE_CLOUD_KEY_FILE=./gcp-key.json
GOOGLE_CLOUD_STORAGE_BUCKET=$BUCKET_NAME

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
EOF

echo ""
echo "✅ Google Cloud Storage setup completed!"
echo ""
echo "📋 Configuration Summary:"
echo "   Project ID: $PROJECT_ID"
echo "   Bucket Name: $BUCKET_NAME"
echo "   Service Account: $SERVICE_ACCOUNT_NAME@$PROJECT_ID.iam.gserviceaccount.com"
echo "   Key File: server/gcp-key.json"
echo "   Environment File: server/.env"
echo ""
echo "🔧 Next Steps:"
echo "   1. Update your Razorpay credentials in server/.env"
echo "   2. Update your email configuration in server/.env"
echo "   3. Start the server: cd server && npm run dev"
echo "   4. Test file uploads in the frontend"
echo ""
echo "⚠️  Security Notes:"
echo "   - Keep your gcp-key.json file secure and never commit it to version control"
echo "   - Consider using environment variables for production"
echo "   - Regularly rotate your service account keys" 