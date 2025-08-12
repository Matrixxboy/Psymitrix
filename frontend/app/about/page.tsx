"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Heart, Target, Sparkles, Users, Globe, Shield } from "lucide-react";

const missions = [
  {
    icon: <Heart className="w-8 h-8 text-primary" />,
    title: "Our Mission",
    description:
      "To democratize access to mental health support through ethical AI and blockchain technology, making quality therapeutic care available to everyone, everywhere, at any time.",
    color: "from-rose-500/20",
  },
  {
    icon: <Target className="w-8 h-8 text-primary" />,
    title: "Our Vision",
    description:
      "A world where mental health support is accessible, private, and personalized, powered by trusted AI agents and secured by blockchain technology.",
    color: "from-blue-500/20",
  },
  {
    icon: <Sparkles className="w-8 h-8 text-primary" />,
    title: "Our Values",
    description:
      "Privacy, Innovation, Empathy, and Trust form the cornerstone of our platform, ensuring the highest standards of care and security.",
    color: "from-purple-500/20",
  },
];

const stats = [
  { icon: Users, label: "Active Users", value: "10,000+", color: "text-blue-500" },
  { icon: Globe, label: "Countries", value: "50+", color: "text-green-500" },
  { icon: Shield, label: "Uptime", value: "99.9%", color: "text-orange-500" },
  { icon: Heart, label: "Sessions", value: "1M+", color: "text-rose-500" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 dark:from-background dark:via-background/95 dark:to-background/90">
      {/* Hero Section with enhanced grid */}
      <section className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute w-72 h-72 bg-primary/10 dark:bg-primary/5 rounded-full blur-3xl top-20 left-10 animate-pulse" />
          <div className="absolute w-96 h-96 bg-secondary/10 dark:bg-secondary/5 rounded-full blur-3xl bottom-20 right-10 animate-pulse delay-700" />
        </div>

        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-20 max-w-4xl mx-auto"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              About Aura 3.0
            </h1>
            <p className="text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              We're revolutionizing mental health support by combining cutting-edge
              AI technology with the security and transparency of blockchain.
            </p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
          >
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="text-center p-6 rounded-2xl bg-card/50 dark:bg-card/80 backdrop-blur-sm border border-primary/10 dark:border-primary/20 hover:border-primary/20 dark:hover:border-primary/30 transition-all duration-300"
              >
                <stat.icon className={`w-8 h-8 mx-auto mb-3 ${stat.color}`} />
                <div className="text-2xl lg:text-3xl font-bold text-foreground mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Mission Cards Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Our Foundation
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built on principles that prioritize your wellbeing and privacy
            </p>
          </motion.div>

          {/* Enhanced Mission Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {missions.map((mission, index) => (
              <motion.div
                key={mission.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="h-full"
              >
                <Card className="group relative overflow-hidden p-8 text-center h-full bg-card/50 dark:bg-card/80 backdrop-blur-sm border border-primary/10 dark:border-primary/20 hover:border-primary/20 dark:hover:border-primary/30 transition-all duration-300 hover:shadow-lg dark:hover:shadow-primary/5">
                  {/* Background gradient effect */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${mission.color} to-transparent opacity-0 group-hover:opacity-20 dark:group-hover:opacity-30 transition-opacity duration-500`}
                  />
                  
                  <div className="relative z-10">
                    <div className="mb-6 flex justify-center">
                      <div className="p-4 rounded-2xl bg-primary/10 dark:bg-primary/20 group-hover:bg-primary/20 dark:group-hover:bg-primary/30 transition-colors duration-300">
                        {mission.icon}
                      </div>
                    </div>
                    <h3 className="text-2xl font-semibold mb-4 text-foreground dark:text-foreground">
                      {mission.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed text-base">
                      {mission.description}
                    </p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground dark:text-foreground">
                Our Story
              </h2>
              <div className="space-y-4 text-muted-foreground text-lg leading-relaxed">
                <p>
                  Founded by a team of mental health professionals, AI researchers, and blockchain experts, 
                  Aura 3.0 was born from a simple yet powerful belief: everyone deserves access to quality mental health support.
                </p>
                <p>
                  We saw the barriers that prevent people from getting the help they need - cost, stigma, 
                  availability, and privacy concerns. Our solution combines the latest in AI technology 
                  with the security and transparency of blockchain to create a platform that's accessible, 
                  private, and effective.
                </p>
                <p>
                  Today, we're proud to serve thousands of users worldwide, providing 24/7 mental health 
                  support that adapts to each individual's unique needs and circumstances.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-primary/20 via-secondary/20 to-primary/10 dark:from-primary/10 dark:via-secondary/10 dark:to-primary/5 p-8 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <Heart className="w-16 h-16 text-primary mx-auto animate-pulse" />
                  <h3 className="text-2xl font-bold text-foreground">
                    Mental Health for All
                  </h3>
                  <p className="text-muted-foreground">
                    Breaking down barriers to mental wellness through innovative technology
                  </p>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 dark:bg-primary/5 rounded-full blur-xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-secondary/10 dark:bg-secondary/5 rounded-full blur-xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30 dark:bg-muted/10">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground dark:text-foreground">
              Join Our Mission
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Ready to experience the future of mental health support? Join thousands of users 
              who have already found their path to better mental wellness with Aura 3.0.
            </p>
            <div className="pt-8">
              <motion.a
                href="/dashboard"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center px-8 py-4 rounded-full bg-gradient-to-r from-primary to-secondary text-primary-foreground font-semibold text-lg hover:shadow-lg hover:shadow-primary/25 dark:hover:shadow-primary/15 transition-all duration-300"
              >
                Start Your Journey
                <Heart className="ml-2 w-5 h-5" />
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
