import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Capsule from './models/Capsule.js';

dotenv.config();

async function test() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/echos_local_fallback');
  const capsules = await Capsule.find({ status: 'pending', deliveryType: 'virtual' });
  console.log(`Found ${capsules.length} pending virtual capsules`);
  
  const now = new Date();
  console.log("Current time:", now);
  
  capsules.forEach(c => {
    const capsuleDate = new Date(c.deliveryDate);
    const [hours, minutes] = (c.deliveryTime || '12:00').split(':').map(Number);
    capsuleDate.setHours(hours, minutes, 0, 0);
    console.log(`Capsule ${c.receiptNumber} - scheduled for ${capsuleDate} - is due: ${now >= capsuleDate}`);
  });
  
  process.exit();
}

test();
