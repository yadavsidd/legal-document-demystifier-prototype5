# .env File Create Karne Ka Tarika

## Important: .env file zaroori hai!

Aapke server folder mein `.env` file create karni hogi.

## Steps:

1. **Server folder mein jao:**
   ```
   legal-document-demystifier-prototype5/server/
   ```

2. **Ek nayi file banayein** jiska naam ho: `.env`
   
   ⚠️ **Important:** File ka naam sirf `.env` hona chahiye (no extension like .txt)

3. **Is content ko paste karein:**

### Agar Local MongoDB Use Kar Rahe Ho:
```
MONGODB_URI=mongodb://localhost:27017/demystify
JWT_SECRET=my-super-secret-jwt-key-123456789-dont-share-this
PORT=5000
```

### Agar MongoDB Atlas (Cloud) Use Kar Rahe Ho:
```
MONGODB_URI=mongodb+srv://your-username:your-password@cluster0.xxxxx.mongodb.net/demystify?retryWrites=true&w=majority
JWT_SECRET=my-super-secret-jwt-key-123456789-dont-share-this
PORT=5000
```

## Windows Mein .env File Kaise Banayein:

### Method 1: Notepad se
1. Server folder mein right-click karein
2. New → Text Document select karein
3. File ka naam `.env` rakhein (purana .txt extension hata dein)
4. Windows warning dega, "Yes" click karein
5. File khol kar content paste karein
6. Save karein

### Method 2: PowerShell se
```powershell
cd "C:\Users\user\OneDrive\Desktop\V2_legal_document_simplifier\legal-document-demystifier-prototype5\server"
@"
MONGODB_URI=mongodb://localhost:27017/demystify
JWT_SECRET=my-super-secret-jwt-key-123456789-dont-share-this
PORT=5000
"@ | Out-File -FilePath .env -Encoding utf8
```

### Method 3: VS Code se
1. Server folder kholo VS Code mein
2. New File button click karo
3. File ka naam `.env` type karo
4. Content paste karo
5. Save karo

## Verification:

File banane ke baad, check karein:
```powershell
cd server
dir .env
```

Agar file dikhe, toh theek hai!

## Important Notes:

- **JWT_SECRET** ko apna unique string se replace karein (kisi ko share mat karo)
- **MONGODB_URI** mein agar password hai, toh space nahi hona chahiye
- File ka naam exactly `.env` hona chahiye (no .txt extension)

