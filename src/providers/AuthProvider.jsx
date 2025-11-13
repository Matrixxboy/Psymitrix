import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchUserProfile , updateUserData  } from '../api/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null); // User data will be fetched separately after login
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for stored auth data on mount and fetch user profile
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedTokenType = localStorage.getItem('tokenType');
    console.log("AuthProvider: Initializing auth. Stored token:", storedToken ? "Exists" : "None");
    
    const initializeAuth = async () => {
      if (storedToken && storedTokenType) {
        setToken(storedToken);
        setIsLoggedIn(true);
        console.log("AuthProvider: Token found, fetching user profile...");
        try {
          const userProfileResult = await fetchUserProfile();
          console.log("AuthProvider: fetchUserProfile result on mount:", userProfileResult);
          if (userProfileResult.success) {
            setUser(userProfileResult.data);
          } else {
            console.error("AuthProvider: Failed to fetch user profile on mount:", userProfileResult.error);
            // Optionally clear token if profile fetch fails
            localStorage.removeItem('authToken');
            localStorage.removeItem('tokenType');
            setIsLoggedIn(false);
            setToken(null);
          }
        } catch (error) {
          console.error("AuthProvider: Error fetching user profile on mount:", error);
          // Optionally clear token if profile fetch fails
          localStorage.removeItem('authToken');
          localStorage.removeItem('tokenType');
          setIsLoggedIn(false);
          setToken(null);
        }
      }
      setLoading(false);
      console.log("AuthProvider: Initialization complete. LoggedIn:", isLoggedIn);
    };

    initializeAuth();
  }, []);

  const login = async (authToken) => {
    console.log("AuthProvider: Login function called with token:", authToken ? "Exists" : "None");
    setToken(authToken);
    setIsLoggedIn(true);
    
    // Persist to localStorage
    localStorage.setItem('authToken', authToken);
    localStorage.setItem('tokenType', 'Bearer'); // Store token type
    console.log("AuthProvider: Token stored in localStorage.");

    // Fetch user profile immediately after login
    try {
      const userProfileResult = await fetchUserProfile();
      console.log("AuthProvider: fetchUserProfile result after login:", userProfileResult);
      if (userProfileResult.success) {
        setUser(userProfileResult.data);
      } else {
        console.error("AuthProvider: Failed to fetch user profile after login:", userProfileResult.error);
        // Handle error, maybe log out or show a message
      }
    } catch (error) {
      console.error("AuthProvider: Error fetching user profile after login:", error);
    }
  };

  const updateUser = async (userData) => {
    try {
      const updateResult = await updateUserData(userData);
      if (updateResult.success) {
        setUser(updateResult.data);
        return { success: true };
      } else {
        console.error("Failed to update user data:", updateResult.error);
        return { success: false, error: updateResult.error };
      }
    } catch (error) {
      console.error("Error updating user data:", error);
      return { success: false, error: 'An error occurred while updating user data' };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setIsLoggedIn(false);
    
    // Clear localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('tokenType');
  };

  const value = {
    isLoggedIn,
    user,
    token,
    loading,
    login,
    updateUser,
    logout
  };


  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};



