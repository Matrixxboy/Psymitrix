import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Login } from '../features/auth';
import Home from '../pages/Home';
import DashboardPage from '../pages/Dashboard/DashboardPage';
import ProfilePage from '../pages/Profile/ProfilePage';
import ChatPage from '../pages/Chat/ChatPage';
import AssessmentsPage from '../pages/Assessments/AssessmentsPage';
import GamesPage from '../pages/Games/GamesPage';
import ProgressPage from '../pages/Progress/ProgressPage';
import Layout from '../components/layout/Layout';
import Walkthrough from '../components/onboarding/Walkthrough';
import About from '../pages/Static/About';
import Contact from '../pages/Static/Contact';
import FAQ from '../pages/Static/FAQ';
import HelpCenter from '../pages/Static/HelpCenter';
import PrivacyPolicy from '../pages/Static/PrivacyPolicy';
import TermsOfService from '../pages/Static/TermsOfService';
import Info from '../pages/info';

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
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
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
        
        <Route 
          path="/info" 
          element={
              <Info />
          } 
        />
        
        {/* Protected Routes */}
        <Route element={<Layout />}>
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
            path="/profile/*" 
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />

          {/* Static Pages */}
          <Route 
            path="/about" 
            element={
              <ProtectedRoute>
                <About />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/contact" 
            element={
              <ProtectedRoute>
                <Contact />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/faq" 
            element={
              <ProtectedRoute>
                <FAQ />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/help" 
            element={
              <ProtectedRoute>
                <HelpCenter />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/privacy" 
            element={
              <ProtectedRoute>
                <PrivacyPolicy />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/terms" 
            element={
                <ProtectedRoute>
                  <TermsOfService />
                </ProtectedRoute>
            } 
          />
        </Route>
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
