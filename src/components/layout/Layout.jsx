import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../providers/ThemeProvider';
import ThemeToggler from '../custom/ThemeToggler';

const Layout = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-light-background dark:bg-dark-background text-light-body dark:text-dark-body">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/20 dark:bg-white/5 backdrop-blur-xl border-b border-white/30 dark:border-white/10 shadow-lg p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-light-headings dark:text-dark-headings">
            PsyMitrix
          </Link>
          <div className="flex items-center space-x-6">
            <Link to="/dashboard" className="text-light-body dark:text-dark-body hover:text-light-primary dark:hover:text-dark-primary transition-colors">
              Dashboard
            </Link>
            <Link to="/chat" className="text-light-body dark:text-dark-body hover:text-light-primary dark:hover:text-dark-primary transition-colors">
              AI Chat
            </Link>
            <Link to="/assessments" className="text-light-body dark:text-dark-body hover:text-light-primary dark:hover:text-dark-primary transition-colors">
              Assessments
            </Link>
            <Link to="/games" className="text-light-body dark:text-dark-body hover:text-light-primary dark:hover:text-dark-primary transition-colors">
              Games
            </Link>
            <Link to="/progress" className="text-light-body dark:text-dark-body hover:text-light-primary dark:hover:text-dark-primary transition-colors">
              Progress
            </Link>
            <Link to="/profile" className="text-light-body dark:text-dark-body hover:text-light-primary dark:hover:text-dark-primary transition-colors">
              Profile
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggler />
            <span className="text-light-body dark:text-dark-body">{user?.name}</span>
            <button onClick={logout} className="px-4 py-2 rounded-lg bg-light-accent dark:bg-dark-accent text-white hover:opacity-90 transition-all">
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow pt-16">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white/20 dark:bg-white/5 backdrop-blur-xl border-t border-white/30 dark:border-white/10 shadow-lg p-8 mt-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-light-body dark:text-dark-body">
          {/* Brand and Description */}
          <div>
            <h3 className="text-2xl font-bold text-light-headings dark:text-dark-headings mb-4">PsyMitrix</h3>
            <p className="text-sm">Your companion for mental well-being. Explore, learn, and grow.</p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-lg font-semibold text-light-headings dark:text-dark-headings mb-4">Navigation</h4>
            <ul className="space-y-2">
              <li><Link to="/dashboard" className="hover:text-light-primary dark:hover:text-dark-primary transition-colors">Dashboard</Link></li>
              <li><Link to="/assessments" className="hover:text-light-primary dark:hover:text-dark-primary transition-colors">Assessments</Link></li>
              <li><Link to="/games" className="hover:text-light-primary dark:hover:text-dark-primary transition-colors">Games</Link></li>
              <li><Link to="/progress" className="hover:text-light-primary dark:hover:text-dark-primary transition-colors">Progress</Link></li>
              <li><Link to="/profile" className="hover:text-light-primary dark:hover:text-dark-primary transition-colors">Profile</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold text-light-headings dark:text-dark-headings mb-4">Support</h4>
            <ul className="space-y-2">
              <li><Link to="/contact" className="hover:text-light-primary dark:hover:text-dark-primary transition-colors">Contact Us</Link></li>
              <li><Link to="/faq" className="hover:text-light-primary dark:hover:text-dark-primary transition-colors">FAQ</Link></li>
              <li><Link to="/help" className="hover:text-light-primary dark:hover:text-dark-primary transition-colors">Help Center</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-lg font-semibold text-light-headings dark:text-dark-headings mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><Link to="/privacy" className="hover:text-light-primary dark:hover:text-dark-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-light-primary dark:hover:text-dark-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/10 text-center text-sm">
          © {new Date().getFullYear()} PsyMitrix. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Layout;
