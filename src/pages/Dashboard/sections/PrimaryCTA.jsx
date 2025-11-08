import React from 'react';
import { useNavigate } from 'react-router-dom';
import GlassCard from '../../../components/ui/GlassCard';
import { motion } from 'framer-motion';
import { MessageSquare, CheckSquare, FileText } from 'lucide-react';

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

const PrimaryCTA = () => {
    const navigate = useNavigate();

    return (
        <motion.div variants={cardVariants}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* AI Chat */}
                <GlassCard
                    className="p-6 cursor-pointer hover:shadow-lg transition-all group"
                    onClick={() => navigate('/chat')}
                >
                    <div className="flex items-start gap-3 mb-3">
                        <div className="p-2 bg-light-accent/20 dark:bg-dark-accent/20 rounded-lg group-hover:bg-light-accent/30 dark:group-hover:bg-dark-accent/30 transition-colors">
                            <MessageSquare className="w-6 h-6 text-light-accent dark:text-dark-accent" />
                        </div>
                    </div>
                    <h3 className="text-lg font-bold text-light-headings dark:text-dark-headings mb-2">
                        Chat with AI
                    </h3>
                    <p className="text-sm text-light-body dark:text-dark-body">
                        Get support and advice from your AI psychiatrist anytime.
                    </p>
                </GlassCard>

                {/* Assessments */}
                <GlassCard
                    className="p-6 cursor-pointer hover:shadow-lg transition-all group"
                    onClick={() => navigate('/assessments')}
                >
                    <div className="flex items-start gap-3 mb-3">
                        <div className="p-2 bg-light-accent/20 dark:bg-dark-accent/20 rounded-lg group-hover:bg-light-accent/30 dark:group-hover:bg-dark-accent/30 transition-colors">
                            <CheckSquare className="w-6 h-6 text-light-accent dark:text-dark-accent" />
                        </div>
                    </div>
                    <h3 className="text-lg font-bold text-light-headings dark:text-dark-headings mb-2">
                        Assessments
                    </h3>
                    <p className="text-sm text-light-body dark:text-dark-body">
                        Track your mental health with PHQ-9 and GAD-7 tests.
                    </p>
                </GlassCard>

                {/* Reports */}
                <GlassCard
                    className="p-6 cursor-pointer hover:shadow-lg transition-all group"
                    onClick={() => navigate('/reports')}
                >
                    <div className="flex items-start gap-3 mb-3">
                        <div className="p-2 bg-light-accent/20 dark:bg-dark-accent/20 rounded-lg group-hover:bg-light-accent/30 dark:group-hover:bg-dark-accent/30 transition-colors">
                            <FileText className="w-6 h-6 text-light-accent dark:text-dark-accent" />
                        </div>
                    </div>
                    <h3 className="text-lg font-bold text-light-headings dark:text-dark-headings mb-2">
                        Reports
                    </h3>
                    <p className="text-sm text-light-body dark:text-dark-body">
                        View detailed insights and generate your mental health report.
                    </p>
                </GlassCard>
            </div>
        </motion.div>
    );
};

export default PrimaryCTA;
