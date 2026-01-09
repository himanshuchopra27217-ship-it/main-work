// Database initialization and index creation
import clientPromise from './mongodb';

export async function initializeDatabase() {
  try {
    const client = await clientPromise;
    const db = client.db('jobapp');

    // Create collections and indexes
    console.log('📦 Initializing database collections and indexes...');

    // Users collection
    try {
      await db.createCollection('users');
      console.log('✓ Created users collection');
    } catch (error: any) {
      if (error.codeName !== 'NamespaceExists') {
        throw error;
      }
    }

    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('users').createIndex({ mobile: 1 }, { unique: true });
    await db.collection('users').createIndex({ resetToken: 1 }, { sparse: true });
    console.log('✓ Created indexes for users collection');

    // Profiles collection
    try {
      await db.createCollection('profiles');
      console.log('✓ Created profiles collection');
    } catch (error: any) {
      if (error.codeName !== 'NamespaceExists') {
        throw error;
      }
    }

    await db.collection('profiles').createIndex({ userId: 1 }, { unique: true });
    await db.collection('profiles').createIndex({ category: 1 });
    await db.collection('profiles').createIndex({ isVerified: 1 });
    console.log('✓ Created indexes for profiles collection');

    // JobPosts collection
    try {
      await db.createCollection('jobPosts');
      console.log('✓ Created jobPosts collection');
    } catch (error: any) {
      if (error.codeName !== 'NamespaceExists') {
        throw error;
      }
    }

    await db.collection('jobPosts').createIndex({ createdBy: 1 });
    await db.collection('jobPosts').createIndex({ assignedTo: 1 }, { sparse: true });
    await db.collection('jobPosts').createIndex({ category: 1 });
    await db.collection('jobPosts').createIndex({ status: 1 });
    await db.collection('jobPosts').createIndex({ createdAt: -1 });
    console.log('✓ Created indexes for jobPosts collection');

    // JobAcceptance collection
    try {
      await db.createCollection('jobAcceptance');
      console.log('✓ Created jobAcceptance collection');
    } catch (error: any) {
      if (error.codeName !== 'NamespaceExists') {
        throw error;
      }
    }

    await db.collection('jobAcceptance').createIndex({ jobId: 1 });
    await db.collection('jobAcceptance').createIndex({ userId: 1 });
    await db.collection('jobAcceptance').createIndex({ status: 1 });
    await db.collection('jobAcceptance').createIndex({ jobId: 1, userId: 1 }, { unique: true });
    console.log('✓ Created indexes for jobAcceptance collection');

    // Reviews collection
    try {
      await db.createCollection('reviews');
      console.log('✓ Created reviews collection');
    } catch (error: any) {
      if (error.codeName !== 'NamespaceExists') {
        throw error;
      }
    }

    await db.collection('reviews').createIndex({ reviewer: 1 });
    await db.collection('reviews').createIndex({ reviewee: 1 });
    await db.collection('reviews').createIndex({ jobId: 1 });
    await db.collection('reviews').createIndex({ jobId: 1, reviewer: 1 }, { unique: true });
    console.log('✓ Created indexes for reviews collection');

    console.log('✅ Database initialization completed successfully');
    return true;
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
}

export async function dropDatabase() {
  try {
    const client = await clientPromise;
    const db = client.db('jobapp');
    await db.dropDatabase();
    console.log('✓ Database dropped successfully');
  } catch (error) {
    console.error('Error dropping database:', error);
    throw error;
  }
}
