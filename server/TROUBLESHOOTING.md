# Error Troubleshooting Guide

## 400 Bad Request Error

**Possible Causes:**
1. Missing required fields (name, email, password)
2. Terms and conditions not accepted
3. Invalid email format
4. Password too short (less than 6 characters)

**Solution:**
- Check browser console for specific error message
- Ensure all form fields are filled correctly
- Make sure Terms and Conditions checkbox is checked (for signup)

## 500 Internal Server Error

**Possible Causes:**
1. **MongoDB not connected** - Most common!
2. **JWT_SECRET missing** in .env file
3. **Missing dependencies** - npm packages not installed
4. **Database connection error**

### Fix 1: Check MongoDB Connection

1. **Check if MongoDB is running:**
   ```powershell
   mongosh
   ```
   If this fails, MongoDB is not running.

2. **Start MongoDB:**
   - Windows: Open Services → Start "MongoDB" service
   - Or check your `.env` file MONGODB_URI

3. **Check server logs** when you start the server:
   ```
   ✅ Connected to MongoDB  ← This should appear
   ```
   If you see "❌ MongoDB connection error", MongoDB is not connected.

### Fix 2: Check .env File

1. Go to `server` folder
2. Make sure `.env` file exists
3. Check it contains:
   ```
   MONGODB_URI=mongodb://localhost:27017/demystify
   JWT_SECRET=your-secret-key-here
   PORT=5000
   ```
4. **JWT_SECRET is REQUIRED!** Without it, authentication won't work.

### Fix 3: Reinstall Dependencies

```powershell
cd server
# Delete node_modules and package-lock.json
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json

# Reinstall
npm install
```

### Fix 4: Check Server Terminal

When you run `npm run dev`, check the terminal output:

**Good output:**
```
✅ Connected to MongoDB
📦 Database: demystify
🚀 Server is running on http://localhost:5000
```

**Bad output (MongoDB error):**
```
❌ MongoDB connection error: connect ECONNREFUSED 127.0.0.1:27017
📝 Make sure MongoDB is running or update MONGODB_URI in .env file
```

**Bad output (Missing JWT_SECRET):**
```
⚠️  WARNING: JWT_SECRET is not set in .env file
⚠️  Authentication will not work without JWT_SECRET
```

## Step-by-Step Debug Process

1. **Stop the server** (Ctrl+C)

2. **Check .env file:**
   ```powershell
   cd server
   type .env
   ```
   Make sure JWT_SECRET and MONGODB_URI are set.

3. **Check MongoDB:**
   ```powershell
   mongosh
   ```
   If it connects, MongoDB is running. If not, start MongoDB.

4. **Restart server:**
   ```powershell
   npm run dev
   ```

5. **Check terminal for errors** - Look for:
   - "✅ Connected to MongoDB" ← Should see this
   - Any red error messages

6. **Test in browser:**
   - Open browser console (F12)
   - Try to login/signup
   - Check Network tab for error details

## Quick Checklist

- [ ] MongoDB is running (check with `mongosh`)
- [ ] `.env` file exists in `server` folder
- [ ] `.env` file has `JWT_SECRET` set
- [ ] `.env` file has `MONGODB_URI` set correctly
- [ ] `npm install` completed successfully in server folder
- [ ] Server terminal shows "✅ Connected to MongoDB"
- [ ] Server terminal shows "🚀 Server is running on http://localhost:5000"
- [ ] No red error messages in server terminal

## Common Error Messages

### "MongoDB connection error"
→ Start MongoDB service or check MONGODB_URI in .env

### "JWT_SECRET is not set"
→ Add JWT_SECRET to .env file

### "Cannot find module 'mongoose'"
→ Run `npm install` in server folder

### "Port 5000 already in use"
→ Change PORT in .env to another number (like 5001)

### "User with this email already exists"
→ Use a different email or delete the user from database

