import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';

// ✅ Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Debug log to check MONGO_URI
console.log("🔍 MONGO_URI:", process.env.MONGO_URI);

// ✅ CORS for local dev and deployed frontend
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://movie-app-frontend-rye9-92vyr2v5x-ndutech1s-projects.vercel.app"
  ],
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// ✅ API routes
app.use('/api/auth', authRoutes);

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
  });
