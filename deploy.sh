#!/bin/bash

# Google Cloud Deployment Script for E-commerce Platform

set -e

# Configuration
PROJECT_ID="ecommerce-466322"
REGION="us-central1"
DB_INSTANCE_NAME="ecommerce-db"
DB_NAME="ecommerce_db"
DB_USER="ecommerce_user"
DB_PASSWORD="8779700241"

echo "🚀 Starting Google Cloud deployment..."

# 1. Enable required APIs
echo "📋 Enabling required APIs..."
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable sqladmin.googleapis.com
gcloud services enable storage.googleapis.com
gcloud services enable containerregistry.googleapis.com

# 2. Set project
gcloud config set project $PROJECT_ID

# 3. Get database connection info
echo "📡 Getting database connection info..."
DB_IP=$(gcloud sql instances describe $DB_INSTANCE_NAME --format="value(ipAddresses[0].ipAddress)")
echo "Database IP: $DB_IP"

# 4. Create Cloud Storage bucket
echo "🪣 Creating Cloud Storage bucket..."
gsutil mb -l $REGION gs://$PROJECT_ID-ecommerce-media || echo "Bucket already exists"

# 5. Update cloudbuild.yaml with correct values
echo "🔧 Updating Cloud Build configuration..."
sed -i '' "s/_DB_HOST: '.*'/_DB_HOST: '$DB_IP'/g" cloudbuild.yaml
sed -i '' "s/_DB_PASSWORD: '.*'/_DB_PASSWORD: '$DB_PASSWORD'/g" cloudbuild.yaml
sed -i '' "s/_GCP_PROJECT_ID: '.*'/_GCP_PROJECT_ID: '$PROJECT_ID'/g" cloudbuild.yaml
sed -i '' "s/_GCP_BUCKET_NAME: '.*'/_GCP_BUCKET_NAME: '$PROJECT_ID-ecommerce-media'/g" cloudbuild.yaml

# 6. Deploy using Cloud Build
echo "🔨 Deploying with Cloud Build..."
gcloud builds submit --config cloudbuild.yaml .

# 7. Get service URLs
echo "🌐 Getting service URLs..."
API_URL=$(gcloud run services describe ecommerce-api --region=$REGION --format="value(status.url)" 2>/dev/null || echo "API service not found")
CLIENT_URL=$(gcloud run services describe ecommerce-client --region=$REGION --format="value(status.url)" 2>/dev/null || echo "Client service not found")

echo "✅ Deployment completed!"
echo "🌐 API URL: $API_URL"
echo "🎨 Client URL: $CLIENT_URL"
echo "🗄️ Database: $DB_IP"
echo ""
echo "📋 Next steps:"
echo "1. Test the API: curl $API_URL/health"
echo "2. Test the client: curl $CLIENT_URL"
echo "3. Update _API_URL in cloudbuild.yaml with: $API_URL"