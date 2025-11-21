import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiArrowRight,
  FiMessageCircle,
  FiClipboard,
  FiActivity,
  FiShield,
  FiCpu,
  FiHeart,
  FiBookOpen,
  FiCheckCircle,
  FiAlertCircle,
  FiCalendar,
  FiClock,
  FiAward,
} from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import ProgressBar from '../components/ui/ProgressBar';

const Section = ({ children, className = '' }) => (
  <motion.section
    className={`my-10 md:my-25 ${className}`}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.2 }}
    variants={{
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
    }}
  >
    {children}
  </motion.section>
);

const PrimaryButton = ({ to, children, className = '' }) => (
  <Link to={to}>
    <button
      className={`px-8 py-4 font-semibold rounded-xl bg-gradient-to-r 
        from-light-primary to-light-secondary 
        dark:from-light-primary dark:via-light-primary dark:to-light-secondary dark:hover:from-dark-primary dark:hover:to-dark-secondary
        text-white text-lg shadow-xl shadow-light-primary/20 dark:shadow-dark-primary/20 hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300 ${className}`}
    >
      {children}
    </button>
  </Link>
);

const GlassCard = ({ children, className = '' }) => (
  <div className={`glass rounded-3xl ${className}`}>
    <div className="relative z-10">
      {children}
    </div>
  </div>
);

const FeatureCard = ({ icon: Icon, title, description }) => (
  <GlassCard className="p-8 flex flex-col text-center items-center h-full">
    <div className="w-16 h-16 mb-6 flex items-center justify-center rounded-full bg-gradient-to-br from-light-primary/20 via-transparent to-light-secondary/10 dark:from-dark-primary/25 dark:via-transparent dark:to-dark-secondary/15 text-light-primary dark:text-dark-primary text-3xl">
      <Icon />
    </div>
    <h3 className="text-2xl font-semibold text-light-headings dark:text-dark-headings mb-3">{title}</h3>
    <p className="text-light-body dark:text-dark-body flex-grow leading-relaxed">{description}</p>
  </GlassCard>
);

const SummaryCard = ({ title, value, icon: Icon }) => (
  <GlassCard className="p-4 flex flex-col items-center text-center">
    <div className="text-xl text-light-primary dark:text-dark-primary mb-2 flex items-center justify-center ">
      <Icon />
    </div>
    <h5 className="text-sm md:text-lg font-semibold text-light-headings dark:text-dark-headings">{title}</h5>
    <p className="text-lg md:text-lg font-bold text-light-body dark:text-dark-body">{value}</p>
  </GlassCard>
);

const featureHighlights = [
  {
    icon: FiMessageCircle,
    title: 'Therapeutic Conversations',
    description:
      'Daily check-ins with Shvayam feel like speaking to a compassionate psychiatrist, blending CBT, ACT, and supportive reflection in language that meets you where you are.',
  },
  {
    icon: FiClipboard,
    title: 'Clinical-Grade Assessments',
    description:
      'Evidence-based screeners such as PHQ-9, GAD-7, and sleep inventories are administered with dynamic follow-ups and longitudinal trend tracking for your care team.',
  },
  {
    icon: FiActivity,
    title: 'Adaptive Therapeutic Plans',
    description:
      'Personalised routines, interventions, and micro-practices update in real-time using your mood, journaling patterns, and biometric integrations to keep progress sustainable.',
  },
];

const journeySteps = [
  {
    icon: FiClipboard,
    title: 'Assess & Discover',
    description:
      'Begin with a warm intake, structured screeners, and narrative prompts that surface how you are really feeling today.',
  },
  {
    icon: FiCpu,
    title: 'Interpret & Prioritise',
    description:
      'Shvayam synthesises findings into measurable insights, highlighting concerns that need attention and the protective factors already working for you.',
  },
  {
    icon: FiHeart,
    title: 'Support & Escalate',
    description:
      'Receive a living care plan with guided practices, proactive nudges, and seamless hand-offs when in-person clinicians should step in.',
  },
];

