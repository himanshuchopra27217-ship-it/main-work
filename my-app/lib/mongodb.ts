// lib/mongodb.ts
import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MONGODB_URI to .env.local');
}

const uri = process.env.MONGODB_URI;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable to preserve the connection
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect()
      .then(() => {
        console.log('✓ MongoDB connected successfully in development');
        return client;
      })
      .catch((error) => {
        console.error('✗ MongoDB connection failed in development:', error);
        throw error;
      });
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, create a new client
  client = new MongoClient(uri, options);
  clientPromise = client.connect()
    .then(() => {
      console.log('✓ MongoDB connected successfully in production');
      return client;
    })
    .catch((error) => {
      console.error('✗ MongoDB connection failed in production:', error);
      throw error;
    });
}

export default clientPromise;