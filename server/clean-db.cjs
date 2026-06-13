const mongoose = require('mongoose');
require('dotenv').config();

async function clean() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB!');
    
    const db = mongoose.connection.db;
    
    try { await db.dropCollection('capsules'); console.log('Dropped capsules'); } catch(e) {}
    try { await db.dropCollection('fs.files'); console.log('Dropped fs.files'); } catch(e) {}
    try { await db.dropCollection('fs.chunks'); console.log('Dropped fs.chunks'); } catch(e) {}
    
    console.log('Database cleared successfully! Storage is back to 0%.');
  } catch(e) {
    console.error('Connection Error:', e.message);
  } finally {
    process.exit();
  }
}
clean();
