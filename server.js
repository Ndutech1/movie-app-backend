import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import cookieparser from 'cookie-parser':

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: 'https://movie-app-frontend-rye9.vercel.app/',
  credentials: true,
}));
res.cookie('token', token, {
  httpOnly: true,
  secure: true,         // ✅ Important for production (HTTPS)
  sameSite: 'None',     // ✅ Required for cross-site cookies
  maxAge: 24 * 60 * 60 * 1000 // 1 day
});
app.use('/api/auth', authRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
  });
