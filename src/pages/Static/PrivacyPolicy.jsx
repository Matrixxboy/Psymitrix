import React from 'react';
import GlassCard from '../../components/ui/GlassCard';

const PrivacyPolicy = () => (
  <div className="min-h-screen p-6 md:p-10 bg-light-background dark:bg-dark-background">
    <div className="max-w-3xl mx-auto">
      <GlassCard className="p-8 animate-fade-in-up space-y-6">
        <div className="border-b border-white/20 dark:border-white/10 pb-5">
          <h1 className="text-3xl font-extrabold text-light-headings dark:text-dark-headings tracking-tight">Privacy Policy</h1>
          <p className="mt-2 text-light-body dark:text-dark-body">Last Updated: September 15, 2025</p>
        </div>

        <div className="space-y-5">
          <h2 className="text-2xl font-bold text-light-headings dark:text-dark-headings">1. The Gist</h2>
          <p className="leading-relaxed text-light-body dark:text-dark-body">
            Your privacy is fundamental to us. PsyMitrix is designed as a private sanctuary. We do not see, share, or sell your personal data. All your journal entries, assessment results, and mood logs are stored exclusively on your device.
          </p>

          <h2 className="text-2xl font-bold text-light-headings dark:text-dark-headings">2. Data We Do Not Collect</h2>
          <p className="leading-relaxed text-light-body dark:text-dark-body">
            We do not collect any personal health information, journal entries, or any content you generate within the app. We have no server-side database of user-generated content. It is impossible for us to access it.
          </p>

          <h2 className="text-2xl font-bold text-light-headings dark:text-dark-headings">3. Data We May Collect (Anonymously)</h2>
          <p className="leading-relaxed text-light-body dark:text-dark-body">
            To improve our app, we may collect anonymous, aggregated usage data. This includes information like which features are used most often or app crash reports. This data is never linked to your identity and contains no personal information.
          </p>

          <h2 className="text-2xl font-bold text-light-headings dark:text-dark-headings">4. Your Control</h2>
          <p className="leading-relaxed text-light-body dark:text-dark-body">
            You have full control over your data. You can delete your data at any time by clearing the app's data from your device's settings or by uninstalling the application. There is no cloud account to deactivate or data to request for deletion because we do not store it.
          </p>

          <h2 className="text-2xl font-bold text-light-headings dark:text-dark-headings">5. Changes to This Policy</h2>
          <p className="leading-relaxed text-light-body dark:text-dark-body">
            If we update our Privacy Policy, we will notify you within the app. Continued use of the app after such a notice will constitute your consent to the new terms.
          </p>

          <h2 className="text-2xl font-bold text-light-headings dark:text-dark-headings">6. Contact Us</h2>
          <p className="leading-relaxed text-light-body dark:text-dark-body">
            If you have any questions about this Privacy Policy, please <a href="/contact" className="font-semibold text-light-primary dark:text-dark-primary hover:underline">contact us</a>.
          </p>
        </div>
      </GlassCard>
    </div>
  </div>
);

export default PrivacyPolicy;