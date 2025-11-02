# Server Run Karne Ka Tarika (हिंदी में)

## Step 1: Dependencies Install Karein

PowerShell ya Terminal khol kar yeh commands run karein:

```powershell
cd "C:\Users\user\OneDrive\Desktop\V2_legal_document_simplifier\legal-document-demystifier-prototype5\server"
npm install
```

## Step 2: .env File Banayein

`server` folder mein ek `.env` file banayein aur is content ko paste karein:

### Agar Local MongoDB Use Kar Rahe Ho:
```
MONGODB_URI=mongodb://localhost:27017/demystify
JWT_SECRET=my-super-secret-jwt-key-123456789
PORT=5000
```

### Agar MongoDB Atlas (Cloud) Use Kar Rahe Ho:
```
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/demystify
JWT_SECRET=my-super-secret-jwt-key-123456789
PORT=5000
```

**Important:** 
- MongoDB Atlas ke liye connection string apne Atlas dashboard se copy karein
- Username aur password ko apni values se replace karein

## Step 3: MongoDB Start Karein (Sirf Local MongoDB ke liye)

Agar aap local MongoDB use kar rahe ho, toh MongoDB service ko start karein:

```powershell
# Check karein MongoDB running hai ya nahi
mongosh
```

Agar MongoDB nahi chal raha:
- Windows Services mein jao
- "MongoDB" service ko start karein
- Ya command prompt ko Administrator ke taur par khol kar:
  ```powershell
  net start MongoDB
  ```

## Step 4: Server Start Karein

```powershell
cd "C:\Users\user\OneDrive\Desktop\V2_legal_document_simplifier\legal-document-demystifier-prototype5\server"
npm run dev
```

Aapko yeh dikhega:
```
✅ Connected to MongoDB
🚀 Server is running on http://localhost:5000
```

## Agar Error Aaye

### "Cannot find module"
- Pehle `npm install` run karein

### "MongoDB connection error"
- MongoDB running hai check karein (`mongosh` command se)
- Ya `.env` file mein MongoDB connection string sahi hai verify karein

### "Port 5000 already in use"
- `.env` file mein PORT ko 5001 ya koi aur port se change karein
- `services/authService.ts` mein bhi port update karein

## Quick Commands Summary

```powershell
# 1. Server folder mein jao
cd "C:\Users\user\OneDrive\Desktop\V2_legal_document_simplifier\legal-document-demystifier-prototype5\server"

# 2. Dependencies install karein (pehli baar)
npm install

# 3. .env file banayein (pehli baar)

# 4. Server start karein
npm run dev
```

**Yaad rakhein:** Server ko running rakhein jab tak aap frontend use kar rahe ho!

