#!/bin/bash

echo "🔧 Setting up local PostgreSQL database for development..."

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed."
    echo "Installing PostgreSQL..."
    
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        if ! command -v brew &> /dev/null; then
            echo "❌ Homebrew is not installed. Please install it first:"
            echo "https://brew.sh"
            exit 1
        fi
        
        brew install postgresql@15
        brew services start postgresql@15
        
        # Add to PATH
        echo 'export PATH="/opt/homebrew/opt/postgresql@15/bin:$PATH"' >> ~/.zshrc
        export PATH="/opt/homebrew/opt/postgresql@15/bin:$PATH"
        
    else
        echo "❌ Please install PostgreSQL manually for your OS"
        exit 1
    fi
fi

echo "✅ PostgreSQL is installed"

# Start PostgreSQL service
if [[ "$OSTYPE" == "darwin"* ]]; then
    brew services start postgresql@15
    sleep 3
fi

# Create database and user
echo "🗄️ Creating database and user..."

# Create user if it doesn't exist
psql postgres -c "SELECT 1 FROM pg_roles WHERE rolname='ecommerce_user'" | grep -q 1 || psql postgres -c "CREATE USER ecommerce_user WITH PASSWORD '8779700241';"

# Create database if it doesn't exist
psql postgres -c "SELECT 1 FROM pg_database WHERE datname='ecommerce_db'" | grep -q 1 || psql postgres -c "CREATE DATABASE ecommerce_db OWNER ecommerce_user;"

# Grant privileges
psql postgres -c "GRANT ALL PRIVILEGES ON DATABASE ecommerce_db TO ecommerce_user;"
psql postgres -c "ALTER USER ecommerce_user CREATEDB;"

echo "✅ Database and user created successfully"

# Update .env file
echo "📝 Updating .env file for local database..."

cat > .env << EOF
# Database Configuration - Local Development
DATABASE_URL=postgresql://ecommerce_user:8779700241@localhost:5432/ecommerce_db
DB_HOST=localhost
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

echo "✅ .env file updated for local database"

# Test connection
echo "🧪 Testing database connection..."
node test-db.js

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Local database setup complete!"
    echo ""
    echo "Next steps:"
    echo "1. Run migrations: npm run migrate"
    echo "2. Seed data: npm run seed"
    echo "3. Start server: npm run dev"
else
    echo "❌ Database connection test failed"
    exit 1
fi 