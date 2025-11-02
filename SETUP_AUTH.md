# Authentication Setup Guide

This guide will help you set up the authentication system for the Demystify application.

## Prerequisites

1. **Node.js** (v16 or higher)
2. **MongoDB** (either local installation or MongoDB Atlas account)

## Backend Setup

1. **Navigate to server directory:**
   ```bash
   cd legal-document-demystifier-prototype5/server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   
   Create a `.env` file in the `server` directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/demystify
   JWT_SECRET=your-secret-key-change-this-in-production-use-a-long-random-string
   PORT=5000
   ```

   **For MongoDB Atlas:**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/demystify
   JWT_SECRET=your-secret-key-change-this-in-production-use-a-long-random-string
   PORT=5000
   ```

4. **Start MongoDB (if using local installation):**
   - **Windows:** Start MongoDB service from Services or run `mongod`
   - **Mac/Linux:** `brew services start mongodb-community` or `sudo systemctl start mongod`

5. **Start the backend server:**
   ```bash
   npm run dev
   ```
   
   You should see:
   ```
   ✅ Connected to MongoDB
   🚀 Server is running on http://localhost:5000
   ```

## Frontend Setup

1. **Install frontend dependencies (if not already done):**
   ```bash
   cd legal-document-demystifier-prototype5
   npm install
   ```

2. **Start the frontend development server:**
   ```bash
   npm run dev
   ```

## Features Implemented

✅ **Login & Signup Pages**
- Beautiful gradient background matching the website design
- Form validation
- Error handling

✅ **Signup Requirements**
- Terms and conditions checkbox (mandatory)
- User cannot sign up without accepting terms
- Validates all required fields

✅ **Page Interlinking**
- Signup page: "Already have an account? Sign in" link
- Login page: "Don't have an account? Sign up" link

✅ **Navigation Updates**
- "Get Started" button in navbar links to signup page
- "Get Started for Free" button on landing page links to signup page

✅ **Route Protection**
- Protected routes: Demystifier, Translator, Drafter, Guide, History
- Unauthenticated users are redirected to login page when accessing protected routes
- Authentication state persists across page refreshes

✅ **Authentication Flow**
- JWT-based authentication
- 7-day token expiration
- Automatic token verification on app load
- Secure password hashing with bcrypt

## Testing the Authentication

1. **Sign Up:**
   - Click "Get Started" in navbar or landing page
   - Fill in name, email, and password
   - **Must check** "I accept the Terms and Conditions"
   - Click "Sign Up"

2. **Login:**
   - Use "Sign in" link from signup page
   - Enter email and password
   - Click "Sign In"

3. **Access Protected Routes:**
   - Try accessing Demystifier, Translator, etc. without logging in
   - You should be redirected to login page
   - After login, you can access all features

## Troubleshooting

**Backend won't start:**
- Ensure MongoDB is running (check with `mongosh` or MongoDB Compass)
- Check if PORT 5000 is available
- Verify `.env` file exists and has correct values

**Frontend can't connect to backend:**
- Ensure backend server is running on `http://localhost:5000`
- Check browser console for CORS errors
- Verify API_BASE_URL in `services/authService.ts` matches your backend port

**Authentication not persisting:**
- Check browser localStorage for `authToken`
- Clear localStorage and try logging in again
- Verify JWT_SECRET in backend `.env` file

**MongoDB connection issues:**
- Verify MongoDB is installed and running
- Check MONGODB_URI in `.env` file
- For Atlas, ensure IP whitelist includes your IP address

## API Endpoints

- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify` - Verify token (requires Authorization header)

## Security Notes

- Always use a strong, random JWT_SECRET in production
- Use environment variables for sensitive data
- Never commit `.env` files to version control
- Use HTTPS in production
- Consider rate limiting for production deployment

