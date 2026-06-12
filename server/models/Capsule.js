import mongoose from 'mongoose';

const capsuleSchema = new mongoose.Schema({
  receiptNumber: { type: String, required: true, unique: true },
  senderName: { type: String, required: true },
  senderEmail: { type: String, required: true },
  letter: { type: String, default: '' },
  recipientType: { type: String, enum: ['self', 'special'], required: true },
  deliveryType: { type: String, enum: ['virtual', 'physical'], required: true },
  
  recipientDetails: {
    email: String,
    fullName: String,
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String
  },
  
  deliveryDate: { type: Date, required: true },
  deliveryTime: { type: String, default: '12:00' },
  status: { type: String, enum: ['pending', 'delivered'], default: 'pending' },
  
  // Array of GridFS file references
  files: [{
    fileId: { type: mongoose.Schema.Types.ObjectId, required: true },
    originalName: { type: String, required: true }
  }],
  
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Capsule', capsuleSchema);
