import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiArrowRight, FiMessageCircle, FiClipboard, FiPlayCircle, FiStar,
  FiEdit3, FiTrendingUp, FiAward, FiShield, FiCpu, FiHeart,
  FiGithub, FiTwitter, FiLinkedin
} from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import ProgressBar from '../components/ui/ProgressBar';

// ##################################################################
// ## NEW & REFACTORED REUSABLE COMPONENTS
// ##################################################################

// A wrapper for consistent section styling and animation
const Section = ({ children, className = '' }) => (
  <motion.section
    className={`my-20 md:my-28 ${className}`}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.2 }}
    variants={{
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
    }}
  >
    {children}
  </motion.section>
);

// A reusable primary button for consistency
const PrimaryButton = ({ to, children, className = '' }) => (
  <Link to={to}>
    <button className={`px-8 py-4 font-semibold rounded-lg bg-light-primary dark:bg-dark-primary text-white text-lg hover:opacity-90 transition-transform hover:scale-105 transform duration-300 shadow-lg ${className}`}>
      {children}
    </button>
  </Link>
);

const GlassCard = ({ children, className = '' }) => (
  <div className={`bg-white/20 dark:bg-white/5 backdrop-blur-2xl border border-white/30 dark:border-white/10 rounded-3xl shadow-lg ${className}`}>
    {children}
  </div>
);

const FeatureCard = ({ icon, title, description }) => (
  <GlassCard className="p-8 text-center items-center flex flex-col h-full hover:border-white/50 transition-colors duration-300">
    <div className="w-16 h-16 text-3xl flex items-center justify-center text-light-primary dark:text-dark-primary bg-light-primary/10 dark:bg-dark-primary/10 rounded-full mb-6">
      {icon}
    </div>
    <h3 className="text-2xl font-semibold text-light-headings dark:text-dark-headings mb-3">{title}</h3>
    <p className="text-light-body dark:text-dark-body flex-grow">{description}</p>
  </GlassCard>
);

// Inline SummaryCard component for quick stats
const SummaryCard = ({ title, value, icon }) => (
  <GlassCard className="p-4 flex flex-col items-center justify-center text-center">
    <div className="text-2xl text-light-primary dark:text-dark-primary mb-2">{icon}</div>
    <h5 className="text-lg font-semibold text-light-headings dark:text-dark-headings">{title}</h5>
    <p className="text-xl font-bold text-light-body dark:text-dark-body">{value}</p>
  </GlassCard>
);


// ##################################################################
// ## MAIN HOME COMPONENT
// ##################################################################

