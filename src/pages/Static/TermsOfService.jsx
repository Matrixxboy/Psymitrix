import React from 'react';
import GlassCard from '../../components/ui/GlassCard';

const TermsOfService = () => (
  <div className="min-h-screen p-6 md:p-10">
    <div className="max-w-4xl mx-auto space-y-6">
      <GlassCard className="p-8 space-y-4">
        <h1 className="text-3xl font-bold text-light-headings dark:text-dark-headings">Terms of Service</h1>
        <p>By using PsyMitrix, you agree to use the app responsibly and acknowledge it is not a substitute for professional care.</p>
      </GlassCard>
    </div>
  </div>
);

export default TermsOfService;
