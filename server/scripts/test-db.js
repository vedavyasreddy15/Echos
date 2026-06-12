import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Capsule from './models/Capsule.js';

dotenv.config();

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');
    
    const capsules = await Capsule.find({});
    console.log('Existing capsules:', capsules.length);
    
    // Attempt a dummy save to see the error
    const newCapsule = new Capsule({
      receiptNumber: 'TEST-123',
      senderName: 'Test',
      senderEmail: 'test@test.com',
      recipientType: 'self',
      deliveryType: 'virtual',
      deliveryDate: new Date()
    });
    
    await newCapsule.save();
    console.log('Save successful');
    
    await Capsule.deleteOne({ _id: newCapsule._id });
    
  } catch (err) {
    console.error('ERROR:', err);
  } finally {
    process.exit();
  }
}

run();
