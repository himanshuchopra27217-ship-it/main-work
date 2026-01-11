// lib/file-db.ts - Simple file-based database for development
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import type { User, UserProfile, JobPost } from './schemas';

const DB_DIR = path.join(process.cwd(), 'db');
const USERS_FILE = path.join(DB_DIR, 'users.json');
const PROFILES_FILE = path.join(DB_DIR, 'profiles.json');
const JOBS_FILE = path.join(DB_DIR, 'jobs.json');

// Ensure DB directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

// Helper functions
function readJSONFile(filePath: string): any[] {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify([], null, 2));
      return [];
    }
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading file:', error);
    return [];
  }
}

function writeJSONFile(filePath: string, data: any[]): void {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing file:', error);
  }
}

// Database functions
export const fileDb = {
  // User functions
  findUserByEmailOrMobile: async (identifier: string): Promise<User | null> => {
    const users = readJSONFile(USERS_FILE);
    const user = users.find((u: User) => u.email === identifier || u.mobile === identifier);
    return user || null;
  },

  findUserByEmail: async (email: string): Promise<User | null> => {
    const users = readJSONFile(USERS_FILE);
    const user = users.find((u: User) => u.email === email);
    return user || null;
  },

  findUserByMobile: async (mobile: string): Promise<User | null> => {
    const users = readJSONFile(USERS_FILE);
    const user = users.find((u: User) => u.mobile === mobile);
    return user || null;
  },

  findUserById: async (id: string): Promise<User | null> => {
    const users = readJSONFile(USERS_FILE);
    const user = users.find((u: User) => u._id === id);
    return user || null;
  },

  findUserByResetToken: async (token: string): Promise<User | null> => {
    const users = readJSONFile(USERS_FILE);
    const user = users.find((u: User) => u.resetToken === token && u.resetTokenExpiry && new Date(u.resetTokenExpiry) > new Date());
    return user || null;
  },

  createUser: async (userData: any): Promise<User> => {
    const users = readJSONFile(USERS_FILE);
    const newUser = {
      _id: Date.now().toString(),
      ...userData,
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    writeJSONFile(USERS_FILE, users);
    return newUser;
  },

  updateUser: async (id: string, updates: Partial<User>): Promise<User | null> => {
    const users = readJSONFile(USERS_FILE);
    const index = users.findIndex((u: User) => u._id === id);
    if (index === -1) return null;

    users[index] = { ...users[index], ...updates, updatedAt: new Date().toISOString() };
    writeJSONFile(USERS_FILE, users);
    return users[index];
  },

  // Profile functions
  getUserProfile: async (userId: string): Promise<UserProfile | null> => {
    const profiles = readJSONFile(PROFILES_FILE);
    const profile = profiles.find((p: UserProfile) => p.userId === userId);
    return profile || null;
  },

  createProfile: async (profileData: any): Promise<UserProfile> => {
    const profiles = readJSONFile(PROFILES_FILE);
    const newProfile = {
      _id: Date.now().toString(),
      ...profileData,
      createdAt: new Date().toISOString(),
    };
    profiles.push(newProfile);
    writeJSONFile(PROFILES_FILE, profiles);
    return newProfile;
  },

  updateProfile: async (userId: string, data: any): Promise<UserProfile | null> => {
    const profiles = readJSONFile(PROFILES_FILE);
    const index = profiles.findIndex((p: UserProfile) => p.userId === userId);
    if (index === -1) return null;

    profiles[index] = { ...profiles[index], ...data, updatedAt: new Date().toISOString() };
    writeJSONFile(PROFILES_FILE, profiles);
    return profiles[index];
  },

  // Job functions
  getAllAvailableJobs: async (excludeUserId?: string): Promise<JobPost[]> => {
    const jobs = readJSONFile(JOBS_FILE);
    return jobs.filter((job: JobPost) => job.status === 'open' && (!excludeUserId || job.createdBy !== excludeUserId));
  },

  createJob: async (jobData: any): Promise<JobPost> => {
    const jobs = readJSONFile(JOBS_FILE);
    const newJob = {
      _id: Date.now().toString(),
      ...jobData,
      status: 'open',
      createdAt: new Date().toISOString(),
    };
    jobs.push(newJob);
    writeJSONFile(JOBS_FILE, jobs);
    return newJob;
  },

  getJobById: async (id: string): Promise<JobPost | null> => {
    const jobs = readJSONFile(JOBS_FILE);
    const job = jobs.find((j: JobPost) => j._id === id);
    return job || null;
  },

  updateJob: async (id: string, data: any): Promise<JobPost | null> => {
    const jobs = readJSONFile(JOBS_FILE);
    const index = jobs.findIndex((j: JobPost) => j._id === id);
    if (index === -1) return null;

    jobs[index] = { ...jobs[index], ...data, updatedAt: new Date().toISOString() };
    writeJSONFile(JOBS_FILE, jobs);
    return jobs[index];
  },

  deleteJob: async (id: string): Promise<boolean> => {
    const jobs = readJSONFile(JOBS_FILE);
    const filteredJobs = jobs.filter((j: JobPost) => j._id !== id);
    if (filteredJobs.length === jobs.length) return false;

    writeJSONFile(JOBS_FILE, filteredJobs);
    return true;
  },

  // Additional functions for dashboard
  getJobsByUser: async (userId: string): Promise<JobPost[]> => {
    const jobs = readJSONFile(JOBS_FILE);
    return jobs.filter((job: JobPost) => job.createdBy === userId);
  },

  getAssignedJobsByUser: async (userId: string): Promise<JobPost[]> => {
    const jobs = readJSONFile(JOBS_FILE);
    return jobs.filter((job: JobPost) => job.assignedTo === userId);
  },

  getAvailableJobsByCategory: async (category: string, excludeUserId?: string): Promise<JobPost[]> => {
    const jobs = readJSONFile(JOBS_FILE);
    return jobs.filter((job: JobPost) => job.category === category && job.status === 'open' && (!excludeUserId || job.createdBy !== excludeUserId));
  },

  // Profile functions
  getAllProfiles: async (): Promise<UserProfile[]> => {
    const profiles = readJSONFile(PROFILES_FILE);
    return profiles;
  },
};