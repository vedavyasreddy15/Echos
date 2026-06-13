import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from '../models/Admin.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

export const seedAdmin = async () => {
  try {
    if (!process.env.MONGO_URI || process.env.MONGO_URI.includes('<username>')) {
      console.log('\n❌ ERROR: You must update your .env file with your actual MONGO_URI first!\n');
      return;
    }

    const email = 'vedavyasreddybommineni@gmail.com';
    const password = 'masterpassword123';

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      console.log(`\n⚠️ Admin account for ${email} already exists!\n`);
      return;
    }

    const admin = new Admin({ email, password });
    await admin.save();

    console.log(`\n🎉 Master Admin created successfully!`);
    console.log(`   Email:    ${email}`);
    console.log(`   Password: ${password}`);
    
  } catch (error) {
    console.error('\n❌ Failed to create admin account:', error);
  }
};

