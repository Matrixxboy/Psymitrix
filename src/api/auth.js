import api from '../api';

export const login = async (email, password) => {
  try {
    const response = await api.post(
      `/auth/login`,
      { email, password } // Send as JSON object
    );
    return { success: true, data: response.data.data }; // Access data.data because of make_response wrapper
  } catch (error) {
    console.error("Login API error:", error);
    return { success: false, error: error.response?.data?.message || 'Login failed' }; // Access data.message
  }
};

export const fetchUserProfile = async () => {
  try {
    const response = await api.get(`/user_crud/user/me`);
    console.log("Fetch User Profile response:", response);
    return { success: true, data: JSON.parse(response.data.data) }; // Access data.data because of make_response wrapper
  } catch (error) {
    console.error("Fetch User Profile API error:", error);
    return { success: false, error: error.response?.data?.message || 'Failed to fetch user profile' };
  }
};