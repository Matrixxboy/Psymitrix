import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import UserDetailsSection from './sections/UserDetailsSection';
import ChangePasswordSection from './sections/ChangePasswordSection';
import SettingsSection from './sections/SettingsSection';
import GlassCard from '../../components/ui/GlassCard';
import PersonalInformation from './sections/PeronalInformation';
import Button from '../../components/ui/Button';
import Breadcrumb from '../../components/ui/Breadcrumb';
import ReportPage from './ReportPage';
import { Link, Route, Routes } from 'react-router-dom';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="min-h-screen text-light-body dark:text-dark-body p-4 sm:p-6 lg:p-8 mt-[50px]">
      <main className="max-w-6xl mx-auto">
        <Breadcrumb />
        <div className="text-center my-12">
          <img src={`${user?.avatarUrl}`} alt="Avatar" className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-white/30 shadow-lg"/>
          <h1 className="text-4xl font-bold text-light-headings dark:text-dark-headings">{user?.name}</h1>
          <p className="mt-2 text-lg text-light-body dark:text-dark-body">Manage your profile and preferences</p>
        </div>

        <div className="flex justify-center border-b border-white/20 mb-8">
          <Link to="/profile" onClick={() => setActiveTab('profile')} className={`px-6 py-3 font-semibold ${activeTab === 'profile' ? 'text-light-primary dark:text-dark-primary border-b-2 border-light-primary dark:border-dark-primary' : 'text-light-body dark:text-dark-body'}`}>Profile</Link>
          <Link to="/profile/report" onClick={() => setActiveTab('report')} className={`px-6 py-3 font-semibold ${activeTab === 'report' ? 'text-light-primary dark:text-dark-primary border-b-2 border-light-primary dark:border-dark-primary' : 'text-light-body dark:text-dark-body'}`}>Report</Link>
        </div>

        <Routes>
          <Route path="/" element={<ProfileContent />} />
          <Route path="report" element={<ReportPage />} />
        </Routes>

      </main>
    </div>
  );
};

const ProfileContent = () => {
  const { logout } = useAuth();
  return (
    <>
      <div className="lg:col-span-2 ">
        <GlassCard className="p-6">
          <h3 className="text-xl font-semibold text-light-headings dark:text-dark-headings mb-6">Personal Information</h3>
          <PersonalInformation />
        </GlassCard>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-8">
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
        <Button onClick={logout} variant="danger" className='w-[20%]'>
          Logout
        </Button>
      </div>
    </>
  );
}

export default ProfilePage;