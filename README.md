# JobKhoj - Job Portal Application

A full-stack MERN (MongoDB, Express, React, Node.js) job portal application that connects job seekers with employers.

## Features

### For Job Seekers:
- User registration and login
- Complete profile management
- Resume upload
- Job search with filters
- Apply for jobs
- View application status

### For Employers:
- Create and manage company profile
- Post new job openings
- Review applications
- Manage job listings

## Tech Stack

**Frontend:**
- React.js
- React Router
- Styled Components
- Axios
- Lucide React (Icons)
- Vite (Build tool)

**Backend:**
- Node.js
- Express.js
- MongoDB
- Mongoose (ODM)
- JWT (Authentication)
- Bcryptjs (Password hashing)
- Multer (File uploads)
- CORS (Cross-origin resource sharing)

## Deployment Guide

This application is deployed using the following services:
- **MongoDB Atlas** for the database
- **Render.com** for the backend server
- **Vercel.com** for the frontend application

### Access Links

- **Frontend URL:** [To be added after deployment]
- **Backend URL:** [To be added after deployment]
- **GitHub Repository:** [To be added after creation]

## How to Use

1. Visit the frontend URL
2. Register as either a job seeker or employer
3. Complete your profile information
4. For job seekers: Browse and apply for jobs
5. For employers: Post job openings and review applications

## Development Setup

### Prerequisites
- Node.js (v20.19+ recommended)
- MongoDB

### Backend Setup
1. Navigate to the backend directory: `cd backend`
2. Install dependencies: `npm install`
3. Create a `.env` file with the following variables:
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/jobkhoj
   JWT_SECRET=your_jwt_secret_key_here
   ```
4. Start the server: `npm run dev`

### Frontend Setup
1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Create a `.env` file with the following variable:
   ```
   VITE_API_URL=http://localhost:5000/api
   ```
4. Start the development server: `npm run dev`

## License
[MIT](https://choosealicense.com/licenses/mit/)