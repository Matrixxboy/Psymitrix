import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchUserProfile } from '../api/auth';

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
    
    const initializeAuth = async () => {
      if (storedToken && storedTokenType) {
        setToken(storedToken);
        setIsLoggedIn(true);
        try {
          const userProfileResult = await fetchUserProfile();
          if (userProfileResult.success) {
            setUser(userProfileResult.data);
          } else {
            console.error("Failed to fetch user profile on mount:", userProfileResult.error);
            // Optionally clear token if profile fetch fails
            localStorage.removeItem('authToken');
            localStorage.removeItem('tokenType');
            setIsLoggedIn(false);
            setToken(null);
          }
        } catch (error) {
          console.error("Error fetching user profile on mount:", error);
          // Optionally clear token if profile fetch fails
          localStorage.removeItem('authToken');
          localStorage.removeItem('tokenType');
          setIsLoggedIn(false);
          setToken(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (authToken) => {
    setToken(authToken);
    setIsLoggedIn(true);
    
    // Persist to localStorage
    localStorage.setItem('authToken', authToken);
    localStorage.setItem('tokenType', 'Bearer'); // Store token type

    // Fetch user profile immediately after login
    try {
      const userProfileResult = await fetchUserProfile();
      if (userProfileResult.success) {
        setUser(userProfileResult.data);
      } else {
        console.error("Failed to fetch user profile after login:", userProfileResult.error);
        // Handle error, maybe log out or show a message
      }
    } catch (error) {
      console.error("Error fetching user profile after login:", error);
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

