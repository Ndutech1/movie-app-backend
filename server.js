import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser'; // ✅ corrected spelling and syntax

import authRoutes from './routes/authRoutes.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middleware
app.use(cors({
  origin: 'https://movie-app-frontend-rye9.vercel.app', // 🚫 no trailing slash
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// ✅ Routes
app.use('/api/auth', authRoutes);

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
  });
