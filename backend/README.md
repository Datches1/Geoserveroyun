# FAMOUSGUESSR Backend API

Backend API for the FAMOUSGUESSR geography game with full-stack Web-GIS capabilities.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account (or local MongoDB)
- Git

### Installation

1. **Install dependencies:**
```bash
cd backend
npm install
```

2. **Configure environment variables:**
```bash
cp .env.example .env
```

Edit `.env` file with your MongoDB URI and JWT secret:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/geogame
JWT_SECRET=your_super_secret_key
PORT=5000
```

3. **Seed the database:**
```bash
npm run seed
```

4. **Start the server:**
```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

Server will run on `http://localhost:5000`

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "player123",
  "email": "player@example.com",
  "password": "securepass"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "player@example.com",
  "password": "securepass"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Celebrity Endpoints (CRUD Operations)

#### Get All Celebrities
```http
GET /api/celebrities?category=Actor&limit=50
```

#### Get Celebrity by ID
```http
GET /api/celebrities/:id
```

#### Create Celebrity (Admin only)
```http
POST /api/celebrities
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Kenan İmirzalıoğlu",
  "birthProvince": "Ankara",
  "category": "Actor",
  "coordinates": [32.8597, 39.9334],
  "photo": "/images/celebrities/kenan.jpg",
  "birthYear": 1974
}
```

#### Update Celebrity (Admin only)
```http
PUT /api/celebrities/:id
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Updated Name",
  "isActive": false
}
```

#### Delete Celebrity (Admin only)
```http
DELETE /api/celebrities/:id
Authorization: Bearer <admin_token>
```

#### Spatial Queries

**Get Celebrities by Province:**
```http
GET /api/celebrities/province/Istanbul
```

**Get Nearby Celebrities (R-Tree spatial index):**
```http
GET /api/celebrities/nearby?lng=29.0086&lat=41.0225&distance=50000
```

### Game Endpoints

#### Save Game Score
```http
POST /api/games/score
Authorization: Bearer <token>
Content-Type: application/json

{
  "difficulty": "normal",
  "score": 120,
  "questionsAnswered": 15,
  "correctAnswers": 12,
  "timeSpent": 90
}
```

#### Get Leaderboard
```http
GET /api/games/leaderboard?difficulty=normal&limit=10
```

#### Get My Scores
```http
GET /api/games/my-scores?limit=20
Authorization: Bearer <token>
```

#### Get Game Statistics
```http
GET /api/games/stats
Authorization: Bearer <token>
```

### User Management (Admin only)

#### Get All Users
```http
GET /api/users
Authorization: Bearer <admin_token>
```

#### Update User Role
```http
PUT /api/users/:id
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "role": "admin"
}
```

## 🔒 User Roles

- **Guest**: Limited access (read-only)
- **Player**: Can play games, save scores
- **Admin**: Full CRUD access to celebrities and users

## 📊 Performance Testing

### Run Artillery Load Tests
```bash
npm test
```

This will:
- Test authentication endpoints
- Test CRUD operations
- Test spatial queries with R-Tree indexes
- Measure response times under load
- Generate performance report

### Performance Expectations
- **P95 Response Time**: < 500ms
- **P99 Response Time**: < 1000ms
- **Max Error Rate**: < 1%
- **Concurrent Users**: 100+

## 🗄️ Database Features

### NoSQL (MongoDB)
- Document-based storage
- Flexible schema for celebrities and users
- Aggregation pipelines for statistics

### Indexes for Performance
- **B-Tree Indexes**: 
  - User email, username
  - Celebrity name, category
  - Game scores for leaderboard
  
- **2dsphere Index (R-Tree equivalent)**:
  - Celebrity location for spatial queries
  - Enables fast nearby searches
  - Optimized for geospatial operations

### Spatial Queries
```javascript
// Find celebrities within 50km of a point
GET /api/celebrities/nearby?lng=29.0086&lat=41.0225&distance=50000
```

## 🛡️ Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control (RBAC)
- Rate limiting (100 requests per 15 minutes)
- Helmet.js security headers
- CORS configuration

## 📈 Monitoring

The API includes:
- Request logging
- Error tracking
- Performance metrics
- Database connection monitoring

## 🌐 Deployment

### MongoDB Atlas Setup
1. Create account at mongodb.com/cloud/atlas
2. Create free cluster
3. Add database user
4. Whitelist IP (0.0.0.0/0 for development)
5. Copy connection string to `.env`

### AWS Deployment (Coming Soon)
- EC2 instance setup
- PM2 process manager
- Nginx reverse proxy
- SSL certificates

## 🧪 Testing

### Manual API Testing
Use Postman or Thunder Client with the provided endpoints.

### Automated Testing
```bash
npm test  # Runs Artillery performance tests
```

## 📝 Environment Variables

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/geogame

# Authentication
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d

# Security
CORS_ORIGIN=http://localhost:5173
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📄 License

MIT License
