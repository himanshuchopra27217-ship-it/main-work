// Simple script to create a test user
const bcrypt = require('bcryptjs');
const { MongoClient } = require('mongodb');

async function createTestUser() {
  const uri = process.env.MONGODB_URI || 'mongodb+srv://clientwork27217_db_user:qN3citcMNRIOIHVU@dashbord.5tgjsui.mongodb.net/jobapp?retryWrites=true&w=majority';

  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db('jobapp');

    // Hash password
    const hashedPassword = await bcrypt.hash('password123', 10);

    const user = {
      name: 'Himanshu Chopra',
      email: 'himanshuchopra27217@gmail.com',
      mobile: '1234567890',
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    };

    const result = await db.collection('users').insertOne(user);
    console.log('User created with ID:', result.insertedId);

    // Create profile
    const profile = {
      userId: result.insertedId.toString(),
      role: 'worker',
      category: 'Web Developer',
      age: 25,
      mobile: '1234567890',
      createdAt: new Date().toISOString(),
    };

    await db.collection('profiles').insertOne(profile);
    console.log('Profile created');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

createTestUser();