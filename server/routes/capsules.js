import express from 'express';
import multer from 'multer';
import dotenv from 'dotenv';
import Capsule from '../models/Capsule.js';
import auth from '../middleware/auth.js';
import nodemailer from 'nodemailer';
import mongoose from 'mongoose';
import fs from 'fs';
import os from 'os';
import { ZipArchive } from 'archiver';

dotenv.config();

const router = express.Router();

// Fallback storage if Mongo URI isn't configured yet (to avoid crashing on boot)
const validMongoUri = process.env.MONGO_URI && !process.env.MONGO_URI.includes('<username>') 
  ? process.env.MONGO_URI 
  : 'mongodb://localhost:27017/echos_local_fallback';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

function generateReceiptNumber() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'ECHOS-';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Multer Disk Storage for temporary holding
const storage = multer.diskStorage({
  destination: os.tmpdir(),
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// GET Endpoint to fetch all capsules (Protected Admin Route)
router.get('/', auth, async (req, res) => {
  try {
    const capsules = await Capsule.find().sort({ createdAt: -1 });
    res.json(capsules);
  } catch (error) {
    console.error('Error fetching capsules:', error);
    res.status(500).json({ error: 'Failed to fetch capsules' });
  }
});

// GET Endpoint to download a file from GridFS (Protected Admin Route)
router.get('/download/:fileId', auth, async (req, res) => {
  try {
    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'uploads' });
    const fileId = new mongoose.Types.ObjectId(req.params.fileId);
    
    const files = await bucket.find({ _id: fileId }).toArray();
    if (!files || files.length === 0) return res.status(404).json({ error: 'File not found' });

    res.set('Content-Disposition', `attachment; filename="${files[0].filename}"`);
    res.set('Content-Type', files[0].contentType || 'application/octet-stream');

    bucket.openDownloadStream(fileId).pipe(res);
  } catch (error) {
    res.status(500).json({ error: 'Failed to download file' });
  }
});

// GET Endpoint for Public Recipient File Downloads (From Email Link)
router.get('/public/download/:fileId', async (req, res) => {
  try {
    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'uploads' });
    const fileId = new mongoose.Types.ObjectId(req.params.fileId);
    
    const files = await bucket.find({ _id: fileId }).toArray();
    if (!files || files.length === 0) return res.status(404).json({ error: 'File not found' });

    res.set('Content-Disposition', `attachment; filename="${files[0].filename}"`);
    res.set('Content-Type', files[0].contentType || 'application/octet-stream');

    bucket.openDownloadStream(fileId).pipe(res);
  } catch (error) {
    res.status(500).json({ error: 'Failed to download file' });
  }
});
// GET Endpoint for Public Tracking
router.get('/track', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Only return metadata, explicitly exclude sensitive fields, use case-insensitive regex
    const emailRegex = new RegExp(`^${email.trim()}$`, 'i');
    const capsules = await Capsule.find({ senderEmail: emailRegex })
      .select('-letter -files')
      .sort({ createdAt: -1 });
      
    res.json(capsules);
  } catch (error) {
    fs.writeFileSync('capsule-error.log', error.stack || error.toString());
    console.error('Failed to create capsule:', error);
    res.status(500).json({ error: 'Failed to create capsule' });
  }
});

