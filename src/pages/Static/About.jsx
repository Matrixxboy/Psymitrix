import React from 'react';
import GlassCard from '../../components/ui/GlassCard';

const About = () => (
  <div className="min-h-screen p-6 md:p-10 bg-light-background dark:bg-dark-background">
    <div className="max-w-4xl mx-auto space-y-8">
      <GlassCard className="p-8 animate-fade-in-up">
        <h1 className="text-4xl font-extrabold text-light-headings dark:text-dark-headings mb-4 tracking-tight">
          About PsyMitrix
        </h1>
        <p className="text-lg text-light-body dark:text-dark-body leading-relaxed">
          PsyMitrix is a forward-thinking digital sanctuary designed to empower you on your journey toward mental well-being. We believe that understanding your mind is the first step to nurturing it. Our mission is to provide accessible, private, and empathetic tools that transform complex psychological metrics into clear, actionable insights.
        </p>
      </GlassCard>

      <div className="grid md:grid-cols-2 gap-8">
        <GlassCard className="p-8 animate-fade-in-up" style={{ animationDelay: '150ms' }}>
          <h2 className="text-2xl font-bold text-light-headings dark:text-dark-headings mb-3">Our Philosophy</h2>
          <p className="text-light-body dark:text-dark-body leading-relaxed">
            We are built on a foundation of privacy, empathy, and scientific rigor. Your data is yours alone, and our insights are grounded in established psychological principles. We aim to be a companion, not a replacement for professional help, offering a safe space for self-exploration and growth.
          </p>
        </GlassCard>
        <GlassCard className="p-8 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          <h2 className="text-2xl font-bold text-light-headings dark:text-dark-headings mb-3">Our Technology</h2>
          <p className="text-light-body dark:text-dark-body leading-relaxed">
            Leveraging cutting-edge visualization and data analysis, PsyMitrix helps you see patterns in your mood, habits, and cognitive functions. From interactive charts to personalized feedback, we turn self-reflection into an engaging and illuminating experience.
          </p>
        </GlassCard>
      </div>

      <GlassCard className="p-8 animate-fade-in-up" style={{ animationDelay: '450ms' }}>
        <h2 className="text-2xl font-bold text-light-headings dark:text-dark-headings mb-3">Meet the Team</h2>
        <p className="text-light-body dark:text-dark-body leading-relaxed">
          PsyMitrix was founded by a passionate group of developers, designers, and mental health advocates dedicated to making a positive impact. We are committed to continuous improvement and listening to our community to build a tool that truly serves your needs.
        </p>
      </GlassCard>
    </div>
  </div>
);

export default About;