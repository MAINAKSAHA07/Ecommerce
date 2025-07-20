#!/bin/bash

echo "🔧 Fixing Google Cloud SQL Connection..."

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ Google Cloud SDK is not installed."
    echo "Installing Google Cloud SDK..."
    brew install google-cloud-sdk
    echo "✅ Google Cloud SDK installed"
    echo "Please run: gcloud auth login"
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
    echo "Please set your project: gcloud config set project ecommerce-466322"
    exit 1
fi

echo "✅ Using project: $PROJECT_ID"

# Get current public IP
echo "🌐 Getting your public IP address..."
CURRENT_IP=$(curl -s https://api.ipify.org)

if [ -z "$CURRENT_IP" ]; then
    echo "❌ Could not determine your public IP"
    exit 1
fi

echo "✅ Your public IP: $CURRENT_IP"

# Instance details
INSTANCE_NAME="ecommerce-db"
REGION="us-central1"

echo "🔍 Checking current authorized networks..."

# Get current authorized networks
CURRENT_NETWORKS=$(gcloud sql instances describe $INSTANCE_NAME --format="value(settings.ipConfiguration.authorizedNetworks[].value)" 2>/dev/null)

if echo "$CURRENT_NETWORKS" | grep -q "$CURRENT_IP"; then
    echo "✅ Your IP ($CURRENT_IP) is already authorized!"
else
    echo "❌ Your IP ($CURRENT_IP) is not authorized"
    echo "Adding your IP to authorized networks..."
    
    # Add IP to authorized networks
    gcloud sql instances patch $INSTANCE_NAME \
        --authorized-networks="$CURRENT_IP" \
        --quiet
    
    if [ $? -eq 0 ]; then
        echo "✅ Successfully added $CURRENT_IP to authorized networks"
        echo "⏳ Waiting for changes to take effect..."
        sleep 10
    else
        echo "❌ Failed to add IP to authorized networks"
        exit 1
    fi
fi

# Update .env file for Google Cloud
echo "📝 Updating .env file for Google Cloud SQL..."

cat > .env << EOF
# Database Configuration - Google Cloud SQL
DATABASE_URL=postgresql://ecommerce_user:8779700241@34.63.40.75:5432/ecommerce_db
DB_HOST=34.63.40.75
DB_PORT=5432
DB_NAME=ecommerce_db
DB_USER=ecommerce_user
DB_PASSWORD=8779700241

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
EOF

echo "✅ .env file updated for Google Cloud SQL"

# Test connection
echo "🧪 Testing database connection..."
node test-db.js

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Google Cloud SQL connection fixed!"
    echo ""
    echo "Next steps:"
    echo "1. Run migrations: npm run migrate"
    echo "2. Seed data: npm run seed"
    echo "3. Start server: npm run dev"
else
    echo "❌ Database connection test failed"
    echo ""
    echo "💡 Additional troubleshooting:"
    echo "1. Check if the instance is running: gcloud sql instances describe ecommerce-db"
    echo "2. Verify the database exists: gcloud sql databases list --instance=ecommerce-db"
    echo "3. Check if the user exists: gcloud sql users list --instance=ecommerce-db"
    exit 1
fi 