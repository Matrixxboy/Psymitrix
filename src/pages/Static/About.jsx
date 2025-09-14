import React from 'react';
import GlassCard from '../../components/ui/GlassCard';

const About = () => (
  <div className="min-h-screen p-6 md:p-10">
    <div className="max-w-4xl mx-auto space-y-6">
      <GlassCard className="p-8">
        <h1 className="text-3xl font-bold text-light-headings dark:text-dark-headings mb-4">About Us</h1>
        <p className="leading-relaxed">PsyMitrix is focused on helping you understand and improve your mental well-being with privacy, empathy, and science-backed insights.</p>
      </GlassCard>
    </div>
  </div>
);

export default About;
