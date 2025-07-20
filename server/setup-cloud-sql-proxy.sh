#!/bin/bash

echo "🔧 Setting up Google Cloud SQL Proxy..."

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ Google Cloud SDK is not installed."
    echo "Please install it first: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Check if user is authenticated
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    echo "❌ You are not authenticated with Google Cloud."
    echo "Please run: gcloud auth login"
    exit 1
fi

# Get project ID
PROJECT_ID=$(gcloud config get-value project)
if [ -z "$PROJECT_ID" ]; then
    echo "❌ No project ID configured."
    echo "Please set your project: gcloud config set project YOUR_PROJECT_ID"
    exit 1
fi

echo "✅ Using project: $PROJECT_ID"

# Download Cloud SQL Proxy for macOS
echo "📥 Downloading Cloud SQL Proxy..."
curl -o cloud-sql-proxy https://storage.googleapis.com/cloud-sql-connectors/cloud-sql-proxy/v2.8.1/cloud-sql-proxy.darwin.amd64

if [ $? -ne 0 ]; then
    echo "❌ Failed to download Cloud SQL Proxy"
    exit 1
fi

# Make it executable
chmod +x cloud-sql-proxy

# List available instances
echo "🔍 Available Cloud SQL instances:"
gcloud sql instances list --format="table(name,region,settings.ipConfiguration.authorizedNetworks[0].value,state)"

# Get instance details
echo ""
echo "Please enter your Cloud SQL instance name:"
read INSTANCE_NAME

if [ -z "$INSTANCE_NAME" ]; then
    echo "❌ Instance name is required"
    exit 1
fi

# Get instance region
REGION=$(gcloud sql instances describe $INSTANCE_NAME --format="value(region)" 2>/dev/null)

if [ -z "$REGION" ]; then
    echo "❌ Could not find instance: $INSTANCE_NAME"
    echo "Available instances:"
    gcloud sql instances list --format="table(name,region)"
    exit 1
fi

echo "✅ Found instance: $INSTANCE_NAME in region: $REGION"

# Create connection string
CONNECTION_NAME="$PROJECT_ID:$REGION:$INSTANCE_NAME"

echo "🔗 Connection string: $CONNECTION_NAME"

# Start the proxy
echo "🚀 Starting Cloud SQL Proxy..."
echo "This will run in the background. Press Ctrl+C to stop."
echo ""
echo "Once the proxy is running, you can test the connection with:"
echo "node test-db.js"
echo ""

./cloud-sql-proxy --instances=$CONNECTION_NAME=tcp:5432 