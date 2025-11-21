import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './providers/AuthProvider';
import { ThemeProvider } from './providers/ThemeProvider';
import AppRoutes from './routes/AppRoutes';
import { Toaster } from 'react-hot-toast';
import CustomCursor from './components/custom/CustomCursor';

function App() {
  return (
    <ThemeProvider>
      <CustomCursor />
      <AuthProvider>
        <div className="min-h-screen">
          <BrowserRouter
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true
            }}
          >
            <Toaster position="top-center" reverseOrder={false} />
            <AppRoutes />
          </BrowserRouter>
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
