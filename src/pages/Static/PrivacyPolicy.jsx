import React from 'react';
import GlassCard from '../../components/ui/GlassCard';

const PrivacyPolicy = () => (
  <div className="min-h-screen p-6 md:p-10">
    <div className="max-w-4xl mx-auto space-y-6">
      <GlassCard className="p-8 space-y-4">
        <h1 className="text-3xl font-bold text-light-headings dark:text-dark-headings">Privacy Policy</h1>
        <p>We respect your privacy. Data is stored locally unless you opt-in to sync. We do not sell personal data.</p>
      </GlassCard>
    </div>
  </div>
);

export default PrivacyPolicy;
