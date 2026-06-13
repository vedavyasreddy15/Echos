import express from 'express';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

const router = express.Router();

router.get('/test', async (req, res) => {
  try {
    const admins = await Admin.find({});
    res.json(admins);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }
    
    const validPassword = await admin.comparePassword(password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { _id: admin._id, email: admin.email }, 
      process.env.JWT_SECRET || 'fallback_secret_key', 
      { expiresIn: '24h' }
    );
    
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Server error during login' });
  }
});

export default router;
