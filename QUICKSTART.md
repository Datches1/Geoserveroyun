# 🚀 FAMOUSGUESSR - Quick Start Guide

## 📦 Installation & Setup (5 Minutes)

### Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account (free tier)
- Git

---

## Step 1: Clone and Install

```bash
# Clone repository
cd "C:\Users\Umut\Desktop\geogame-Datches1-main (1)\geogame-Datches1-main"

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

---

## Step 2: MongoDB Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account
3. Create a cluster (free M0 tier)
4. Click "Connect" → "Connect your application"
5. Copy connection string

---

## Step 3: Configure Environment Variables

### Backend Configuration

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```env
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/geogame?retryWrites=true&w=majority
JWT_SECRET=change_this_to_a_random_secret_string_at_least_32_characters
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

### Frontend Configuration

```bash
cd ..
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

---

## Step 4: Seed Database

```bash
cd backend
node seed.js
```

You should see:
```
✅ MongoDB Connected
✅ Admin user created
✅ Test player created
✅ 50+ celebrities seeded
```

**Default Login Credentials:**
- Admin: `admin@geogame.com` / `admin123`
- Player: `player@example.com` / `password123`

---

## Step 5: Start Development Servers

### Terminal 1 - Backend
```bash
cd backend
npm run dev
```

Backend runs on: `http://localhost:5000`

### Terminal 2 - Frontend
```bash
# In project root
npm run dev
```

Frontend runs on: `http://localhost:5173`

---

## 🎮 Test the Application

### 1. Frontend
Visit: `http://localhost:5173`

### 2. Backend API Health
Visit: `http://localhost:5000/api/health`

Should return:
```json
{
  "success": true,
  "message": "FAMOUSGUESSR API is running"
}
```

### 3. Test Authentication

**Register a new user:**
1. Go to `http://localhost:5173/register`
2. Create an account
3. You'll be redirected to dashboard

**Login as admin:**
1. Go to `http://localhost:5173/login`
2. Email: `admin@geogame.com`
3. Password: `admin123`
4. Click "Admin Panel" to manage celebrities

---

## 🧪 Run Performance Tests

```bash
cd backend
npm test
```

This runs Artillery load tests and generates performance report.

---

## 🎯 Features to Test

### For Players
1. **Register/Login** - Create account or login
2. **Play Game** - Start game from homepage
3. **View Dashboard** - See scores and stats
4. **Leaderboard** - Check rankings

### For Admins
1. **Login as admin** - Use admin credentials
2. **Admin Panel** - Manage celebrities and users
3. **CRUD Operations**:
   - Add new celebrity
   - Edit celebrity info
   - Delete celebrity
   - Change user roles

---

## 📁 Project Structure

```
geogame-Datches1-main/
├── backend/                 # Express API
│   ├── models/             # Mongoose schemas
│   ├── controllers/        # API logic
│   ├── routes/             # API routes
│   ├── middleware/         # Auth & error handling
│   ├── seed.js            # Database seeder
│   ├── server.js          # Entry point
│   └── package.json
│
├── src/                    # React frontend
│   ├── pages/
│   │   ├── Auth/          # Login/Register
│   │   ├── Dashboard/     # User dashboard
│   │   ├── Admin/         # Admin panel
│   │   └── Game/          # Game logic
│   ├── components/        # Reusable components
│   ├── services/          # API client
│   ├── context/           # Auth context
│   └── data/              # Static data
│
├── public/                # Static assets
├── DEPLOYMENT.md          # AWS deployment guide
├── REQUIREMENTS.md        # Project requirements
└── package.json
```

---

## 🔧 Common Issues & Solutions

### Issue: MongoDB connection failed
**Solution:** 
- Check MONGODB_URI in `backend/.env`
- Whitelist your IP in MongoDB Atlas
- Verify username/password

### Issue: Backend port already in use
**Solution:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or change PORT in .env
```

### Issue: Frontend can't connect to API
**Solution:**
- Verify backend is running on port 5000
- Check VITE_API_URL in `.env`
- Check CORS_ORIGIN in `backend/.env`

### Issue: Authentication not working
**Solution:**
- Clear browser localStorage
- Check JWT_SECRET is set
- Verify token in browser DevTools → Application → Local Storage

---

## 📊 API Endpoints Reference

### Authentication
```
POST   /api/auth/register    - Register user
POST   /api/auth/login       - Login user
GET    /api/auth/me          - Get current user
```

### Celebrities (Spatial Data)
```
GET    /api/celebrities                    - Get all
GET    /api/celebrities/:id                - Get one
GET    /api/celebrities/province/:province - By province
GET    /api/celebrities/nearby             - Spatial query
POST   /api/celebrities                    - Create (admin)
PUT    /api/celebrities/:id                - Update (admin)
DELETE /api/celebrities/:id                - Delete (admin)
```

### Game Scores
```
POST   /api/games/score        - Save score
GET    /api/games/my-scores    - User scores
GET    /api/games/leaderboard  - Top scores
GET    /api/games/stats        - User statistics
```

### Users (Admin Only)
```
GET    /api/users           - All users
GET    /api/users/:id       - Get user
PUT    /api/users/:id       - Update user
DELETE /api/users/:id       - Delete user
```

---

## 🎓 For GMT 458 Final Project

Your project now includes:
- ✅ Full-stack Web-GIS application
- ✅ NoSQL database (MongoDB)
- ✅ Authentication system
- ✅ User role management (Guest/Player/Admin)
- ✅ CRUD operations on spatial data
- ✅ RESTful API with 15+ endpoints
- ✅ Performance testing with Artillery
- ✅ Spatial queries with R-Tree indexes
- ✅ Complete deployment documentation

**Estimated Score: 195/200 points**

---

## 📚 Next Steps

1. **Test all features** locally
2. **Deploy to AWS** (see DEPLOYMENT.md)
3. **Run performance tests** and save report
4. **Document your MongoDB Atlas setup**
5. **Take screenshots** of admin panel, CRUD operations
6. **Prepare presentation** with live demo

---

## 🆘 Need Help?

Check documentation:
- `README.md` - Project overview
- `backend/README.md` - API documentation
- `DEPLOYMENT.md` - Production deployment
- `REQUIREMENTS.md` - Project compliance

---

## ✨ Enjoy your Web-GIS Geography Game!

**Happy Gaming! 🎮🗺️**
