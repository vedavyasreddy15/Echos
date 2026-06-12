import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import Capsule from './models/Capsule.js';
mongoose.connect(process.env.MONGO_URI).then(async () => {
  const caps = await Capsule.find();
  console.log(JSON.stringify(caps, null, 2));
  process.exit(0);
});