const Home = () => {
  const { user } = useAuth();
  const gradientText = "text-transparent bg-clip-text bg-gradient-to-r from-light-primary to-light-secondary dark:from-dark-primary dark:to-dark-secondary";
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  // Dummy data for demonstration
  const userProgress = user ? 75 : 25; // Example: 75% for logged in, 25% for guest
  const sessionsCompleted = user ? 12 : 0;
  const assessmentsTaken = user ? 3 : 0;
  const moodScore = user ? 'Good' : 'N/A';
  const achievementsUnlocked = user ? 5 : 0;


  return (
    <div className="min-h-screen text-light-body dark:text-dark-body overflow-hidden">
      <div className="absolute top-0 left-0 -translate-x-1/4 -translate-y-1/4 w-full h-full max-w-4xl">
        <div className="w-full h-full bg-light-primary/30 dark:bg-dark-primary/30 rounded-full blur-3xl opacity-20 -z-10" />
      </div>

      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 relative z-10">
        {/* --- HERO SECTION --- */}
        <Section className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          <motion.div className="text-center lg:text-left" variants={{ visible: { transition: { staggerChildren: 0.2 } } }}>
            <motion.h1 variants={fadeInUp} className={`text-5xl md:text-6xl font-bold mb-6 ${gradientText}`}>
              Your Path to a Healthier Mind
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-light-body dark:text-dark-body max-w-xl mx-auto lg:mx-0 mb-10">
              A safe and supportive space to understand and improve your mental well-being.
            </motion.p>
            <motion.div variants={fadeInUp}>
              <PrimaryButton to="/dashboard">Get Started <FiArrowRight className="inline ml-2" /></PrimaryButton>
            </motion.div>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <GlassCard className="p-6">
              <div className="bg-light-background/70 dark:bg-dark-background/30 p-6 rounded-2xl backdrop-blur-xl">
                {/* Greeting */}
                <p className="font-bold text-xl md:text-2xl text-light-headings dark:text-dark-headings mb-4">
                  👋 Welcome back, {user ? user.name : 'Explorer'}!
                </p>

                {/* Dynamic Progress Bar */}
                <h4 className="text-md font-semibold text-light-headings dark:text-dark-headings mb-2">Overall Progress</h4>
                <ProgressBar progress={userProgress} label="Journey" />
                <p className="mt-2 text-xs text-light-body dark:text-dark-body">{userProgress}% complete this week 🎯</p>

                {/* Dynamic Quick Stats */}
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <SummaryCard title="Sessions" value={sessionsCompleted} icon={<FiMessageCircle />} />
                  <SummaryCard title="Assessments" value={assessmentsTaken} icon={<FiClipboard />} />
                  <SummaryCard title="Mood Score" value={moodScore} icon={<FiHeart />} />
                  <SummaryCard title="Achievements" value={achievementsUnlocked} icon={<FiAward />} />
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </Section>

        {/* --- FEATURES SECTION --- */}
        <Section>
          <motion.div variants={fadeInUp} className="grid gap-8 md:grid-cols-3">
            <FeatureCard icon={<FiMessageCircle />} title="AI-Powered Chat" description="Engage in meaningful conversations with Aura, your personal AI companion, available 24/7." />
            <FeatureCard icon={<FiClipboard />} title="Guided Assessments" description="Gain insights with industry-standard assessments like PHQ-9 and GAD-7." />
            <FeatureCard icon={<FiPlayCircle />} title="Calming Activities" description="Reduce stress and anxiety with a curated collection of games and mindfulness exercises." />
          </motion.div>
        </Section>

        {/* --- NEW 'WHY CHOOSE US?' SECTION --- */}
        <Section className="text-center">
          <motion.h2 variants={fadeInUp} className={`text-4xl font-bold mb-4 ${gradientText}`}>A Foundation of Trust & Science</motion.h2>
          <motion.p variants={fadeInUp} className="max-w-3xl mx-auto text-xl mb-12">We are committed to providing a tool that is not only effective but also safe and respectful of your privacy.</motion.p>
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div variants={fadeInUp}><FeatureCard icon={<FiShield />} title="Data Privacy First" description="Your conversations are encrypted and anonymized. Your privacy is our absolute priority." /></motion.div>
            <motion.div variants={fadeInUp}><FeatureCard icon={<FiCpu />} title="Scientifically-Backed" description="Our assessments and exercises are based on established Cognitive Behavioral Therapy (CBT) principles." /></motion.div>
            <motion.div variants={fadeInUp}><FeatureCard icon={<FiHeart />} title="Personalized Journey" description="The app adapts to your needs, suggesting activities and insights relevant to your personal goals." /></motion.div>
          </div>
        </Section>

        {/* --- CTA & FOOTER --- */}
        <Section className="my-24">
          <GlassCard className="p-10 md:p-16 text-center bg-light-primary/10 dark:bg-dark-primary/10">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.2 } } }}>
              <motion.h2 variants={fadeInUp} className={`text-4xl font-bold mb-4 ${gradientText}`}>Ready to Start Your Journey?</motion.h2>
              <motion.p variants={fadeInUp} className="text-xl text-light-body dark:text-dark-body max-w-2xl mx-auto mb-8">
                Take the first step towards a healthier, happier you. Your companion Aura is here to help.
              </motion.p>
              <motion.div variants={fadeInUp}>
                <PrimaryButton to="/dashboard">Join Now</PrimaryButton>
              </motion.div>
            </motion.div>
          </GlassCard>
        </Section>
      </main>
    </div>
  );
};

export default Home;