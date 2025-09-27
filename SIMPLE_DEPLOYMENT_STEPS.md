# Simple Deployment Steps for JobKhoj

Follow these clear, step-by-step instructions to deploy your JobKhoj application for free.

## **Before You Start**
Make sure you have:
- A computer with internet access
- Basic knowledge of using a web browser

---

## **Step 1: Prepare Your Project**

1. **Open File Explorer** and go to your project folder: `c:\Users\mohdi\OneDrive\Desktop\JobKhoj`
2. **Verify these files exist** (I've created them for you):
   - `.gitignore`
   - `README.md`
   - `DEPLOYMENT_GUIDE.md`
   - `DEPLOYMENT_SUMMARY.md`
   - `deploy-helper.js`

---

## **Step 2: Create a GitHub Account & Repository**

1. **Go to GitHub**: [https://github.com/join](https://github.com/join)
2. **Create a free account** (if you don't have one)
3. **Sign in** to your GitHub account
4. **Create a new repository**: 
   - Click the "+" icon in the top-right corner
   - Select "New repository"
   - Name: `jobkhoj-portal` (or any name you like)
   - Set to "Public"
   - Check "Add a README file"
   - Click "Create repository"

---

## **Step 3: Push Your Project to GitHub**

1. **Open Command Prompt** (Press Windows key + R, type `cmd`, press Enter)
2. **Navigate to your project folder**: 
   ```cmd
   cd c:\Users\mohdi\OneDrive\Desktop\JobKhoj
   ```
3. **Run these commands one by one**: 
   ```cmd
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/jobkhoj-portal.git
   git push -u origin main
   ```
   (Replace `YOUR_USERNAME` with your actual GitHub username)

---

## **Step 4: Set Up MongoDB Atlas**

1. **Go to MongoDB Atlas**: [https://www.mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register)
2. **Create a free account** (if you don't have one)
3. **Sign in** to your MongoDB Atlas account
4. **Build a Database**: 
   - Click "Build a Database"
   - Select the "Free" tier (M0 Sandbox)
   - Click "Create Cluster" (wait a few minutes for it to create)
5. **Create a Database User**: 
   - Click "Database Access" in the left menu
   - Click "Add New Database User"
   - Username: `jobkhojuser`
   - Password: Create a secure password (write it down!)
   - User Privileges: "Read and write to any database"
   - Click "Add User"
6. **Configure Network Access**: 
   - Click "Network Access" in the left menu
   - Click "Add IP Address"
   - Select "Allow access from anywhere" (0.0.0.0/0)
   - Click "Confirm"
7. **Get Your Connection String**: 
   - Click "Clusters" in the left menu
   - Click "Connect" on your cluster
   - Select "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `myFirstDatabase` with `jobkhoj`
   - Save this string for later!

---

## **Step 5: Deploy Backend to Render**

1. **Go to Render**: [https://render.com/](https://render.com/)
2. **Create a free account** (if you don't have one)
3. **Sign in** to your Render account
4. **Connect GitHub to Render**: 
   - Click "New" > "Web Service"
   - Click "Connect GitHub"
   - Authorize Render to access your GitHub account
5. **Configure Your Backend Service**: 
   - Select your `jobkhoj-portal` repository
   - Name: `jobkhoj-backend`
   - Root Directory: `backend`
   - Runtime: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
6. **Add Environment Variables**: 
   - Click "Add Environment Variable"
   - Add these variables (one by one):
     - `MONGO_URI`: Paste your MongoDB connection string
     - `JWT_SECRET`: A long random string (at least 32 characters)
     - `PORT`: `5000`
7. **Click "Create Web Service"**
8. **Wait for deployment** (this may take a few minutes)
9. **Save your backend URL** (it will look like: `https://jobkhoj-backend.onrender.com`)

---

## **Step 6: Deploy Frontend to Vercel**

1. **Go to Vercel**: [https://vercel.com/signup](https://vercel.com/signup)
2. **Create a free account** using your GitHub account
3. **Sign in** to your Vercel account
4. **Import Your Project**: 
   - Click "New Project"
   - Select your `jobkhoj-portal` repository
   - Click "Import"
5. **Configure Your Frontend Project**: 
   - Root Directory: `frontend`
   - Framework Preset: `Vite` (should be auto-detected)
6. **Add Environment Variable**: 
   - Click "Add Environment Variable"
   - Name: `VITE_API_URL`
   - Value: Your Render backend URL + `/api`
   - (Example: `https://jobkhoj-backend.onrender.com/api`)
7. **Click "Deploy"**
8. **Wait for deployment** (this may take a few minutes)
9. **Save your frontend URL** (it will look like: `https://jobkhoj-portal.vercel.app`)

---

## **Step 7: Test Your Live Application**

1. **Open your frontend URL** in a web browser
2. **Test these features**: 
   - ✅ Register a new account (both jobseeker and employer)
   - ✅ Log in with your new account
   - ✅ Browse jobs (as a jobseeker)
   - ✅ Post a job (as an employer)
   - ✅ Apply for a job
3. **If something doesn't work**: 
   - Check your environment variables on Render and Vercel
   - Make sure your MongoDB user has the right permissions
   - Verify your connection string is correct

---

## **Step 8: Update Your Documentation**

1. **Edit your GitHub repository's README.md**
2. **Add these links**: 
   - Live Frontend URL: [Your Vercel URL]
   - Live Backend URL: [Your Render URL]
   - GitHub Repository: [Your GitHub URL]
3. **Add brief instructions** on how to use the site

---

## **Congratulations!**

You have successfully deployed your JobKhoj MERN stack job portal application completely free of charge!

## **Need Help?**

- Check the `DEPLOYMENT_GUIDE.md` file in your project for more detailed instructions
- Look at `DEPLOYMENT_SUMMARY.md` for key configurations
- Run `node deploy-helper.js` in Command Prompt to check your setup

Good luck with your job portal! 🚀