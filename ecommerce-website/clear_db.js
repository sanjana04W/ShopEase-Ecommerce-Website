const mongoose = require('mongoose');

async function run() {
  await mongoose.connect('mongodb://localhost:27017/ecommerce');
  console.log('Connected to DB');
  
  const collections = await mongoose.connection.db.listCollections().toArray();
  const productCollectionExists = collections.some(col => col.name === 'products');
  
  if (productCollectionExists) {
    await mongoose.connection.db.collection('products').drop();
    console.log('Dropped products collection. The website will re-seed it with new images on next load.');
  } else {
    console.log('Products collection does not exist.');
  }
  
  await mongoose.disconnect();
}

run().catch(console.dir);
