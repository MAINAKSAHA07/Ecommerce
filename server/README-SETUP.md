# 🚀 Database Setup Guide

## ❌ Current Issue
You're getting a connection timeout to Google Cloud SQL (34.63.40.75:5432). This is common because:
- Google Cloud SQL instances are often configured for private access only
- Your IP might not be whitelisted
- The instance might not allow external connections

## 🔧 Solution Options

### Option 1: Local Database (Recommended for Development) ⭐

**Fastest and easiest solution for development:**

```bash
cd server
chmod +x setup-local-db.sh
./setup-local-db.sh
```

This will:
- Install PostgreSQL locally (if needed)
- Create the database and user
- Update your .env file
- Test the connection

### Option 2: Google Cloud SQL Proxy

**For production-like environment:**

```bash
cd server
chmod +x setup-cloud-sql-proxy.sh
./setup-cloud-sql-proxy.sh
```

**Prerequisites:**
- Google Cloud SDK installed: `brew install google-cloud-sdk`
- Authenticated: `gcloud auth login`
- Project set: `gcloud config set project YOUR_PROJECT_ID`

### Option 3: Manual Google Cloud Setup

**If you want to use the remote database directly:**

1. **Go to Google Cloud Console**
2. **Navigate to SQL → Your instance**
3. **Click "Edit"**
4. **Under "Connections" → "Public IP"**
5. **Add your IP to authorized networks**
6. **Get your public IP:**
   ```bash
   curl https://api.ipify.org
   ```

## 🎯 Quick Start (Recommended)

```bash
# Option 1: Local database (easiest)
cd server
chmod +x setup-local-db.sh
./setup-local-db.sh

# After successful setup:
npm run migrate
npm run seed
npm run dev
```

## 🔍 Test Your Connection

After setup, test the connection:

```bash
cd server
node test-db.js
```

You should see:
```
✅ Database connection successful!
```

## 🚀 Start the Application

```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm start
```

## 📝 Environment Files

**server/.env** (will be created automatically):
```env
# Database Configuration
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
```

**client/.env** (create manually):
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENVIRONMENT=development
```

## 🎉 Expected Result

After successful setup:
- ✅ Database connection working
- ✅ Tables created with migrations
- ✅ Demo data seeded
- ✅ Backend API running on port 5000
- ✅ Frontend connecting to real APIs
- ✅ No more mock data - everything is dynamic!

## 🆘 Troubleshooting

**If you get "command not found: psql":**
```bash
brew install postgresql@15
export PATH="/opt/homebrew/opt/postgresql@15/bin:$PATH"
```

**If you get permission errors:**
```bash
sudo chown -R $(whoami) /opt/homebrew/var/postgresql
```

**If the setup script fails:**
```bash
# Manual database creation
createdb ecommerce_db
createuser ecommerce_user
psql -d ecommerce_db -c "ALTER USER ecommerce_user WITH PASSWORD '8779700241';"
psql -d ecommerce_db -c "GRANT ALL PRIVILEGES ON DATABASE ecommerce_db TO ecommerce_user;"
``` 