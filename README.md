# House Verified - Complete Setup Guide

**House Verified** is a demonstration system that shows how House documents can be digitally signed and verified using cryptographic technology. This guide will help you get the application running on your computer, even if you're not a programmer.

## 🎯 What This Does

- **Verify Documents**: Upload any file and check if it's digitally signed by the House
- **View Sample Assets**: Browse pre-created examples of verified, tampered, and unknown documents  
- **Cryptographic Proof**: See detailed proof-of-origin information for any document
- **Web Interface**: Easy-to-use website that works in your browser

## 📋 What You Need

Before starting, make sure you have these programs installed on your computer:

### Required Software

1. **Node.js** (version 20 or newer)
   - Go to: https://nodejs.org
   - Download and install the "LTS" version (recommended for most users)
   - This includes `npm` which we'll use to manage the project

2. **Git** (for getting the code)
   - Go to: https://git-scm.com/downloads
   - Download and install for your operating system

3. **Terminal/Command Prompt**
   - **Windows**: Use "Command Prompt" or "PowerShell" 
   - **Mac**: Use "Terminal" (found in Applications → Utilities)
   - **Linux**: Use your default terminal

### Optional (But Recommended)

4. **Docker Desktop** (makes setup easier)
   - Go to: https://www.docker.com/products/docker-desktop
   - Download and install
   - This lets you run everything without worrying about dependencies

## 🚀 Quick Start (Recommended)

**This is the easiest way to get started:**

### Step 1: Get the Code
```bash
# Open your terminal and run these commands one by one:
git clone https://github.com/your-repo/House-Verified.git
cd House-Verified
```

### Step 2: One-Command Setup
```bash
# This installs everything and sets up sample data:
npm run setup
```

### Step 3: Start the Application  
```bash
# This starts both the backend and frontend:
npm run dev
```

### Step 4: Open in Browser
- Wait for the message "backend on :4000" and "Local: http://localhost:5173"
- Open your web browser
- Go to: **http://localhost:5173**

**That's it!** The House Verified application should now be running.

---

## 🐳 Alternative: Docker Setup (Even Easier)

If you have Docker Desktop installed:

### Step 1: Get the Code (same as above)
```bash
git clone https://github.com/your-repo/House-Verified.git
cd House-Verified
```

### Step 2: Start with Docker
```bash
# This builds and starts everything automatically:
docker compose up --build
```

