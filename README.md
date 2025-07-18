# 🛒 E-commerce Platform

A full-stack e-commerce platform built with React, Node.js, PostgreSQL, and Docker. Features include customer-facing storefront, seller panel, admin dashboard, payment processing, and cloud storage integration.

## 🚀 Features

### Customer Features
- **Product Browsing**: Search, filter, and sort products
- **Shopping Cart**: Add/remove items, quantity management
- **User Authentication**: JWT-based login/register
- **Order Management**: Track orders, view history
- **Wishlist**: Save favorite products
- **Reviews & Ratings**: Rate and review products
- **Payment Processing**: Razorpay integration

### Seller Features
- **Product Management**: Add, edit, delete products
- **Inventory Management**: Stock tracking
- **Order Management**: View and process orders
- **Analytics**: Sales and performance metrics
- **Profile Management**: Store information

### Admin Features
- **User Management**: Manage customers and sellers
- **Product Moderation**: Approve/reject products
- **Order Management**: Oversee all orders
- **Category Management**: Organize products
- **Analytics Dashboard**: Platform-wide metrics

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Redux Toolkit** for state management
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Axios** for API communication
- **Formik + Yup** for form validation

### Backend
- **Node.js** with Express.js
- **PostgreSQL** with Sequelize ORM
- **JWT** for authentication
- **bcrypt** for password hashing
- **Multer** for file uploads
- **Razorpay** for payments
- **Google Cloud Storage** for media files

### DevOps
- **Docker** for containerization
- **Docker Compose** for orchestration
- **Nginx** for reverse proxy
- **Redis** for caching (optional)

## 📁 Project Structure

```
Ecommerce/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── store/         # Redux store
│   │   ├── services/      # API services
│   │   ├── types/         # TypeScript types
│   │   └── utils/         # Utility functions
│   └── public/
├── server/                 # Node.js backend
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   ├── models/        # Database models
│   │   ├── routes/        # API routes
│   │   ├── middlewares/   # Custom middlewares
│   │   ├── services/      # Business logic
│   │   ├── config/        # Configuration files
│   │   └── utils/         # Utility functions
├── docker/                 # Docker configuration
│   ├── docker-compose.yml
│   ├── Dockerfile.api
│   ├── Dockerfile.client
│   └── nginx.conf
└── shared/                 # Shared types/utilities
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Docker and Docker Compose
- PostgreSQL (if running locally)
- Redis (optional)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Ecommerce
```

### 2. Environment Setup

#### Backend Environment Variables
Create `.env` file in the `server` directory:
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ecommerce_db
DB_USER=ecommerce_user
DB_PASSWORD=ecommerce_password

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Google Cloud Storage
GCP_PROJECT_ID=your_gcp_project_id
GCP_BUCKET_NAME=your_gcp_bucket_name
GCP_KEY_FILE=path/to/gcp-key.json

# Server
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### Frontend Environment Variables
Create `.env` file in the `client` directory:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENVIRONMENT=development
```

### 3. Install Dependencies
```bash
# Install all dependencies
npm run install:all

# Or install separately
npm run server:install
npm run client:install
```

### 4. Database Setup
```bash
# Start PostgreSQL (if using Docker)
docker run --name postgres -e POSTGRES_DB=ecommerce_db -e POSTGRES_USER=ecommerce_user -e POSTGRES_PASSWORD=ecommerce_password -p 5432:5432 -d postgres:15-alpine

# Run migrations
cd server
npm run migrate

# Seed data (optional)
npm run seed
```

### 5. Start Development Servers
```bash
# Start both frontend and backend
npm run dev

# Or start separately
npm run server:dev  # Backend on port 5000
npm run client:dev  # Frontend on port 3000
```

## 🐳 Docker Deployment

### 1. Build and Run with Docker Compose
```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### 2. Production Deployment
```bash
# Build for production
docker-compose -f docker-compose.prod.yml up -d

# Scale services
docker-compose up -d --scale api=3
```

## 📊 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Product Endpoints
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (seller/admin)
- `PUT /api/products/:id` - Update product (seller/admin)
- `DELETE /api/products/:id` - Delete product (seller/admin)

### Order Endpoints
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create order
- `GET /api/orders/:id` - Get order by ID
- `PATCH /api/orders/:id/status` - Update order status

### Cart Endpoints
- `GET /api/cart` - Get user cart
- `POST /api/cart/items` - Add item to cart
- `PUT /api/cart/items/:id` - Update cart item
- `DELETE /api/cart/items/:id` - Remove item from cart

## 🔐 Role-Based Access Control

### Customer Role
- Browse products
- Manage cart and wishlist
- Place orders
- Write reviews
- Manage profile

### Seller Role
- All customer permissions
- Manage products
- View seller orders
- Access seller dashboard

### Admin Role
- All permissions
- Manage users
- Moderate products and reviews
- Access admin dashboard
- Platform analytics

## 🧪 Testing

```bash
# Run backend tests
cd server
npm test

# Run frontend tests
cd client
npm test

# Run e2e tests
npm run test:e2e
```

## 📈 Performance Optimization

### Frontend
- Code splitting with React.lazy()
- Memoization with React.memo()
- Optimized bundle size
- Image optimization
- Service worker for caching

### Backend
- Database indexing
- Query optimization
- Caching with Redis
- Rate limiting
- Compression middleware

## 🔒 Security Features

- JWT authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS configuration
- Rate limiting
- Helmet.js security headers
- SQL injection prevention

## 🚀 Deployment Options

### Vercel (Frontend)
```bash
# Deploy frontend to Vercel
npm run build
vercel --prod
```

### Render (Backend)
```bash
# Deploy backend to Render
# Connect GitHub repository
# Set environment variables
# Deploy automatically
```

### DigitalOcean (Full Stack)
```bash
# Deploy with Docker on DigitalOcean App Platform
# Or use DigitalOcean Droplets with Docker
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@ecommerce.com or create an issue in the repository.

## 🔄 Changelog

### v1.0.0 (2024-01-01)
- Initial release
- Basic e-commerce functionality
- User authentication
- Product management
- Order processing
- Payment integration

---

**Built with ❤️ using modern web technologies**
