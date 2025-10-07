import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import ThemeToggler from '../custom/ThemeToggler';

const Burger = ({ open, setOpen }) => (
  <button
    onClick={() => setOpen(!open)}
    className="md:hidden p-2 rounded-lg hover:bg-white/10 dark:hover:bg-white/10 transition-colors"
    aria-label={open ? "Close menu" : "Open menu"}
  >
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-light-headings dark:text-dark-headings" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      {open ? (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
      )}
    </svg>
  </button>
);

const MobileMenuContent = ({ onClose, user, logout }) => (
  <div className="glass-panel">
    <div className="flex flex-col items-start p-2 space-y-3">
      <Link onClick={onClose} to="/dashboard" className="w-full">Dashboard</Link>
      <Link onClick={onClose} to="/chat" className="w-full">AI Chat</Link>
      <Link onClick={onClose} to="/assessments" className="w-full">Assessments</Link>
      <Link onClick={onClose} to="/games" className="w-full">Games</Link>
      <Link onClick={onClose} to="/progress" className="w-full">Progress</Link>
      <Link onClick={onClose} to="/profile" className="w-full">Profile</Link>

      <hr className="w-full border-white/20 dark:border-gray-700/50" />
      <span className="text-light-body dark:text-dark-body">{user?.name}</span>

      <button
        onClick={() => { logout(); onClose(); }}
        className="px-4 py-2 w-full rounded-lg bg-light-accent dark:bg-dark-accent text-white hover:opacity-90 transition-all"
      >
        Logout
      </button>
    </div>
  </div>
);

const Layout = () => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  // Render portal when menuOpen
  const mobileMenuPortal = () => {
    if (typeof document === 'undefined') return null;
    return createPortal(
      <div className="fixed inset-0 z-40 md:hidden" role="dialog" aria-modal="true">
        {/* backdrop overlay (click outside to close) */}
        <div className="glass-overlay" onClick={() => setMenuOpen(false)} />

        {/* menu panel on top of overlay */}
        <MobileMenuContent onClose={() => setMenuOpen(false)} user={user} logout={logout} />
      </div>,
      document.body
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar (use the .glass utility) */}
      <nav className="glass fixed top-0 left-0 right-0 z-50 border border-white/10 dark:border-white/10 shadow-lg p-4">
        <div className="relative max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-extrabold tracking-tight text-light-headings dark:text-dark-headings">
            <span className="inline-block transform will-change-transform [text-shadow:0_2px_12px_rgba(108,99,255,0.35)]">PsyMitrix</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/dashboard" className="hover:text-light-primary dark:hover:text-dark-primary">Dashboard</Link>
            <Link to="/chat" className="hover:text-light-primary dark:hover:text-dark-primary">AI Chat</Link>
            <Link to="/assessments" className="hover:text-light-primary dark:hover:text-dark-primary">Assessments</Link>
            <Link to="/games" className="hover:text-light-primary dark:hover:text-dark-primary">Games</Link>
            <Link to="/progress" className="hover:text-light-primary dark:hover:text-dark-primary">Progress</Link>
            <Link to="/profile" className="hover:text-light-primary dark:hover:text-dark-primary">Profile</Link>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            <ThemeToggler />
            <span className="hidden sm:block text-light-body dark:text-dark-body">{user?.name}</span>
            <button onClick={logout} className="hidden sm:block px-4 py-2 rounded-lg bg-light-accent dark:bg-dark-accent text-white hover:opacity-90 transition-all">Logout</button>
            <Burger open={menuOpen} setOpen={setMenuOpen} />
          </div>
        </div>
      </nav>

      {/* inject portal overlay/menu here */}
      {menuOpen && mobileMenuPortal()}

      {/* Main Content (with top padding to account for fixed nav) */}
      <main className="flex-grow pt-16">
        <Outlet />
      </main>

      {/* Footer (unchanged) */}
      <footer className="bg-white/20 dark:bg-white/5 backdrop-blur-xl border-t border-white/30 dark:border-white/10 shadow-lg p-8 mt-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-light-body dark:text-dark-body">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold text-light-headings dark:text-dark-headings mb-4">PsyMitrix</h3>
            <p className="text-sm">Your companion for mental well-being. Explore, learn, and grow.</p>
          </div>
          {/* Navigation */}
          <div>
            <h4 className="text-lg font-semibold text-light-headings dark:text-dark-headings mb-4">Navigation</h4>
            <ul className="space-y-2">
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/assessments">Assessments</Link></li>
              <li><Link to="/games">Games</Link></li>
              <li><Link to="/progress">Progress</Link></li>
              <li><Link to="/profile">Profile</Link></li>
            </ul>
          </div>
          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold text-light-headings dark:text-dark-headings mb-4">Support</h4>
            <ul className="space-y-2">
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/help">Help Center</Link></li>
            </ul>
          </div>
          {/* Legal */}
          <div>
            <h4 className="text-lg font-semibold text-light-headings dark:text-dark-headings mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms of Service</Link></li>
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