const pillarHighlights = [
  {
    title: 'Patient-first safety',
    points: [
      'End-to-end encrypted transcripts with optional on-device redaction for sensitive moments.',
      'Automated crisis triage that surfaces local hotlines and emergency contacts before, during, and after each session.',
    ],
  },
  {
    title: 'Clinician collaboration',
    points: [
      'Hand curated visit summaries mapped to DSM-5 aligned language for faster review.',
      'Exports for therapists, psychiatrists, or caregivers that respect your consent preferences.',
    ],
  },
];

import blogPosts from '../data/blogData'; // Import blogPosts data

const blogHighlights = blogPosts.slice(0, 3); // Get the first 3 blog posts for highlights

const Home = () => {
  const gradientText = 'text-transparent bg-clip-text bg-gradient-to-r from-light-primary to-light-secondary dark:from-dark-primary dark:to-dark-secondary';
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  return (
    <div className="min-h-screen text-light-body dark:text-dark-body overflow-hidden relative">
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 relative z-10">
        <Section className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">

          {/* LEFT SIDE — Badge + GlassCard */}
          <motion.div
            className="text-center lg:text-left"
            variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
          >
            {/* Badge */}
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-xm md:text-sm lg:text-sm font-medium text-light-headings dark:text-dark-headings mb-6"
            >
              <FiHeart className="text-light-primary dark:text-dark-primary text-2xl" />
              Trusted AI psychiatrist for guided, human-centred care
            </motion.div>

            {/* Glass Card */}
            <motion.div variants={fadeInUp}>
              <GlassCard className="p-6 lg:p-8 text-center backdrop-blur-xl">
                <div className="flex flex-col items-center">
                  <img
                    src="/MainImages/IconPNG.png"
                    alt="PsyMitrix Logo"
                    className="h-60 w-60 mb-6 drop-shadow-2xl animate-float"
                  />

                  <h2 className="text-light-primary dark:text-dark-primary text-3xl font-bold tracking-wide">
                    Your Personal Wellness Hub
                  </h2>

                  <p className="mt-3 mb-2 max-w-md mx-auto text-light-body/80 dark:text-dark-body/80 leading-relaxed">
                    Powered by
                    <span className="px-1 font-semibold text-light-headings dark:text-dark-headings">
                      AI-driven emotional intelligence,
                    </span>
                    PsyMitrix guides you through a calm and intuitive mental-wellness journey.
                  </p>
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>

          {/* RIGHT SIDE — Hero Text */}
          <div className="flex flex-col justify-center lg:pl-6">
            <motion.h1
              variants={fadeInUp}
              className={`text-5xl md:text-6xl font-bold tracking-wide mb-6 text-center lg:text-left ${gradientText}`}
            >
              PsyMitrix: Your Always-On Partner Platform for Mental Wellness.
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-xl md:text-2xl text-light-body dark:text-dark-body max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed text-center lg:text-left"
            >
              Shvayam listens with empathy, surfaces clinically-backed insights, and keeps you
              connected to the practices and people who help you heal.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col gap-4 items-center justify-center lg:justify-start"
            >
              <PrimaryButton to="/chat">
                Start your first chat session <FiArrowRight className="inline ml-2" />
              </PrimaryButton>

              <Link
                to="/blog"
                className="text-light-primary dark:text-dark-primary font-semibold hover:underline"
              >
                Explore our clinical journal
              </Link>
            </motion.div>
          </div>

        </Section>


        <Section className="grid lg:grid-cols-2 gap-12 items-center text-center">
          <motion.div variants={fadeInUp} className="space-y-6 my-20 md:my-28">
            <h2 className={`text-4xl font-bold ${gradientText}`}>Built with clinicians, ready for your care team</h2>
            <p className="text-lg text-light-body dark:text-dark-body leading-relaxed">
              PsyMitrix was co-designed with psychiatrists, psychologists, and lived-experience advisors. Shvayam keeps the warmth of human care while managing the continuity tasks that often fall through the cracks.
            </p>
            <ul className="space-y-4 text-light-body dark:text-dark-body text-left">
              <li className="flex items-start gap-3">
                <span className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-light-secondary/25 dark:bg-dark-secondary/25 text-light-primary dark:text-dark-primary">
                  <FiCheckCircle />
                </span>
                <span>
                  <strong>Weekly clinical reviews:</strong> Board-certified psychiatrists audit transcripts and guardrails to maintain tone, safety, and inclusivity.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-light-secondary/25 dark:bg-dark-secondary/25 text-light-primary dark:text-dark-primary">
                  <FiCheckCircle />
                </span>
                <span>
                  <strong>Seamless hand-offs:</strong> Invite your therapist to view structured summaries, suggested next steps, and mood charts in real time.
                </span>
              </li>
            </ul>
            <PrimaryButton to="/contact" className="w-fit mt-12">
              Talk with our clinical onboarding team
            </PrimaryButton>
          </motion.div>

          <motion.div variants={fadeInUp} className="space-y-6 my-20 md:my-28">
            {pillarHighlights.map((pillar) => (
              <GlassCard key={pillar.title} className="p-8">
                <h3 className="text-2xl font-semibold text-light-headings dark:text-dark-headings mb-4">
                  {pillar.title}
                </h3>
                <ul className="space-y-3 text-light-body dark:text-dark-body leading-relaxed">
                  {pillar.points.map((point) => (
                    <li key={point} className="flex items-start gap-3">
                      <span className="mt-1 flex h-6 w-8 items-center justify-center rounded-full bg-light-primary/15 dark:bg-dark-primary/15 text-light-primary dark:text-dark-primary text-sm">
                        <FiCheckCircle />
                      </span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </GlassCard>
            ))}
          </motion.div>
        </Section>

        <Section>
          <motion.h2 variants={fadeInUp} className={`text-4xl font-bold text-center mb-4 ${gradientText}`}>
            Fresh from the PsyMitrix journal
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-center text-lg text-light-body dark:text-dark-body max-w-2xl mx-auto mb-12"
          >
            Insights from our clinical, research, and design teams to help you understand how AI psychiatry can safely support your wellbeing.
          </motion.p>
          <div className="grid gap-8 md:grid-cols-3">
            {blogHighlights.map((post) => (
              <motion.div key={post.slug} variants={fadeInUp}>
                <Link to={`/blog/${post.slug}`}>
                  <GlassCard className="h-full p-8 transition-transform duration-300 hover:-translate-y-1">
                    <div className="flex items-center gap-2 text-sm font-medium text-light-primary dark:text-dark-primary mb-4">
                      <FiBookOpen />
                      Clinical insights
                    </div>
                    <h3 className="text-2xl font-semibold text-light-headings dark:text-dark-headings mb-3">
                      {post.title}
                    </h3>
                    <p className="text-light-body dark:text-dark-body leading-relaxed mb-6">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-3 text-sm text-light-body/80 dark:text-dark-body/80">
                      <FiCalendar />
                      <span>Updated weekly</span>
                      <FiClock />
                      <span>{post.readingTime}</span>
                    </div>
                  </GlassCard>
                </Link>
              </motion.div>
            ))}
          </div>
        </Section>

        <Section className="my-24">
          <GlassCard className="p-10 md:p-16 text-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.2 } } }}
            >
              <motion.h2 variants={fadeInUp} className={`text-4xl font-bold mb-4 ${gradientText}`}>
                Ready to begin compassionate, data-informed care?
              </motion.h2>
              <motion.p
                variants={fadeInUp}
                className="text-xl text-light-body dark:text-dark-body max-w-2xl mx-auto mb-8 leading-relaxed"
              >
                Within minutes, Shvayam can run your baseline assessment, surface immediate recommendations, and schedule your next guided reflections.
              </motion.p>
              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <PrimaryButton to="/dashboard">Launch PsyMitrix</PrimaryButton>
                <Link to="/blog" className="text-light-primary dark:text-dark-primary font-semibold hover:underline">
                  Read how we measure impact
                </Link>
              </motion.div>
            </motion.div>
          </GlassCard>
        </Section>
      </main>
    </div>
  );
};

export default Home;
