import express from 'express'; // reload 9

import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import capsulesRouter from './routes/capsules.js';
import authRouter from './routes/auth.js';
import { initCronJob } from './cron.js';

// Load environment variables from .env file
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Set up MongoDB Connection
if (process.env.MONGO_URI && !process.env.MONGO_URI.includes('<username>')) {
  mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
      console.log('✅ Connected to MongoDB Atlas');
      const { seedAdmin } = await import('./scripts/seedAdmin.js');
      await seedAdmin();
    })
    .catch((error) => console.error('❌ MongoDB Connection Error:', error));
} else {
  console.log('⚠️ WARNING: Using placeholder MONGO_URI. Please update your server/.env file.');
}

// Start the background email worker
initCronJob();

// Routes
app.use('/api/capsules', capsulesRouter);
app.use('/api/auth', authRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