### Step 3: Open in Browser
- Wait for the containers to start (you'll see logs in the terminal)
- Open your web browser  
- Go to: **http://localhost:5173**

---

## 🔧 Manual Setup (For Advanced Users)

If the quick setup doesn't work, try this step-by-step approach:

### Step 1: Get the Code
```bash
git clone https://github.com/your-repo/House-Verified.git
cd House-Verified
```

### Step 2: Install Dependencies
```bash
# Install root dependencies
npm install

# Install backend dependencies  
cd backend
npm install
cd ..

# Install frontend dependencies
cd frontend  
npm install
cd ..
```

### Step 3: Generate Security Keys
```bash
# This creates test certificates for signing documents
./scripts/generate-test-keys.sh
```

### Step 4: Create Sample Data
```bash
# This creates example files to test with
./scripts/seed-assets.sh
```

### Step 5: Start Backend (in one terminal)
```bash
cd backend
npm run dev
```

### Step 6: Start Frontend (in a new terminal)
```bash
cd frontend
npm run dev
```

### Step 7: Open in Browser
- Go to: **http://localhost:5173**

---

## 🧪 Testing the Application

Once running, you can test if everything works:

### Automatic Test
```bash
# Run this to check if all services are working:
npm run smoke
```

You should see "ALL GOOD ✅" if everything is working.

### Manual Testing

1. **Visit the Homepage**
   - Go to http://localhost:5173
   - You should see "Trust what you read from the House"
   - Click on any sample document

2. **Test File Verification**  
   - Click "Verify" in the top navigation
   - Upload any file from your computer OR
   - Enter this URL: `http://localhost:4000/files/flyer.verified.png`
   - Click "Check"
   - You should see verification results

3. **View Cryptographic Proof**
   - Click "View proof" on any verification result
   - You should see detailed technical information
   - Click "Copy JSON" to see the raw data

---

## 🛠️ Troubleshooting

### Common Issues

**"Command not found: npm"**
- Install Node.js from https://nodejs.org
- Restart your terminal after installation
- Try `node --version` to confirm it's installed

**"Permission denied" on Mac/Linux**
- Run: `chmod +x scripts/generate-test-keys.sh`
- Run: `chmod +x scripts/seed-assets.sh`
- Then retry the commands

**"Port already in use"**  
- Stop the application with `Ctrl+C`
- Wait a few seconds and try again
- Or use different ports by setting environment variables

**Frontend shows "Network Error"**
- Make sure the backend is running (should show "backend on :4000")
- Check that no firewall is blocking localhost connections

**Sample files not loading**
- Run: `./scripts/seed-assets.sh`  
- Make sure the `sample-assets/output` folder has files in it

### Getting Help

**Check Application Health:**
```bash
# Test if the backend is responding:
curl http://localhost:4000/health
```

**View Logs:**
- Backend logs appear in the terminal where you ran `npm run dev:backend`
- Frontend logs appear in your browser's developer tools (F12)

**Reset Everything:**
```bash
# Stop the application (Ctrl+C)
# Remove node modules and reinstall:
rm -rf node_modules backend/node_modules frontend/node_modules
npm run setup
```

---

## 🌐 Using the Application

### Main Features

**1. Showcase Page (Homepage)**
- View sample House documents
- See verification status at a glance
- Click any document to see details

**2. Verify Page**  
- Upload files from your computer
- Enter URLs of online documents
- Get instant verification results
- View cryptographic proof of authenticity

**3. Asset Details**
- See document metadata  
- Download original files
- View provenance information
- Access verification proof panel

### Understanding Verification Results

**✅ Verified** - Document is authentic and signed by the House
**❌ Failed (tampered)** - Document has been modified after signing  
**⚠️ Unknown signer** - Document is signed but not by a trusted House key

---

## 🔐 Security Notes

**This is a demonstration system:**
- Uses test certificates (not real House keys)
- Runs in "simulator mode" by default  
- Safe to test with any files
- No data is permanently stored

**For production deployment:**
- Replace test keys with real House certificates
- Enable proper certificate validation
- Add rate limiting and security headers
- Use secure hosting infrastructure

---

## 📞 Support

If you're having trouble:

1. **Read this guide completely** - most issues are covered above
2. **Check the troubleshooting section** - common problems have solutions
3. **Run the smoke test** - `npm run smoke` will tell you what's broken
4. **Check the logs** - error messages often explain the problem

**For developers:**
- Review the code comments and documentation  
- Check the `backend/` and `frontend/` directories for technical details
- Use `DEBUG=1` environment variable for verbose logging

---

## 📖 What's Included

```
House-Verified/
├── README.md                    # This guide
├── package.json                 # Main project configuration
├── docker-compose.yml           # Docker setup
│
├── scripts/                     # Setup utilities
│   ├── generate-test-keys.sh    # Creates test certificates
│   ├── seed-assets.sh           # Creates sample documents  
│   └── smoke-test.mjs           # Automated testing
│
├── backend/                     # Server application
│   ├── src/                     # Server source code
│   ├── package.json             # Server dependencies
│   └── keys/                    # Generated certificates
│
├── frontend/                    # Web interface
│   ├── src/                     # Website source code
│   ├── package.json             # Website dependencies  
│   └── tests/                   # Automated UI tests
│
└── sample-assets/               # Test documents
    ├── input/                   # Original files
    └── output/                  # Signed & modified files
```

---

**🎉 Congratulations!** 

You now have a complete House document verification system running on your computer. You can upload documents, verify their authenticity, and explore the cryptographic proof technology that makes it possible.

This system demonstrates how the House of Representatives could provide tamper-proof verification for all official documents, ensuring citizens can trust what they read.