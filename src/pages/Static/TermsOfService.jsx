import React from 'react';
import GlassCard from '../../components/ui/GlassCard';

const TermsOfService = () => (
  <div className="min-h-screen p-6 md:p-10 bg-light-background dark:bg-dark-background">
    <div className="max-w-3xl mx-auto">
      <GlassCard className="p-8 animate-fade-in-up space-y-6">
        <div className="border-b border-white/20 dark:border-white/10 pb-5">
          <h1 className="text-3xl font-extrabold text-light-headings dark:text-dark-headings tracking-tight">Terms of Service</h1>
          <p className="mt-2 text-light-body dark:text-dark-body">Last Updated: September 15, 2025</p>
        </div>

        <div className="space-y-5">
          <h2 className="text-2xl font-bold text-light-headings dark:text-dark-headings">1. Acceptance of Terms</h2>
          <p className="leading-relaxed text-light-body dark:text-dark-body">
            By accessing or using PsyMitrix (the "App"), you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not use the App.
          </p>

          <h2 className="text-2xl font-bold text-light-headings dark:text-dark-headings">2. Disclaimer: Not a Medical Device</h2>
          <p className="leading-relaxed text-light-body dark:text-dark-body">
            PsyMitrix is not a medical device and is not intended to diagnose, treat, cure, or prevent any disease or condition. The App is a tool for personal tracking and self-awareness. It is not a substitute for professional medical advice, diagnosis, or treatment from a qualified healthcare provider.
          </p>

          <h2 className="text-2xl font-bold text-light-headings dark:text-dark-headings">3. Responsible Use</h2>
          <p className="leading-relaxed text-light-body dark:text-dark-body">
            You agree to use the App responsibly. Do not rely on the App for emergency situations. If you are experiencing a mental health crisis, please contact a crisis hotline, a medical professional, or emergency services immediately.
          </p>

          <h2 className="text-2xl font-bold text-light-headings dark:text-dark-headings">4. Data and Privacy</h2>
          <p className="leading-relaxed text-light-body dark:text-dark-body">
            Your use of the App is also governed by our <a href="/privacy" className="font-semibold text-light-primary dark:text-dark-primary hover:underline">Privacy Policy</a>. By using the App, you consent to the practices described therein, including the local storage of your data on your device.
          </p>

          <h2 className="text-2xl font-bold text-light-headings dark:text-dark-headings">5. Limitation of Liability</h2>
          <p className="leading-relaxed text-light-body dark:text-dark-body">
            PsyMitrix and its creators shall not be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use the App. You use the App at your own risk.
          </p>

          <h2 className="text-2xl font-bold text-light-headings dark:text-dark-headings">6. Changes to Terms</h2>
          <p className="leading-relaxed text-light-body dark:text-dark-body">
            We may modify these Terms at any time. We will notify you of any changes by posting the new Terms of Service within the App. Your continued use of the App after such changes constitutes your acceptance of the new Terms.
          </p>
        </div>
      </GlassCard>
    </div>
  </div>
);

export default TermsOfService;