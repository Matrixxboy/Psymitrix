import React from 'react';
import GlassCard from '../../components/ui/GlassCard';

const HelpCenter = () => (
  <div className="min-h-screen p-6 md:p-10">
    <div className="max-w-4xl mx-auto space-y-6">
      <GlassCard className="p-8 space-y-4">
        <h1 className="text-3xl font-bold text-light-headings dark:text-dark-headings">Help Center</h1>
        <p>Browse topics, tips, and guides to get the most out of PsyMitrix.</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Getting started</li>
          <li>Tracking your progress</li>
          <li>Taking assessments</li>
        </ul>
      </GlassCard>
    </div>
  </div>
);

export default HelpCenter;