// POST Endpoint to receive Capsule Data
router.post('/', upload.array('files'), async (req, res) => {
  try {
    const { 
      senderName, senderEmail,
      letter, 
      recipientType, 
      deliveryType, 
      deliveryDate,
      deliveryTime,
      email, fullName, street, city, state, country, zipCode
    } = req.body;

    let filesArray = [];

    // If there are files, zip them up and stream to GridFS
    if (req.files && req.files.length > 0) {
      const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'uploads' });
      const zipId = new mongoose.Types.ObjectId();
      
      const uploadStream = bucket.openUploadStreamWithId(zipId, 'capsule_memories.zip', {
        contentType: 'application/zip'
      });

      const archive = new ZipArchive({ zlib: { level: 9 } });

      // Wrap streaming in a promise
      await new Promise((resolve, reject) => {
        uploadStream.on('finish', resolve);
        uploadStream.on('error', reject);
        archive.on('error', reject);

        archive.pipe(uploadStream);

        for (const file of req.files) {
          archive.file(file.path, { name: file.originalname });
        }

        archive.finalize();
      });

      // After successful zip upload, delete temp files
      req.files.forEach(file => {
        fs.unlink(file.path, (err) => {
          if (err) console.error('Failed to delete temp file:', file.path);
        });
      });

      filesArray = [{
        fileId: zipId,
        originalName: 'capsule_memories.zip'
      }];
    }

    const receiptNumber = generateReceiptNumber();

    const newCapsule = new Capsule({
      receiptNumber,
      senderName,
      senderEmail: senderEmail.trim().toLowerCase(),
      letter,
      recipientType,
      deliveryType,
      deliveryDate: new Date(deliveryDate),
      deliveryTime: deliveryTime || '12:00',
      recipientDetails: {
        email, fullName, street, city, state, country, zipCode
      },
      files: filesArray
    });

    await newCapsule.save();
    
    // Send Aesthetic Confirmation Email
    if (senderEmail && process.env.EMAIL_USER) {
      const htmlEmail = `
        <div style="background-color: #fdf5e6; color: #333; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px 20px; text-align: center;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border-top: 5px solid #c1121f;">
            <h1 style="color: #c1121f; margin-bottom: 10px; text-align: center;">Echos Time Capsule Sealed</h1>
            
            <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin-bottom: 30px;">
              <p style="margin: 0; font-size: 14px; color: #888; text-transform: uppercase; letter-spacing: 1px;">Official Receipt Number</p>
              <p style="margin: 10px 0 0 0; font-size: 32px; font-weight: bold; color: #c1121f; letter-spacing: 3px;">${receiptNumber}</p>
            </div>
            
            <p style="font-size: 16px; line-height: 1.6; color: #444;">
              Dear ${senderName},<br/><br/>
              Your time capsule has been securely sealed and stored. It will be delivered exactly when the time is right.
            </p>
            
            <p style="font-size: 16px; line-height: 1.6; color: #444; font-weight: bold; background-color: #ffeeee; padding: 15px; border-radius: 5px; margin: 30px 0;">
              You cannot undo it, or edit it.<br/>Once cast into the ocean of time, it is permanent.
            </p>
            
            <p style="font-size: 16px; color: #666; margin-top: 40px;">
              Thanks for using Echos.<br/>
              <span style="font-size: 14px; color: #aaa;">The Echos Logistics Team</span>
            </p>
          </div>
        </div>
      `;

      try {
        await transporter.sendMail({
          from: `"Echos" <${process.env.EMAIL_USER}>`,
          to: senderEmail,
          subject: `Echos Receipt: ${receiptNumber}`,
          html: htmlEmail
        });
      } catch (mailError) {
        console.error("Failed to send receipt email:", mailError);
      }
    }

    res.status(201).json({ message: 'Capsule sealed successfully', receiptNumber, capsuleId: newCapsule._id });
  } catch (error) {
    fs.writeFileSync('capsule-post-error.log', error.stack || error.toString());
    console.error('Failed to create capsule:', error);
    res.status(500).json({ error: 'Failed to create capsule' });
  }
});

// DELETE a capsule
router.delete('/:id', auth, async (req, res) => {
  try {
    await Capsule.findByIdAndDelete(req.params.id);
    res.json({ message: 'Capsule deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete capsule' });
  }
});

// UPDATE a capsule
router.put('/:id', auth, async (req, res) => {
  try {
    // Only update fields that were sent
    const updatedCapsule = await Capsule.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    res.json(updatedCapsule);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update capsule' });
  }
});

export default router;
