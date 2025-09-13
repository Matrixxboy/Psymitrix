import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/ui/Button';

const Home = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-app">
      <nav className="glass shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-semibold text-[var(--color-text)]">
                PsyMitrix
              </h1>
              <nav className="flex space-x-4">
                <Link to="/" className="text-[var(--color-primary)] font-medium">
                  Home
                </Link>
                <Link to="/dashboard" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)]">
                  Dashboard
                </Link>
                <Link to="/chat" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)]">
                  AI Chat
                </Link>
                <Link to="/assessments" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)]">
                  Assessments
                </Link>
                <Link to="/games" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)]">
                  Wellness Games
                </Link>
                <Link to="/profile" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)]">
                  Profile
                </Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-[var(--color-text-secondary)]">
                Welcome, {user?.name}
              </span>
              <Button variant="secondary" size="sm" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-[var(--color-text)] sm:text-5xl">
            Your AI Mental Health Companion
          </h2>
          <p className="mt-4 text-xl text-[var(--color-text-secondary)]">
            PsyMitrix provides personalized mental health support through AI-powered conversations, 
            assessments, and wellness activities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* AI Chat Feature */}
          <div className="glass glass-card">
            <div className="text-center">
              <div className="glass-button w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="text-xl font-semibold text-[var(--color-text)] mb-2">
                AI Psychiatrist Chat
              </h3>
              <p className="text-[var(--color-text-secondary)] mb-4">
                Have confidential conversations with our AI psychiatrist. Get support, 
                guidance, and coping strategies whenever you need them.
              </p>
              <Link to="/chat">
                <Button variant="primary" className="w-full">
                  Start Conversation
                </Button>
              </Link>
            </div>
          </div>

          {/* Mental Health Assessments */}
          <div className="glass glass-card">
            <div className="text-center">
              <div className="glass-button w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold text-[var(--color-text)] mb-2">
                Mental Health Assessments
              </h3>
              <p className="text-[var(--color-text-secondary)] mb-4">
                Take standardized assessments like PHQ-9 and GAD-7 to track your 
                mental health progress over time.
              </p>
              <Link to="/assessments">
                <Button variant="primary" className="w-full">
                  Take Assessment
                </Button>
              </Link>
            </div>
          </div>

          {/* Wellness Games */}
          <div className="glass glass-card">
            <div className="text-center">
              <div className="glass-button w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎮</span>
              </div>
              <h3 className="text-xl font-semibold text-[var(--color-text)] mb-2">
                Wellness Games
              </h3>
              <p className="text-[var(--color-text-secondary)] mb-4">
                Engage with interactive wellness activities including breathing exercises, 
                mood tracking, and gratitude practices.
              </p>
              <Link to="/games">
                <Button variant="primary" className="w-full">
                  Play Games
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="glass glass-card p-8">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
            Your Mental Health Journey
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-[var(--color-primary)]">7.2</div>
              <div className="text-sm text-[var(--color-text-secondary)]">Wellness Score</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[var(--color-success)]">15</div>
              <div className="text-sm text-[var(--color-text-secondary)]">Chat Sessions</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[var(--color-primary)]">8</div>
              <div className="text-sm text-[var(--color-text-secondary)]">Assessments Taken</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[var(--color-accent)]">23</div>
              <div className="text-sm text-[var(--color-text-secondary)]">Days Streak</div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <h3 className="text-2xl font-semibold text-[var(--color-text)] mb-4">
            Ready to Continue Your Mental Health Journey?
          </h3>
          <div className="flex justify-center space-x-4">
            <Link to="/dashboard">
              <Button variant="primary" size="lg">
                View Dashboard
              </Button>
            </Link>
            <Link to="/chat">
              <Button variant="secondary" size="lg">
                Start AI Chat
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
