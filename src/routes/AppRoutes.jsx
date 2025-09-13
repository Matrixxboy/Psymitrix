import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Login } from '../features/auth';
import Home from '../pages/Home';
import DashboardPage from '../pages/Dashboard/DashboardPage';
import ProfilePage from '../pages/Profile/ProfilePage';
import ChatPage from '../pages/Chat/ChatPage';
import AssessmentsPage from '../pages/Assessments/AssessmentsPage';
import GamesPage from '../pages/Games/GamesPage';
import ProgressPage from '../pages/Progress/ProgressPage';
import ThemeToggler from '../components/custom/ThemeToggler';
import Walkthrough from '../components/onboarding/Walkthrough';

// Protected Route wrapper component
const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }
  
  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

// Public Route wrapper (redirects to home if already logged in)
const PublicRoute = ({ children }) => {
  const { isLoggedIn, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }
  
  return !isLoggedIn ? children : <Navigate to="/" replace />;
};

const AppRoutes = () => {
  return (
    <>
      <ThemeToggler />
      <Walkthrough />
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } 
        />
        
        {/* Protected Routes */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/chat" 
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/assessments" 
          element={
            <ProtectedRoute>
              <AssessmentsPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/games" 
          element={
            <ProtectedRoute>
              <GamesPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/progress" 
          element={
            <ProtectedRoute>
              <ProgressPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } 
        />
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
