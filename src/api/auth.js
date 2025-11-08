import api from './index';

export const login = async (email, password) => {
  try {
    const response = await api.post(
      `/auth/login`,
      { email, password } // Send as JSON object
    );
    localStorage.setItem('authToken', response.data.data.access_token);
    localStorage.setItem('tokenType', response.data.data.token_type);
    return { success: true, data: response.data.data }; // Access data.data because of make_response wrapper
  } catch (error) {
    console.error("Login API error:", error);
    return { success: false, error: error.response?.data?.message || 'Login failed' }; // Access data.message
  }
};

export const register = async (email, username, password) => {
  try {
    const response = await api.post(
      `/auth/register`,
      { email, username, password }
    );
    localStorage.setItem('authToken', response.data.data.access_token);
    localStorage.setItem('tokenType', response.data.data.token_type);
    return { success: true, data: response.data.data };
  } catch (error) {
    return { success: false, error: error.response?.data?.message || 'Registration failed' };
  }
};

export const fetchUserProfile = async () => {
  try {
    const response = await api.get(`/user_crud/user/me`);
    return { success: true, data: JSON.parse(response.data.data) }; // Access data.data because of make_response wrapper
  } catch (error) {
    console.error("Fetch User Profile API error:", error);
    return { success: false, error: error.response?.data?.message || 'Failed to fetch user profile' };
  }
};


export const updateUserData = async (userData) => {
  try {
    const response = await api.put(
      `/user_crud/user/update`,
      userData // Send as JSON object
    );
    return { success: true, data: JSON.parse(response.data.data) }; // Access data.data because of make_response wrapper
  } catch (error) {
    console.error("Update User Data API error:", error);
    return { success: false, error: error.response?.data?.message || 'Failed to update user data' };
  }
}
