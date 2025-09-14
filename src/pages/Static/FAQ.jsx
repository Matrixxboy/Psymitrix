import React, { useState } from 'react';
import GlassCard from '../../components/ui/GlassCard';

const faqs = [
  {
    q: 'What is PsyMitrix?',
    a: 'PsyMitrix is a personal mental well-being companion. It helps you track your mood, complete self-assessments, and engage in mindful activities to gain a better understanding of your mental landscape.'
  },
  {
    q: 'Is my data private and secure?',
    a: 'Absolutely. Privacy is at the core of our design. All your data is stored locally on your device by default. We do not have access to your personal entries or assessment results.'
  },
  {
    q: 'How often should I use the app?',
    a: 'Consistency is key for meaningful insights. We recommend a brief daily check-in to track your mood and habits, and completing a full assessment weekly or bi-weekly to monitor your progress over time.'
  },
  {
    q: 'Can PsyMitrix replace therapy?',
    a: 'No. PsyMitrix is designed to be a tool for self-reflection and awareness. It is not a substitute for professional medical advice, diagnosis, or treatment. If you are in crisis, please contact a mental health professional.'
  },
  {
    q: 'What kind of assessments are available?',
    a: 'We offer a range of assessments based on clinically-validated questionnaires (like GAD-7 for anxiety and PHQ-9 for depression) to help you screen for common mental health concerns.'
  },
  {
    q: 'How is my progress measured?',
    a: 'Your progress is visualized through charts and metrics that track your mood trends, habit consistency, assessment scores, and personal achievements over time, helping you identify patterns and celebrate growth.'
  },
];

const FaqItem = ({ faq }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-white/20 dark:border-white/10 py-5">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left"
      >
        <h3 className="font-semibold text-lg text-light-headings dark:text-dark-headings">{faq.q}</h3>
        <span className={`transform transition-transform duration-300 ${isOpen ? 'rotate-45' : 'rotate-0'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        </span>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 mt-4' : 'max-h-0'}`}>
        <p className="text-light-body dark:text-dark-body leading-relaxed">
          {faq.a}
        </p>
      </div>
    </div>
  );
};

const FAQ = () => (
  <div className="min-h-screen p-6 md:p-10 bg-light-background dark:bg-dark-background">
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-light-headings dark:text-dark-headings tracking-tight">Frequently Asked Questions</h1>
        <p className="mt-3 text-lg text-light-body dark:text-dark-body">Find answers to common questions about PsyMitrix.</p>
      </div>
      <GlassCard className="p-8 animate-fade-in-up">
        <div className="space-y-2">
          {faqs.map((item, idx) => (
            <FaqItem key={idx} faq={item} />
          ))}
        </div>
      </GlassCard>
    </div>
  </div>
);

export default FAQ;