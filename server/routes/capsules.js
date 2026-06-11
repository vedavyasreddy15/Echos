import express from 'express';
import multer from 'multer';
import { GridFsStorage } from 'multer-gridfs-storage';
import dotenv from 'dotenv';
import Capsule from '../models/Capsule.js';

dotenv.config();

const router = express.Router();

// Fallback storage if Mongo URI isn't configured yet (to avoid crashing on boot)
const validMongoUri = process.env.MONGO_URI && !process.env.MONGO_URI.includes('<username>') 
  ? process.env.MONGO_URI 
  : 'mongodb://localhost:27017/echos_local_fallback';

// Create GridFS Storage Engine for Multer
const storage = new GridFsStorage({
  url: validMongoUri,
  file: (req, file) => {
    return {
      bucketName: 'uploads', // The collection name in MongoDB for GridFS
      filename: `${Date.now()}-${file.originalname}`
    };
  }
});

const upload = multer({ storage });

// POST Endpoint to receive Capsule Data
router.post('/', upload.array('files'), async (req, res) => {
  try {
    const { 
      letter, 
      recipientType, 
      deliveryType, 
      deliveryDate,
      email, phone, fullName, street, city, state, country, zipCode
    } = req.body;

    // req.files is populated by multer-gridfs-storage and includes the file id stored in GridFS
    const filesArray = req.files ? req.files.map(f => ({
      fileId: f.id,
      originalName: f.originalname
    })) : [];

    const newCapsule = new Capsule({
      letter,
      recipientType,
      deliveryType,
      deliveryDate: new Date(deliveryDate),
      recipientDetails: {
        email, phone, fullName, street, city, state, country, zipCode
      },
      files: filesArray
    });

    await newCapsule.save();
    
    res.status(201).json({ message: 'Capsule sealed successfully', capsuleId: newCapsule._id });
  } catch (error) {
    console.error('Error saving capsule:', error);
    res.status(500).json({ error: 'Failed to seal capsule' });
  }
});

export default router;
