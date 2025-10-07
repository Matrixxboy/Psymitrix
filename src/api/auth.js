import appData from '../data/appData.json';

// Mock authentication API
export const authenticateUser = async (email, password) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  const user = appData.user;

  // Check credentials (in a real app, use a secure password comparison)
  if (email === user.email && password === user.passwordHash) { // Using a placeholder password
    return {
      success: true,
      data: {
        token: 'mock-jwt-token-12345',
        user: user,
      },
    };
  } else {
    return {
      success: false,
      error: 'Invalid email or password',
    };
  }
};