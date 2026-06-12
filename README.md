# Echos: Time Capsule Logistics

Echos is a modern, full-stack web application that allows users to create digital time capsules. Users can write letters, attach photos/videos, and securely schedule them to be delivered to loved ones years into the future. 

## Features
- **Secure File Zipping**: Uploaded memories are intercepted, heavily compressed into a single `.zip` package, and securely piped into a MongoDB GridFS bucket to save space.
- **Automated Delivery Engine**: A background Node.js CRON worker runs silently, evaluating delivery schedules and automatically dispatching personalized HTML emails when the time arrives.
- **Aesthetic UI**: Built using React, featuring a sleek, responsive design with dynamic animations and modern typography.
- **Admin Logistics Portal**: A companion secure dashboard (in a separate repository) for logistics staff to track, manage, and facilitate both digital and physical time capsule deliveries.

## Tech Stack
- **Frontend**: React (Vite), Vanilla CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas (with GridFS for large file streaming)
- **Utilities**: `nodemailer` (email engine), `archiver` (high-compression zipping), `node-cron` (scheduling)

## Environment Variables
To run this application, you must provide the following `.env` variables in the `server/` directory:
```env
MONGO_URI=your_mongodb_connection_string
EMAIL_USER=your_gmail_address
EMAIL_PASS=your_gmail_app_password
JWT_SECRET=your_secure_random_string
API_URL=your_public_backend_url
```

## Running Locally
1. Clone the repository.
2. Open a terminal in the `/server` folder and run `npm install`. Then run `npm run dev` to start the backend.
3. Open a second terminal in the root folder (for the React frontend) and run `npm install`. Then run `npm run dev` to start the website.

---
*Preserve Your Legacy with Echos.*
