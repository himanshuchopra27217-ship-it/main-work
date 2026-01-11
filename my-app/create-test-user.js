// create-test-user.js - Create a test user in the file-based database
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

async function createTestUser() {
  const DB_DIR = path.join(process.cwd(), 'db');
  const USERS_FILE = path.join(DB_DIR, 'users.json');
  const PROFILES_FILE = path.join(DB_DIR, 'profiles.json');

  // Ensure DB directory exists
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash('Sunil@123', 10);

  const user = {
    _id: '1',
    name: 'Himanshu Chopra',
    email: 'himanshuchopra27217@gmail.com',
    mobile: '1234567890',
    password: hashedPassword,
    createdAt: new Date().toISOString(),
  };

  // Read existing users
  let users = [];
  if (fs.existsSync(USERS_FILE)) {
    users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
  }

  // Check if user already exists
  const existingUser = users.find((u) => u.email === user.email);
  if (existingUser) {
    console.log('User already exists');
    return;
  }

  // Add user
  users.push(user);
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  console.log('✓ User created successfully');

  // Create profile
  let profiles = [];
  if (fs.existsSync(PROFILES_FILE)) {
    profiles = JSON.parse(fs.readFileSync(PROFILES_FILE, 'utf8'));
  }

  const profile = {
    _id: '1',
    userId: user._id,
    role: 'worker',
    category: 'Web Developer',
    age: 25,
    mobile: '1234567890',
    createdAt: new Date().toISOString(),
  };

  profiles.push(profile);
  fs.writeFileSync(PROFILES_FILE, JSON.stringify(profiles, null, 2));
  console.log('✓ Profile created successfully');

  console.log('Test user credentials:');
  console.log('Email: himanshuchopra27217@gmail.com');
  console.log('Password: Sunil@123');
}

createTestUser().catch(console.error);