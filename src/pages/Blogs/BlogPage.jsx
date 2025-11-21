import { motion } from 'framer-motion';
import { FiBookOpen, FiCalendar, FiClock, FiArrowRight } from 'react-icons/fi'; // Added FiArrowRight
import { Link } from 'react-router-dom';
import blogPosts from '../../data/blogData'; // Import blogPosts data

const GlassCard = ({ children, className = '' }) => (
  <div className={`glass rounded-3xl ${className}`}>
    <div className="relative z-10">
      {children}
    </div>
  </div>
);

const BlogPage = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  const gradientText = 'text-transparent bg-clip-text bg-gradient-to-r from-light-primary to-light-secondary dark:from-dark-primary dark:to-dark-secondary';

  return (
    <div className="min-h-screen text-light-body dark:text-dark-body overflow-hidden relative">
      <main className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 relative z-10">
        <motion.header
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="text-center my-12"
        >
          <h1 className={`text-5xl md:text-6xl font-bold tracking-tight pb-4 mb-4 ${gradientText} `}>
            The PsyMitrix Journal
          </h1>
          <p className="text-xl text-light-body/80 dark:text-dark-body/80">
            Insights on AI, mental health, and compassionate technology.
          </p>
        </motion.header>

        <div className="space-y-16">
          {blogPosts.map((post) => (
            <motion.article
              key={post.slug}
              id={post.slug} // Keep id for potential direct linking from home page
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeInUp}
            >
              <Link to={`/blog/${post.slug}`}> {/* Link to individual blog post page */}
                <GlassCard className="p-8 md:p-12 cursor-pointer transition-transform duration-300 hover:-translate-y-1">
                  <header>
                    <div className="flex items-center gap-2 text-sm font-medium text-light-primary dark:text-dark-primary mb-4">
                      <FiBookOpen />
                      <span>Clinical Insights</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-light-headings dark:text-dark-headings mb-3">
                      {post.title}
                    </h2>
                    <div className="flex items-center gap-4 text-sm text-light-body/80 dark:text-dark-body/80 mb-6">
                      <div className="flex items-center gap-2">
                        <FiCalendar />
                        <span>Updated weekly</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FiClock />
                        <span>{post.readingTime}</span>
                      </div>
                    </div>
                  </header>
                  <p className="text-light-body dark:text-dark-body leading-relaxed mb-6">
                    {post.excerpt}
                  </p>
                  <div className="text-light-primary dark:text-dark-primary font-semibold hover:underline">
                    Read More <FiArrowRight className="inline ml-1" />
                  </div>
                </GlassCard>
              </Link>
            </motion.article>
          ))}
        </div>
      </main>
    </div>
  );
};

export default BlogPage;