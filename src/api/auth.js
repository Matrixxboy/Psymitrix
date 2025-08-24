// Mock authentication API
export const authenticateUser = async (email, password) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Check credentials
  if (email === 'utsav@gmail.com' && password === '123') {
    return {
      success: true,
      data: {
        token: 'mock-jwt-token-12345',
        user: {
          id: 1,
          email: 'utsav@gmail.com',
          name: 'Utsav Lankapati',
          role: 'admin'
        }
      }
    };
  } else {
    return {
      success: false,
      error: 'Invalid email or password'
    };
  }
};
