import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import Capsule from './models/Capsule.js';
mongoose.connect(process.env.MONGO_URI).then(async () => {
  const result = await Capsule.deleteMany({ recipientDetails: { $exists: false } });
  console.log('Deleted bad capsules:', result.deletedCount);
  process.exit(0);
});
