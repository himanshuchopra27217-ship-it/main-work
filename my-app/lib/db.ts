// Database integration - supports file-based DB and MongoDB
import { fileDb } from './file-db';
import type { User, UserProfile, JobPost } from './schemas';

// Select provider: force Mongo when USE_MONGO=true, otherwise file DB in development
const useMongo = process.env.USE_MONGO === 'true' || process.env.NODE_ENV !== 'development';

// Lazy loader for Mongo client to avoid requiring env when not used
const getMongoClient = async () => (await import('./mongodb')).default;

export const db = !useMongo ? fileDb : {
  // MongoDB implementations for production
  findUserByEmailOrMobile: async (identifier: string): Promise<User | null> => {
    try {
      const client = await getMongoClient();
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

  findUserById: async (id: string): Promise<User | null> => {
    try {
      const client = await getMongoClient();
      const dbConnection = client.db('jobapp');
      const { ObjectId } = await import('mongodb');
      const user = await dbConnection.collection('users').findOne({ _id: new ObjectId(id) });
      return user as User | null;
    } catch (error) {
      console.error('Error finding user by ID:', error);
      return null;
    }
  },

  findUserByEmail: async (email: string): Promise<User | null> => {
    try {
      const client = await getMongoClient();
      const dbConnection = client.db('jobapp');
      const user = await dbConnection.collection('users').findOne({ email });
      return user as User | null;
    } catch (error) {
      console.error('Error finding user by email:', error);
      return null;
    }
  },

  findUserByMobile: async (mobile: string): Promise<User | null> => {
    try {
      const client = await getMongoClient();
      const dbConnection = client.db('jobapp');
      const user = await dbConnection.collection('users').findOne({ mobile });
      return user as User | null;
    } catch (error) {
      console.error('Error finding user by mobile:', error);
      return null;
    }
  },

  findUserByResetToken: async (token: string): Promise<User | null> => {
    try {
      const client = await getMongoClient();
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

  updateUser: async (id: string, updates: Partial<User>): Promise<User | null> => {
    try {
      const client = await getMongoClient();
      const dbConnection = client.db('jobapp');
      const { ObjectId } = await import('mongodb');
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

  createUser: async (userData: any): Promise<User> => {
    try {
      const client = await getMongoClient();
      const dbConnection = client.db('jobapp');
      const result = await dbConnection.collection('users').insertOne({
        ...userData,
        createdAt: new Date().toISOString(),
      });
      return { _id: result.insertedId, ...userData } as User;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  getUserProfile: async (userId: string): Promise<UserProfile | null> => {
    try {
      const client = await getMongoClient();
      const db = client.db('jobapp');
      const profile = await db.collection('profiles').findOne({ userId });
      return profile as UserProfile | null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  },

  createProfile: async (data: any): Promise<UserProfile> => {
    try {
      const client = await getMongoClient();
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
  },

  updateProfile: async (userId: string, data: any): Promise<UserProfile | null> => {
    try {
      const client = await getMongoClient();
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
  },

  getAllProfiles: async (): Promise<UserProfile[]> => {
    try {
      const client = await getMongoClient();
      const db = client.db('jobapp');
      const profiles = await db.collection('profiles').find({}).toArray();
      return profiles as UserProfile[];
    } catch (error) {
      console.error('Error fetching all profiles:', error);
      return [];
    }
  },

  getAllAvailableJobs: async (excludeUserId?: string): Promise<JobPost[]> => {
    try {
      const client = await getMongoClient();
      const db = client.db('jobapp');
      const query = excludeUserId ? { status: 'open', createdBy: { $ne: excludeUserId } } : { status: 'open' };
      const jobs = await db.collection('jobs').find(query).toArray();
      return jobs as JobPost[];
    } catch (error) {
      console.error('Error fetching jobs:', error);
      return [];
    }
  },

  createJob: async (jobData: any): Promise<JobPost> => {
    try {
      const client = await getMongoClient();
      const db = client.db('jobapp');
      const newJob = {
        ...jobData,
        status: 'open',
        createdAt: new Date().toISOString(),
      };
      const result = await db.collection('jobs').insertOne(newJob);
      return { _id: result.insertedId, ...newJob } as JobPost;
    } catch (error) {
      console.error('Error creating job:', error);
      throw error;
    }
  },

  getJobById: async (id: string): Promise<JobPost | null> => {
    try {
      const client = await getMongoClient();
      const db = client.db('jobapp');
      const { ObjectId } = await import('mongodb');
      const job = await db.collection('jobs').findOne({ _id: new ObjectId(id) });
      return job as JobPost | null;
    } catch (error) {
      console.error('Error fetching job:', error);
      return null;
    }
  },

  updateJob: async (id: string, data: any): Promise<JobPost | null> => {
    try {
      const client = await getMongoClient();
      const db = client.db('jobapp');
      const { ObjectId } = await import('mongodb');
      const result = await db.collection('jobs').findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { ...data, updatedAt: new Date().toISOString() } },
        { returnDocument: 'after' }
      );
      return result?.value as JobPost | null;
    } catch (error) {
      console.error('Error updating job:', error);
      throw error;
    }
  },
  deleteJob: async (id: string): Promise<boolean> => {
    try {
      const client = await getMongoClient();
      const db = client.db('jobapp');
      const { ObjectId } = await import('mongodb');
      const result = await db.collection('jobs').deleteOne({ _id: new ObjectId(id) });
      return result.deletedCount > 0;
    } catch (error) {
      console.error('Error deleting job:', error);
      return false;
    }
  },
  getJobsByUser: async (userId: string): Promise<JobPost[]> => {
    try {
      const client = await getMongoClient();
      const db = client.db('jobapp');
      const jobs = await db.collection('jobs').find({ createdBy: userId }).toArray();
      return jobs as JobPost[];
    } catch (error) {
      console.error('Error fetching jobs by user:', error);
      return [];
    }
  },

  getAssignedJobsByUser: async (userId: string): Promise<JobPost[]> => {
    try {
      const client = await getMongoClient();
      const db = client.db('jobapp');
      const jobs = await db.collection('jobs').find({ assignedTo: userId }).toArray();
      return jobs as JobPost[];
    } catch (error) {
      console.error('Error fetching assigned jobs by user:', error);
      return [];
    }
  },

  getAvailableJobsByCategory: async (category: string, excludeUserId?: string): Promise<JobPost[]> => {
    try {
      const client = await getMongoClient();
      const db = client.db('jobapp');
      const query = excludeUserId 
        ? { category, status: 'open', createdBy: { $ne: excludeUserId } } 
        : { category, status: 'open' };
      const jobs = await db.collection('jobs').find(query).toArray();
      return jobs as JobPost[];
    } catch (error) {
      console.error('Error fetching available jobs by category:', error);
      return [];
    }
  },
};

// Named exports for backward compatibility
export const findUserByEmailOrMobile = db.findUserByEmailOrMobile;
export const findUserByEmail = db.findUserByEmail;
export const findUserByMobile = db.findUserByMobile;
export const findUserById = db.findUserById;
export const findUserByResetToken = db.findUserByResetToken;
export const createUser = db.createUser;
export const updateUser = db.updateUser;
export const getUserProfile = db.getUserProfile;
export const createProfile = db.createProfile;
export const updateProfile = db.updateProfile;
export const getAllProfiles = db.getAllProfiles;
export const getAllAvailableJobs = db.getAllAvailableJobs;
export const createJob = db.createJob;
export const getJobById = db.getJobById;
export const updateJob = db.updateJob;
export const deleteJob = db.deleteJob;
export const getJobsByUser = db.getJobsByUser;
export const getAssignedJobsByUser = db.getAssignedJobsByUser;
export const getAvailableJobsByCategory = db.getAvailableJobsByCategory;
