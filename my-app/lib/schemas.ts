// MongoDB Schema Types and Interfaces

// ============= USER SCHEMA =============
export interface User {
  _id?: any; // MongoDB ObjectId
  id?: string;
  name: string;
  email: string;
  mobile: string;
  password: string; // Hashed password
  resetToken?: string;
  resetTokenExpiry?: number;
  createdAt: string;
  updatedAt?: string;
}

// ============= PROFILE SCHEMA =============
export interface UserProfile {
  _id?: any; // MongoDB ObjectId
  userId: string; // Reference to User._id
  category: string; // Job category (Plumber, Electrician, Developer, etc.)
  age?: number;
  mobile?: string;
  profilePhoto?: string; // URL or file path
  bio?: string;
  skills?: string[];
  experience?: number; // Years of experience
  rating?: number; // 0-5 rating
  reviewCount?: number;
  isVerified?: boolean;
  createdAt: string;
  updatedAt?: string;
}

// ============= JOB POST SCHEMA =============
export interface JobPost {
  _id?: any; // MongoDB ObjectId
  id?: string;
  title: string;
  description: string;
  category: string; // Job category
  createdBy: string; // Reference to User._id (Job creator)
  assignedTo?: string; // Reference to User._id (Assigned worker)
  status: 'open' | 'assigned' | 'completed' | 'cancelled';
  budget?: number;
  location?: string;
  priority?: 'low' | 'medium' | 'high';
  acceptedCount?: number; // Number of workers who accepted the job
  acceptedBy?: string[]; // Array of User._ids who accepted the job
  createdAt: string;
  updatedAt?: string;
  completedAt?: string;
}

// ============= JOB ACCEPTANCE SCHEMA =============
export interface JobAcceptance {
  _id?: any; // MongoDB ObjectId
  jobId: string; // Reference to JobPost._id
  userId: string; // Reference to User._id (Worker who accepted)
  acceptedAt: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  quote?: number; // Optional quote from worker
  message?: string; // Optional message from worker
  createdAt: string;
  updatedAt?: string;
}

// ============= REVIEW SCHEMA =============
export interface Review {
  _id?: any; // MongoDB ObjectId
  jobId: string; // Reference to JobPost._id
  reviewer: string; // Reference to User._id (Person writing review)
  reviewee: string; // Reference to User._id (Person being reviewed)
  rating: number; // 1-5 rating
  comment: string;
  createdAt: string;
  updatedAt?: string;
}

// ============= DATABASE COLLECTION SCHEMA FOR VALIDATION =============
export const mongoDBCollections = {
  users: {
    name: 'users',
    indexes: [
      { key: { email: 1 }, unique: true },
      { key: { mobile: 1 }, unique: true },
      { key: { resetToken: 1 }, sparse: true }
    ]
  },
  profiles: {
    name: 'profiles',
    indexes: [
      { key: { userId: 1 }, unique: true },
      { key: { category: 1 } },
      { key: { isVerified: 1 } }
    ]
  },
  jobPosts: {
    name: 'jobPosts',
    indexes: [
      { key: { createdBy: 1 } },
      { key: { assignedTo: 1 }, sparse: true },
      { key: { category: 1 } },
      { key: { status: 1 } },
      { key: { createdAt: -1 } }
    ]
  },
  jobAcceptance: {
    name: 'jobAcceptance',
    indexes: [
      { key: { jobId: 1 } },
      { key: { userId: 1 } },
      { key: { status: 1 } },
      { key: { jobId: 1, userId: 1 }, unique: true }
    ]
  },
  reviews: {
    name: 'reviews',
    indexes: [
      { key: { reviewer: 1 } },
      { key: { reviewee: 1 } },
      { key: { jobId: 1 } },
      { key: { jobId: 1, reviewer: 1 }, unique: true }
    ]
  }
};

// ============= TYPE EXPORTS FOR API RESPONSES =============
export type UserResponse = Omit<User, 'password'>;
export type ProfileResponse = UserProfile;
export type JobPostResponse = JobPost;
