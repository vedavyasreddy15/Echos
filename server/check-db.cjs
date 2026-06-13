const mongoose = require('mongoose');
require('dotenv').config();
mongoose.connect(process.env.MONGO_URI).then(async () => {
  const stats = await mongoose.connection.db.stats();
  console.log('Data Size (MB):', stats.dataSize / 1024 / 1024);
  console.log('Storage Size (MB):', stats.storageSize / 1024 / 1024);
  const collections = await mongoose.connection.db.collections();
  for (let c of collections) {
    const s = await c.stats();
    console.log(c.collectionName, 'Size (MB):', s.storageSize / 1024 / 1024);
  }
  process.exit();
}).catch(console.error);
