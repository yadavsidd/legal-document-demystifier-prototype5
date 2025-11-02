// import express from 'express';
// import mongoose from 'mongoose';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import authRoutes from './routes/auth.js';

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Check for required environment variables
// if (!process.env.JWT_SECRET) {
//   console.warn('⚠️  WARNING: JWT_SECRET is not set in .env file');
//   console.warn('⚠️  Authentication will not work without JWT_SECRET');
// }

// // Middleware
// app.use(cors({
//   origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:5174'], // Vite default port + common alternatives
//   credentials: true
// }));
// app.use(express.json());

// // Request logging middleware (for debugging)
// app.use((req, res, next) => {
//   console.log(`${req.method} ${req.path}`);
//   next();
// });

// // Connect to MongoDB
// const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/demystify';

// mongoose.connect(MONGODB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
//   .then(() => {
//     console.log('✅ Connected to MongoDB');
//     console.log(`📦 Database: ${MONGODB_URI.split('/').pop().split('?')[0]}`);
//   })
//   .catch((error) => {
//     console.error('❌ MongoDB connection error:', error.message);
//     console.log('📝 Make sure MongoDB is running or update MONGODB_URI in .env file');
//     console.log('💡 For local MongoDB: mongodb://localhost:27017/demystify');
//     console.log('💡 For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/demystify');
//   });

// // Routes
// app.use('/api/auth', authRoutes);

// // Health check
// app.get('/api/health', (req, res) => {
//   res.json({ status: 'OK', message: 'Server is running' });
// });

// app.listen(PORT, () => {
//   console.log(`🚀 Server is running on http://localhost:${PORT}`);
// });

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();

// --- Environment variables ---
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// --- Safety checks ---
if (!MONGODB_URI) {
  console.error("❌ Missing MONGODB_URI in environment variables.");
  process.exit(1);
}

if (!JWT_SECRET) {
  console.warn("⚠ WARNING: JWT_SECRET is not set. Authentication may fail.");
}

// --- Middleware ---
app.use(
  cors({
    origin: [FRONTEND_URL],
    credentials: true,
  })
);
app.use(express.json());

// --- Request logger ---
app.use((req, res, next) => {
  console.log([${req.method}] ${req.path});
  next();
});

// --- MongoDB connection ---
mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((error) => {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  });

// --- Routes ---
app.use("/api/auth", authRoutes);

// --- Health check ---
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

// --- Start server ---
app.listen(PORT, "0.0.0.0", () => {
  console.log(🚀 Server running on port ${PORT});
});