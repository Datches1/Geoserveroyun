import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import connectDB from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import celebrityRoutes from './routes/celebrityRoutes.js';
import gameRoutes from './routes/gameRoutes.js';
import userRoutes from './routes/userRoutes.js';
import premiumRoutes from './routes/premiumRoutes.js';
import { errorHandler } from './middleware/errorMiddleware.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Security Middleware
app.use(helmet());

// Rate Limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW) * 60 * 1000 || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// CORS Configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/celebrities', celebrityRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/users', userRoutes);
app.use('/api/premium', premiumRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'FAMOUSGUESSR API is running',
    timestamp: new Date().toISOString(),
  });
});

// Error Handler Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
