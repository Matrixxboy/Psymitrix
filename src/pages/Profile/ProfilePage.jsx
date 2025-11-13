import React, { useState, useEffect } from 'react';
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
import axios from 'axios';
import { Upload, Loader, CheckCircle, AlertCircle } from 'lucide-react';

const ProfilePage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(null);


  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setUploadError(null);
      setUploadSuccess(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadError("Please select a file to upload.");
      return;
    }

    setUploading(true);
    setUploadError(null);
    setUploadSuccess(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const token = localStorage.getItem('authToken'); // Assuming token is stored in localStorage
      const response = await axios.post(
        '/api/v1/user_crud/user/profile-picture',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      console.log("Upload response:", response.data);
      if (response.data["http_status"] === 200) {
        setUploadSuccess("Profile picture updated successfully!");
      }
      setSelectedFile(null);
      fetchUser(); // Refresh user data to get the new profile picture URL
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      setUploadError(error.response?.data?.message || "Failed to upload profile picture.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen text-light-body dark:text-dark-body p-4 sm:p-6 lg:p-8 mt-[50px]">
      <main className="max-w-6xl mx-auto">
        <Breadcrumb />
        <div className="text-center my-12">
          <img src={user?.profile_picture_url || "https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1906669723.jpg"} alt="Avatar" className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-white/30 shadow-lg object-cover"/>
          
          {/* Profile Picture Upload Section */}
          <div className="mt-4 flex flex-col items-center">
            <input
              type="file"
              id="profile-picture-upload"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <label
              htmlFor="profile-picture-upload"
              className="cursor-pointer bg-light-accent dark:bg-dark-accent text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-light-primary dark:hover:bg-dark-primary transition-colors"
            >
              <Upload size={18} />
              {selectedFile ? selectedFile.name : "Change Profile Picture"}
            </label>
            {selectedFile && (
              <Button
                onClick={handleUpload}
                disabled={uploading}
                className="mt-2 px-6 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors flex items-center gap-2"
              >
                {uploading ? <Loader size={18} className="animate-spin" /> : <CheckCircle size={18} />}
                {uploading ? "Uploading..." : "Upload"}
              </Button>
            )}

            {uploadSuccess && (
              <div className="mt-2 text-green-500 flex items-center gap-1">
                <CheckCircle size={16} /> {uploadSuccess}
              </div>
            )}
            {uploadError && (
              <div className="mt-2 text-red-500 flex items-center gap-1">
                <AlertCircle size={16} /> {uploadError}
              </div>
            )}
          </div>

          <h1 className="text-4xl font-bold text-light-headings dark:text-dark-headings mt-8">{user?.firstName} {user?.lastName}</h1>
          <p className="mt-2 text-lg text-light-body dark:text-dark-body">Manage your profile and preferences</p>
        </div>
        
        <div className="flex justify-center border-b border-gray-300/70 dark:border-white/30 mb-8">
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
          {/* <h3 className="text-xl font-semibold text-light-headings dark:text-dark-headings mb-6">Personal Information</h3> */}
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