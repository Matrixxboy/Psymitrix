import React from 'react';
import GlassCard from '../../components/ui/GlassCard';

const Contact = () => (
  <div className="min-h-screen p-6 md:p-10">
    <div className="max-w-4xl mx-auto space-y-6">
      <GlassCard className="p-8 space-y-4">
        <h1 className="text-3xl font-bold text-light-headings dark:text-dark-headings">Contact Us</h1>
        <p>Have questions or feedback? Reach us at support@psymitrix.app</p>
        <p className="text-sm opacity-80">Response time: 1-2 business days.</p>
      </GlassCard>
    </div>
  </div>
);

export default Contact;
