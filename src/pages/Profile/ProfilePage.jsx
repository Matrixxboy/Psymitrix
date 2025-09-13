import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import UserDetailsSection from './sections/UserDetailsSection';
import ChangePasswordSection from './sections/ChangePasswordSection';
import SettingsSection from './sections/SettingsSection';
import GlassCard from '../../components/ui/GlassCard';

const ProfilePage = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen  text-light-body dark:text-dark-body p-4 sm:p-6 lg:p-8">
      <main className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`} alt="Avatar" className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-white/30 shadow-lg"/>
          <h1 className="text-4xl font-bold text-light-headings dark:text-dark-headings">{user?.name}</h1>
          <p className="mt-2 text-lg text-light-body dark:text-dark-body">Manage your profile and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-8">
            <GlassCard className="p-6">
              <UserDetailsSection />
            </GlassCard>
            <GlassCard className="p-6">
              <ChangePasswordSection />
            </GlassCard>
          </div>

          <div className="lg:col-span-2">
            <GlassCard className="p-6">
              <h3 className="text-xl font-semibold text-light-headings dark:text-dark-headings mb-6">Settings</h3>
              <SettingsSection />
            </GlassCard>
          </div>
        </div>

        <div className="mt-12 text-center">
            <button onClick={logout} className="font-semibold text-light-accent dark:text-dark-accent hover:underline">
              Logout
            </button>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
