// test-db.js
const { MongoClient } = require('mongodb');

// Set environment variable directly
process.env.MONGODB_URI = 'mongodb://clientwork27217_db_user:qN3citcMNRIOIHVU@dashbord-shard-00-00.5tgjsui.mongodb.net:27017,dashbord-shard-00-01.5tgjsui.mongodb.net:27017,dashbord-shard-00-02.5tgjsui.mongodb.net:27017/jobapp?ssl=true&replicaSet=atlas-sicajr-shard-0&authSource=admin&retryWrites=true&w=majority';

async function testConnection() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI not found in environment variables');
    return;
  }

  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    ssl: true,
    tls: true,
    tlsAllowInvalidCertificates: true,
    tlsAllowInvalidHostnames: true,
    serverSelectionTimeoutMS: 60000,
    connectTimeoutMS: 60000,
    socketTimeoutMS: 60000,
    maxPoolSize: 10,
    minPoolSize: 1,
    maxIdleTimeMS: 30000,
  };

  console.log('Testing MongoDB connection...');
  console.log('URI:', uri.replace(/\/\/.*@/, '//***:***@')); // Hide credentials

  try {
    const client = new MongoClient(uri, options);
    await client.connect();
    console.log('✓ Connected successfully!');

    const db = client.db('jobapp');
    const collections = await db.collections();
    console.log('Available collections:', collections.map(c => c.collectionName));

    await client.close();
    console.log('✓ Connection closed successfully');
  } catch (error) {
    console.error('✗ Connection failed:', error.message);
    console.error('Error details:', error);
  }
}

testConnection();