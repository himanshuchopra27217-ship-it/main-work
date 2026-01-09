// MongoDB database integration
import clientPromise from './mongodb';
import type { User, UserProfile, JobPost } from './schemas';

// ============= PROFILE FUNCTIONS =============

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const client = await clientPromise;
    const db = client.db('jobapp');
    const profile = await db.collection('profiles').findOne({ userId });
    return profile as UserProfile | null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}

export async function createProfile(data: any): Promise<UserProfile> {
  try {
    const client = await clientPromise;
    const db = client.db('jobapp');
    const newProfile = {
      ...data,
      createdAt: new Date().toISOString(),
    };
    const result = await db.collection('profiles').insertOne(newProfile);
    console.log('✓ Profile created successfully');
    return { _id: result.insertedId, ...newProfile } as UserProfile;
  } catch (error) {
    console.error('Error creating profile:', error);
    throw error;
  }
}

export async function updateProfile(userId: string, data: any): Promise<UserProfile | null> {
  try {
    const client = await clientPromise;
    const db = client.db('jobapp');
    const result = await db.collection('profiles').findOneAndUpdate(
      { userId },
      { $set: { ...data, updatedAt: new Date().toISOString() } },
      { returnDocument: 'after' }
    );
    return result?.value as UserProfile | null;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
}

// ============= JOB FUNCTIONS =============

export async function getJobsByUser(userId: string): Promise<JobPost[]> {
  try {
    const client = await clientPromise;
    const db = client.db('jobapp');
    const jobs = await db.collection('jobPosts').find({ createdBy: userId }).toArray();
    return jobs as JobPost[];
  } catch (error) {
    console.error('Error fetching user jobs:', error);
    return [];
  }
}

export async function getAssignedJobsByUser(userId: string): Promise<JobPost[]> {
  try {
    const client = await clientPromise;
    const db = client.db('jobapp');
    const jobs = await db.collection('jobPosts').find({ assignedTo: userId }).toArray();
    return jobs as JobPost[];
  } catch (error) {
    console.error('Error fetching assigned jobs:', error);
    return [];
  }
}

export async function getAvailableJobsByCategory(category: string, userId: string): Promise<JobPost[]> {
  try {
    const client = await clientPromise;
    const db = client.db('jobapp');
    const jobs = await db.collection('jobPosts').find({
      category,
      status: 'open',
      createdBy: { $ne: userId }
    }).toArray();
    return jobs as JobPost[];
  } catch (error) {
    console.error('Error fetching available jobs:', error);
    return [];
  }
}

export async function createJob(jobData: any): Promise<JobPost> {
  try {
    const client = await clientPromise;
    const db = client.db('jobapp');
    const newJob = {
      ...jobData,
      status: 'open',
      acceptedCount: 0,
      acceptedBy: [],
      createdAt: new Date().toISOString(),
    };
    const result = await db.collection('jobPosts').insertOne(newJob);
    console.log('✓ Job created successfully');
    return { _id: result.insertedId, ...newJob } as JobPost;
  } catch (error) {
    console.error('Error creating job:', error);
    throw error;
  }
}

export async function updateJob(jobId: string, updates: any): Promise<JobPost | null> {
  try {
    const client = await clientPromise;
    const db = client.db('jobapp');
    const { ObjectId } = require('mongodb');
    const result = await db.collection('jobPosts').findOneAndUpdate(
      { _id: new ObjectId(jobId) },
      { $set: { ...updates, updatedAt: new Date().toISOString() } },
      { returnDocument: 'after' }
    );
    return result?.value as JobPost | null;
  } catch (error) {
    console.error('Error updating job:', error);
    throw error;
  }
}

export async function deleteJob(jobId: string): Promise<boolean> {
  try {
    const client = await clientPromise;
    const db = client.db('jobapp');
    const { ObjectId } = require('mongodb');
    const result = await db.collection('jobPosts').deleteOne({ _id: new ObjectId(jobId) });
    return result.deletedCount > 0;
  } catch (error) {
    console.error('Error deleting job:', error);
    throw error;
  }
}

// ============= USER FUNCTIONS =============

export const db = {
  // Find user by email
  findUserByEmail: async (email: string): Promise<User | null> => {
    try {
      const client = await clientPromise;
      const dbConnection = client.db('jobapp');
      const user = await dbConnection.collection('users').findOne({ email });
      return user as User | null;
    } catch (error) {
      console.error('Error finding user by email:', error);
      return null;
    }
  },

  // Find user by mobile
  findUserByMobile: async (mobile: string): Promise<User | null> => {
    try {
      const client = await clientPromise;
      const dbConnection = client.db('jobapp');
      const user = await dbConnection.collection('users').findOne({ mobile });
      return user as User | null;
    } catch (error) {
      console.error('Error finding user by mobile:', error);
      return null;
    }
  },

  // Find user by email or mobile
  findUserByEmailOrMobile: async (identifier: string): Promise<User | null> => {
    try {
      const client = await clientPromise;
      const dbConnection = client.db('jobapp');
      const user = await dbConnection.collection('users').findOne({
        $or: [{ email: identifier }, { mobile: identifier }]
      });
      return user as User | null;
    } catch (error) {
      console.error('Error finding user by email or mobile:', error);
      return null;
    }
  },

  // Find user by reset token
  findUserByResetToken: async (token: string): Promise<User | null> => {
    try {
      const client = await clientPromise;
      const dbConnection = client.db('jobapp');
      const user = await dbConnection.collection('users').findOne({
        resetToken: token,
        resetTokenExpiry: { $gt: Date.now() }
      });
      return user as User | null;
    } catch (error) {
      console.error('Error finding user by reset token:', error);
      return null;
    }
  },

  // Create new user
  createUser: async (user: User): Promise<User> => {
    try {
      const client = await clientPromise;
      const dbConnection = client.db('jobapp');
      const result = await dbConnection.collection('users').insertOne(user);
      console.log('✓ User created successfully');
      return { _id: result.insertedId, ...user } as User;
    } catch (error) {
      console.error('✗ Error creating user:', error);
      throw error;
    }
  },

  // Update user
  updateUser: async (id: string, updates: Partial<User>): Promise<User | null> => {
    try {
      const client = await clientPromise;
      const dbConnection = client.db('jobapp');
      const { ObjectId } = require('mongodb');
      const result = await dbConnection.collection('users').findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updates },
        { returnDocument: 'after' }
      );
      return result?.value as User | null;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  // Get all users
  getAllUsers: async (): Promise<User[]> => {
    try {
      const client = await clientPromise;
      const dbConnection = client.db('jobapp');
      const users = await dbConnection.collection('users').find({}).toArray();
      return users as User[];
    } catch (error) {
      console.error('Error fetching all users:', error);
      return [];
    }
  }
};
