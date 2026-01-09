// Mock database storage
export const users: any[] = []
export const profiles: any[] = []
export const jobPosts: any[] = []

export async function getUserProfile(userId: string) {
  return profiles.find((p) => p.userId === userId) || null
}

export async function createProfile(data: any) {
  const newProfile = {
    id: Date.now().toString(),
    ...data,
    createdAt: new Date().toISOString(),
  }
  profiles.push(newProfile)
  return newProfile
}

export async function updateProfile(userId: string, data: any) {
  const index = profiles.findIndex((p) => p.userId === userId)
  if (index !== -1) {
    profiles[index] = { ...profiles[index], ...data, updatedAt: new Date().toISOString() }
    return profiles[index]
  }
  return null
}

export async function getJobsByUser(userId: string) {
  return jobPosts.filter((job) => job.createdBy === userId)
}

export async function getAssignedJobsByUser(userId: string) {
  return jobPosts.filter((job) => job.assignedTo === userId)
}

export async function getAvailableJobsByCategory(category: string, userId: string) {
  // Return jobs that match category, are open, and not created by current user
  return jobPosts.filter((job) => job.category === category && job.status === "open" && job.createdBy !== userId)
}


interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  password: string;
  resetToken?: string;
  resetTokenExpiry?: number;
  createdAt: string;
}

let users: User[] = [];

export const db = {
  findUserByEmail: (email: string) => users.find(u => u.email === email),
  findUserByMobile: (mobile: string) => users.find(u => u.mobile === mobile),
  findUserByEmailOrMobile: (identifier: string) => 
    users.find(u => u.email === identifier || u.mobile === identifier),
  findUserByResetToken: (token: string) => 
    users.find(u => u.resetToken === token && u.resetTokenExpiry! > Date.now()),
  createUser: (user: User) => {
    users.push(user);
    return user;
  },
  updateUser: (id: string, updates: Partial<User>) => {
    const index = users.findIndex(u => u.id === id);
    if (index !== -1) {
      users[index] = { ...users[index], ...updates };
      return users[index];
    }
    return null;
  },
  getAllUsers: () => users
};
