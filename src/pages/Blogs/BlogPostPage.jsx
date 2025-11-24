import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiBookOpen, FiCalendar, FiClock, FiArrowLeft } from 'react-icons/fi';
import blogPosts from '../../data/blogData'; // Import blogPosts data

const GlassCard = ({ children, className = '' }) => (
  <div className={`glass rounded-3xl ${className}`}>
    <div className="relative z-10">
      {children}
    </div>
  </div>
);

const BlogPostPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const post = blogPosts.find((p) => p.slug === slug);

  useEffect(() => {
    if (!post) {
      navigate('/blog'); // Redirect to blog list if post not found
    }
  }, [post, navigate]);

  if (!post) {
    return null; // Or a loading spinner, or a "Post not found" message
  }

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  const gradientText = 'text-transparent bg-clip-text bg-gradient-to-r from-light-primary to-light-secondary dark:from-dark-primary dark:to-dark-secondary';

  return (
    <div className="min-h-screen text-light-body dark:text-dark-body overflow-hidden relative mt-[90px]">
      <main className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 relative z-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="my-8"
        >
          <Link to="/blog" className="inline-flex items-center text-light-primary dark:text-dark-primary font-semibold hover:underline">
            <FiArrowLeft className="mr-2" /> Back to all posts
          </Link>
        </motion.div>

        <motion.article
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <GlassCard className="p-8 md:p-12">
            <header>
              <div className="flex items-center gap-2 text-sm font-medium text-light-primary dark:text-dark-primary mb-4">
                <FiBookOpen />
                <span>Clinical Insights</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-light-headings dark:text-dark-headings mb-3">
                {post.title}
              </h1>
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
            <div className="prose prose-lg dark:prose-invert max-w-none text-light-body dark:text-dark-body leading-relaxed">
              {post.content.split('\n\n').map((paragraph, index) => {
                if (paragraph.startsWith('### ')) {
                  return <h3 key={index} className="text-2xl font-semibold text-light-headings dark:text-dark-headings mt-8 mb-4">{paragraph.substring(4)}</h3>;
                }
                if (paragraph.startsWith('* ')) {
                    return (
                        <ul key={index} className="list-disc pl-5 space-y-2">
                            {paragraph.split('\n').map((item, i) => (
                                <li key={i}>{item.replace(/^\*\s*/, '').split(/(\*\*.*?\*\*)/g).map((part, j) => {
                                    if (part.startsWith('**') && part.endsWith('**')) {
                                        return <strong key={j}>{part.slice(2, -2)}</strong>;
                                    }
                                    return part;
                                })}</li>
                            ))}
                        </ul>
                    )
                }
                return <p key={index}>{paragraph.split(/(\*\*.*?\*\*)/g).map((part, i) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                        return <strong key={i}>{part.slice(2, -2)}</strong>;
                    }
                    return part;
                })}</p>;
              })}
            </div>
          </GlassCard>
        </motion.article>
      </main>
    </div>
  );
};

export default BlogPostPage;
