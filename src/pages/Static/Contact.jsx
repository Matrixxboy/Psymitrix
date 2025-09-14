import React from 'react';
import GlassCard from '../../components/ui/GlassCard';
import Button from '../../components/ui/Button';

const Contact = () => (
  <div className="min-h-screen p-6 md:p-10 bg-light-background dark:bg-dark-background">
    <div className="max-w-2xl mx-auto">
      <GlassCard className="p-8 animate-fade-in-up">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-light-headings dark:text-dark-headings tracking-tight">Get in Touch</h1>
          <p className="mt-3 text-lg text-light-body dark:text-dark-body leading-relaxed">
            We'd love to hear from you. Whether you have a question, feedback, or a success story to share, please don't hesitate to reach out.
          </p>
        </div>

        <form className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-light-headings dark:text-dark-headings mb-2">Full Name</label>
            <input type="text" id="name" className="w-full p-3 rounded-lg bg-white/20 dark:bg-black/20 border border-white/30 dark:border-black/30 focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary transition-shadow" placeholder="Jane Doe" />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-light-headings dark:text-dark-headings mb-2">Email Address</label>
            <input type="email" id="email" className="w-full p-3 rounded-lg bg-white/20 dark:bg-black/20 border border-white/30 dark:border-black/30 focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary transition-shadow" placeholder="you@example.com" />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-light-headings dark:text-dark-headings mb-2">Message</label>
            <textarea id="message" rows="5" className="w-full p-3 rounded-lg bg-white/20 dark:bg-black/20 border border-white/30 dark:border-black/30 focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary transition-shadow" placeholder="Your thoughts, questions, or feedback..."></textarea>
          </div>

          <div className="text-center">
            <Button type="submit" className="w-full md:w-auto">Send Message</Button>
          </div>
        </form>

        <div className="mt-8 text-center">
          <p className="text-light-body dark:text-dark-body">You can also email us directly at <a href="mailto:support@psymitrix.app" className="font-semibold text-light-primary dark:text-dark-primary hover:underline">support@psymitrix.app</a>.</p>
          <p className="text-sm text-light-body dark:text-dark-body opacity-80 mt-2">We typically respond within 1-2 business days.</p>
        </div>
      </GlassCard>
    </div>
  </div>
);

export default Contact;