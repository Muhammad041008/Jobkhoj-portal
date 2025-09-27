# JobKhoj Deployment Guide

This guide will walk you through deploying the JobKhoj application completely free of charge using these services:
- **GitHub**: Code repository
- **MongoDB Atlas**: Database hosting
- **Render.com**: Backend server hosting
- **Vercel.com**: Frontend hosting

## Table of Contents
1. [GitHub Repository Setup](#1-github-repository-setup)
2. [MongoDB Atlas Database Setup](#2-mongodb-atlas-database-setup)
3. [Backend Deployment on Render](#3-backend-deployment-on-render)
4. [Frontend Deployment on Vercel](#4-frontend-deployment-on-vercel)
5. [Testing the Live Application](#5-testing-the-live-application)
6. [Updating Documentation](#6-updating-documentation)

## 1. GitHub Repository Setup

### Step 1: Create a GitHub Account
If you don't already have a GitHub account, sign up at [github.com](https://github.com/).

### Step 2: Create a New Repository
1. Click the "+" icon in the top-right corner and select "New repository".
2. Name your repository (e.g., "jobkhoj-portal").
3. Select "Public" for visibility.
4. Check "Add a README file" (we'll update it later).
5. Click "Create repository".

### Step 3: Push Your Project to GitHub
Open a terminal in your project directory and run these commands:

```bash
# Initialize git if not already initialized
git init

# Add the GitHub repository as a remote
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git

# Add all files to staging
git add .

# Commit your changes
git commit -m "Initial commit"

# Push to GitHub
git push -u origin main
```

## 2. MongoDB Atlas Database Setup

### Step 1: Create a MongoDB Atlas Account
Sign up for a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register).

### Step 2: Create a Free Cluster
1. After logging in, click "Build a Database".
2. Select the "Free" tier (M0 Sandbox).
3. Choose your preferred cloud provider and region.
4. Give your cluster a name (e.g., "jobkhoj-cluster").
5. Click "Create Cluster" (this may take a few minutes).

### Step 3: Create a Database User
1. Go to "Database Access" in the left menu.
2. Click "Add New Database User".
3. Select "Password" authentication method.
4. Create a username and password (remember these for later).
5. Set user privileges to "Read and write to any database".
6. Click "Add User".

### Step 4: Configure Network Access
1. Go to "Network Access" in the left menu.
2. Click "Add IP Address".
3. Select "Allow access from anywhere" (0.0.0.0/0).
4. Click "Confirm".

### Step 5: Get Your Connection String
1. Go back to your cluster overview.
2. Click "Connect".
3. Select "Connect your application".
4. Choose "Node.js" as the driver.
5. Copy the connection string.
6. Replace `<password>` with the password you created earlier.
7. Replace `myFirstDatabase` with `jobkhoj`.

## 3. Backend Deployment on Render

### Step 1: Create a Render Account
Sign up for a free account at [Render.com](https://render.com/).

### Step 2: Connect GitHub to Render
1. After logging in, go to your dashboard.
2. Click "New" > "Web Service".
3. Click "Connect GitHub".
4. Authorize Render to access your GitHub account.
5. Select the repository you created earlier.

### Step 3: Configure Your Backend Service
1. Give your service a name (e.g., "jobkhoj-backend").
2. Set "Root Directory" to `backend`.
3. Select "Node" as the runtime.
4. Set the build command to `npm install`.
5. Set the start command to `npm start`.
6. Under "Environment Variables", click "Add Environment Variable" and add:
   - `MONGO_URI`: Paste your MongoDB connection string
   - `JWT_SECRET`: A secure random string (minimum 32 characters)
   - `PORT`: 5000
7. Click "Create Web Service".

### Step 4: Note Your Backend URL
After deployment, your backend will be accessible at a URL like `https://jobkhoj-backend.onrender.com`.
Make note of this URL for the frontend configuration.

## 4. Frontend Deployment on Vercel

### Step 1: Create a Vercel Account
Sign up for a free account at [Vercel.com](https://vercel.com/signup) using your GitHub account.

### Step 2: Import Your Project
1. After logging in, click "New Project".
2. Select the repository you created earlier.
3. Click "Import".

### Step 3: Configure Your Frontend Project
1. Under "Configure Project", set "Root Directory" to `frontend`.
2. Under "Build & Development Settings", the default settings should work (Vercel auto-detects React projects).
3. Under "Environment Variables", click "Add" and add:
   - `VITE_API_URL`: Your Render backend URL followed by `/api` (e.g., `https://jobkhoj-backend.onrender.com/api`)
4. Click "Deploy".

### Step 4: Note Your Frontend URL
After deployment, your frontend will be accessible at a URL like `https://jobkhoj-portal.vercel.app`.

## 5. Testing the Live Application

### Step 1: Verify the Backend
1. Visit your Render backend URL (e.g., `https://jobkhoj-backend.onrender.com`).
2. You should see a message indicating the server is running.
3. Test some API endpoints using tools like Postman or curl.

### Step 2: Verify the Frontend
1. Visit your Vercel frontend URL (e.g., `https://jobkhoj-portal.vercel.app`).
2. Try registering a new user account.
3. Log in with your new account.
4. Test core functionality:
   - For job seekers: Browse jobs, apply for a job
   - For employers: Post a job, view applications

### Step 3: Troubleshooting Common Issues
- **CORS errors**: Ensure your backend has CORS properly configured (it should be set up in this project).
- **Database connection issues**: Verify your MongoDB connection string and user permissions.
- **Environment variables**: Double-check that all environment variables are correctly set on both Render and Vercel.

## 6. Updating Documentation

### Step 1: Update Your GitHub Repository
1. Clone your repository to your local machine if you haven't already.
2. Update the README.md file with your live URLs.
3. Commit and push your changes.

### Step 2: Provide Clear Instructions
In your README.md, include:
- Links to your live frontend and backend
- Brief instructions on how to use the site
- Information about the technology stack
- A link to this deployment guide

## Additional Notes

- **Render Free Tier Limitations**: Free Render services will spin down after 15 minutes of inactivity. Subsequent requests may take longer to respond as the service spins back up.
- **MongoDB Atlas Limitations**: The free tier has usage limits, but it's sufficient for small applications.
- **Security**: For production applications, consider:
  - Restricting MongoDB Atlas IP access to only your Render server
  - Using more secure environment variable management
  - Implementing rate limiting and additional security measures

Congratulations! You've successfully deployed your JobKhoj MERN stack job portal application completely free of charge!