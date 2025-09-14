import React from 'react';
import GlassCard from '../../components/ui/GlassCard';

const faqs = [
  { q: 'What is PsyMitrix?', a: 'A personal well-being companion that helps you track, assess, and improve mental health.' },
  { q: 'Is my data private?', a: 'Yes. Your data stays on your device unless you explicitly opt-in to sync with a backend.' },
  { q: 'How often should I take assessments?', a: 'Weekly check-ins are a good cadence, but you can take them whenever you like.' },
];

const FAQ = () => (
  <div className="min-h-screen p-6 md:p-10">
    <div className="max-w-4xl mx-auto space-y-6">
      <GlassCard className="p-8">
        <h1 className="text-3xl font-bold text-light-headings dark:text-dark-headings mb-6">FAQ</h1>
        <div className="space-y-5">
          {faqs.map((item, idx) => (
            <div key={idx}>
              <h3 className="font-semibold text-lg text-light-headings dark:text-dark-headings">{item.q}</h3>
              <p className="text-light-body dark:text-dark-body">{item.a}</p>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  </div>
);

export default FAQ;
