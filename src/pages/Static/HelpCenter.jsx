import React from 'react';
import GlassCard from '../../components/ui/GlassCard';

const helpTopics = [
  {
    title: 'Getting Started',
    description: 'Learn how to set up your profile, take your first assessment, and begin tracking your mood and habits.',
    icon: '🚀'
  },
  {
    title: 'Understanding Your Dashboard',
    description: 'A guide to the charts and metrics on your dashboard, including mood trends, wellness balance, and activity logs.',
    icon: '📊'
  },
  {
    title: 'Taking Assessments',
    description: 'Find out more about the different assessments available, what they measure, and how to interpret your results.',
    icon: '📝'
  },
  {
    title: 'Using the AI Chat',
    description: 'Tips for interacting with the AI companion for guided journaling, reflections, and exploring your thoughts.',
    icon: '🤖'
  },
  {
    title: 'Mindful Games & Exercises',
    description: 'Explore our collection of games and exercises designed to promote relaxation, focus, and cognitive flexibility.',
    icon: '🧠'
  },
  {
    title: 'Data Privacy & Security',
    description: 'Understand how your data is stored and protected, and learn about our commitment to your privacy.',
    icon: '🔒'
  },
];

const HelpCenter = () => (
  <div className="min-h-screen p-6 md:p-10 bg-light-background dark:bg-dark-background">
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-light-headings dark:text-dark-headings tracking-tight">Help Center</h1>
        <p className="mt-3 text-lg text-light-body dark:text-dark-body">Your guide to making the most of PsyMitrix.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {helpTopics.map((topic, index) => (
          <GlassCard key={index} className="p-6 flex items-start gap-5 animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
            <div className="text-3xl">{topic.icon}</div>
            <div>
              <h3 className="font-semibold text-xl text-light-headings dark:text-dark-headings mb-2">{topic.title}</h3>
              <p className="text-light-body dark:text-dark-body leading-relaxed">{topic.description}</p>
            </div>
          </GlassCard>
        ))}
      </div>

      <div className="text-center mt-12">
        <p className="text-light-body dark:text-dark-body">Can't find what you're looking for?</p>
        <a href="/contact" className="font-semibold text-light-primary dark:text-dark-primary hover:underline mt-1">
          Contact Support
        </a>
      </div>
    </div>
  </div>
);

export default HelpCenter;