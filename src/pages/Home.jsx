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
      'Daily check-ins with Aura feel like speaking to a compassionate psychiatrist, blending CBT, ACT, and supportive reflection in language that meets you where you are.',
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
      'Aura synthesises findings into measurable insights, highlighting concerns that need attention and the protective factors already working for you.',
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

const blogHighlights = [
  {
    slug: 'ai-psychiatrist-introduction',
    title: 'How PsyMitrix balances AI psychiatry with human empathy',
    excerpt:
      'Explore the blended care framework that keeps Aura clinically anchored, culturally aware, and deeply compassionate in every conversation.',
    readingTime: '6 min read',
  },
  {
    slug: 'safety-guardrails',
    title: 'Safety guardrails every mental health AI must follow',
    excerpt:
      'We share the escalation ladders, bias audits, and human-in-the-loop reviews that protect your wellbeing 24/7.',
    readingTime: '5 min read',
  },
  {
    slug: 'building-support-plan',
    title: 'Designing your personalised support plan in 72 hours',
    excerpt:
      'See how assessments, journaling, and guided practices converge into an actionable roadmap for lasting growth.',
    readingTime: '7 min read',
  },
];

const Home = () => {
  const { user } = useAuth();
  const gradientText = 'text-transparent bg-clip-text bg-gradient-to-r from-light-primary to-light-secondary dark:from-dark-primary dark:to-dark-secondary';
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  const userProgress = user ? 75 : 25;
  const sessionsCompleted = user ? 12 : 0;
  const assessmentsTaken = user ? 3 : 0;
  const moodScore = user ? 'Balanced' : 'N/A';
  const achievementsUnlocked = user ? 5 : 0;

  return (
    <div className="min-h-screen text-light-body dark:text-dark-body overflow-hidden relative">
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 relative z-10">
        <Section className=" grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          <motion.div
            className="text-center lg:text-left"
            variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
          >
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-xm md:text-sm lg:text-sm font-medium text-light-headings dark:text-dark-headings mb-6 "
            >
              <FiHeart className="text-light-primary dark:text-dark-primary text-2xl" />
              Trusted AI psychiatrist for guided, human-centred care
            </motion.div>
            <motion.h1 variants={fadeInUp} className={`text-5xl md:text-6xl pt-auto font-bold mb-6 ${gradientText}`}>
              Meet PsyMitrix, your always-on AI psychiatrist
            </motion.h1>
            
            <motion.p
              variants={fadeInUp}
              className="text-xl md:text-2xl text-light-body dark:text-dark-body max-w-xl mx-auto mt-2 lg:mx-0 mb-10 leading-relaxed"
            >
              Aura listens with empathy, surfaces clinically-backed insights, and keeps you connected to the practices and people who help you heal.
            </motion.p>
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-start justify-center">
              <PrimaryButton to="/dashboard">
                Start your first session <FiArrowRight className="inline ml-2" />
              </PrimaryButton>
              <Link to="/blog" className="text-light-primary dark:text-dark-primary font-semibold hover:underline">
                Explore our clinical journal
              </Link>
            </motion.div>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <GlassCard className="p-6 lg:p-8">
              <div className=" p-6 rounded-2xl space-y-6">
                <div>
                  <p className="font-bold text-xl md:text-2xl text-light-headings dark:text-dark-headings mb-2">
                    👋 Welcome back, {user ? user.name : 'Explorer'}
                  </p>
                  <p className="text-sm text-light-body/80 dark:text-dark-body/80">
                    Your therapeutic companion is ready with new guidance tailored to today’s mood.
                  </p>
                </div>

                <div>
                  <h4 className="text-md font-semibold text-light-headings dark:text-dark-headings mb-2">This week at a glance</h4>
                  <ProgressBar progress={userProgress} label="Journey" />
                  <p className="mt-2 text-xs text-light-body dark:text-dark-body">
                    {userProgress}% of your personalised care plan complete — gentle reminders are queued.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 items-center">
                  <SummaryCard title="Sessions" value={sessionsCompleted} icon={FiMessageCircle} />
                  <SummaryCard title="Assessments" value={assessmentsTaken} icon={FiClipboard} />
                  <SummaryCard title="Mood Score" value={moodScore} icon={FiHeart} />
                  <SummaryCard title="Milestones" value={achievementsUnlocked} icon={FiAward} />
                </div>

                <ul className="space-y-3 text-sm text-left text-light-body dark:text-dark-body">
                  <li className="flex items-start gap-3">
                    <span className="mt-1 flex h-8 w-14 items-center justify-center rounded-full bg-light-secondary/20 dark:bg-dark-secondary/20 text-light-primary dark:text-dark-primary">
                      <FiShield />
                    </span>
                    <span className='z-10'>
                      <strong >Clinical guardrails:</strong> Crisis detection routes you to regional hotlines and notifies your trusted contacts when you consent.
                    </span>
                  </li>
                  {/* <li className="flex items-start gap-3">
                    <span className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-light-secondary/20 dark:bg-dark-secondary/20 text-light-primary dark:text-dark-primary">
                      <FiAlertCircle />
                    </span>
                    <span>
                    </span>
                  </li> */}
                  <li className="flex items-start gap-3">
                    <span className="mt-1 flex h-8 w-14 items-center justify-center rounded-full bg-light-secondary/20 dark:bg-dark-secondary/20 text-light-primary dark:text-dark-primary">
                      <FiBookOpen />
                    </span>
                    <span>
                      <strong>Shared care summaries:</strong> Export progress notes to therapists, psychiatrists, or family supporters in one secure click.
                    </span>
                  </li>
                </ul>
              </div>
            </GlassCard>
          </motion.div>
        </Section>

        <Section className='my-20 md:my-28'>
          <motion.h2 variants={fadeInUp} className={`text-4xl font-bold mb-4 text-center ${gradientText}`}>
            Designed as a full-spectrum mental health companion
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="max-w-3xl mx-auto text-xl text-center mb-12 text-light-body dark:text-dark-body"
          >
            PsyMitrix mirrors the calming reassurance of a clinician with the precision of real-time data, turning each conversation into progress you can feel.
          </motion.p>
          <motion.div variants={fadeInUp} className="grid gap-8 md:grid-cols-3">
            {featureHighlights.map((feature) => (
              <motion.div key={feature.title} variants={fadeInUp}>
                <FeatureCard {...feature} />
              </motion.div>
            ))}
          </motion.div>
        </Section>

        <Section className='my-20 md:my-28'>
          <motion.h2 variants={fadeInUp} className={`text-4xl font-bold  mb-4 text-center ${gradientText}`}>
            How PsyMitrix guides every session
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="max-w-2xl mx-auto text-center text-lg text-light-body dark:text-dark-body mb-12"
          >
            A therapeutic arc crafted with clinicians: understand your story, interpret the signals, then support meaningful change.
          </motion.p>
          <div className="grid gap-8 md:grid-cols-3">
            {journeySteps.map((step, index) => (
              <motion.div key={step.title} variants={fadeInUp}>
                <GlassCard className="p-6 h-full">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-light-secondary/25 dark:bg-dark-secondary/25 text-light-primary dark:text-dark-primary text-lg font-semibold">
                      {index + 1}
                    </span>
                    <div className="text-3xl text-light-primary dark:text-dark-primary">
                      <step.icon />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-light-headings dark:text-dark-headings mb-3">
                    {step.title}
                  </h3>
                  <p className="text-light-body dark:text-dark-body leading-relaxed">{step.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </Section>

        <Section className="grid lg:grid-cols-2 gap-12 items-center text-center">
          <motion.div variants={fadeInUp} className="space-y-6 my-20 md:my-28">
            <h2 className={`text-4xl font-bold ${gradientText}`}>Built with clinicians, ready for your care team</h2>
            <p className="text-lg text-light-body dark:text-dark-body leading-relaxed">
              PsyMitrix was co-designed with psychiatrists, psychologists, and lived-experience advisors. Aura keeps the warmth of human care while managing the continuity tasks that often fall through the cracks.
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
                <Link to={`/blog#${post.slug}`}>
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
                Within minutes, Aura can run your baseline assessment, surface immediate recommendations, and schedule your next guided reflections.
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
