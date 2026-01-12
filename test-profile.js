// Test script to verify profile creation API
const testProfileCreation = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'test-user-123',
        categories: ['web-development', 'mobile-development'],
        role: 'worker',
        age: 25,
        mobile: '1234567890',
        bio: 'Test bio',
        skills: ['JavaScript', 'React']
      })
    });

    const result = await response.json();
    console.log('Response status:', response.status);
    console.log('Response data:', result);
  } catch (error) {
    console.error('Test failed:', error);
  }
};

testProfileCreation();