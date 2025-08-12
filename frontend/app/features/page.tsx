"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Brain,
  Shield,
  Fingerprint,
  Activity,
  Bot,
  LineChart,
  Wifi,
  Heart,
  Zap,
  Users,
  Clock,
  Smartphone,
} from "lucide-react";

const mainFeatures = [
  {
    icon: <Bot className="w-12 h-12 text-primary" />,
    title: "AI-Powered Therapy",
    description:
      "24/7 access to empathetic AI agents trained in various therapeutic approaches, providing personalized mental health support.",
    benefits: ["CBT & DBT techniques", "Personalized responses", "Always available"],
    color: "from-blue-500/20",
  },
  {
    icon: <Shield className="w-12 h-12 text-primary" />,
    title: "Blockchain Security",
    description:
      "Your therapy sessions are secured by blockchain technology, ensuring complete privacy and transparent record-keeping.",
    benefits: ["End-to-end encryption", "Tamper-proof records", "User-owned data"],
    color: "from-green-500/20",
  },
  {
    icon: <Brain className="w-12 h-12 text-primary" />,
    title: "Smart Analysis",
    description:
      "Advanced NLP and emotion detection helps understand your mental state and provide appropriate interventions.",
    benefits: ["Sentiment analysis", "Risk assessment", "Progress tracking"],
    color: "from-purple-500/20",
  },
  {
    icon: <Activity className="w-12 h-12 text-primary" />,
    title: "Crisis Detection",
    description:
      "Real-time monitoring and emergency response protocols to ensure your safety during critical situations.",
    benefits: ["24/7 monitoring", "Emergency protocols", "Professional referrals"],
    color: "from-red-500/20",
  },
];

const additionalFeatures = [
  {
    icon: Wifi,
    title: "IoT Integration",
    description: "Connect with smart home devices to create an ambient therapeutic environment.",
  },
  {
    icon: LineChart,
    title: "Progress Tracking",
    description: "Detailed analytics and insights about your mental health journey.",
  },
  {
    icon: Fingerprint,
    title: "Privacy First",
    description: "End-to-end encryption and zero-knowledge proofs ensure confidentiality.",
  },
  {
    icon: Heart,
    title: "Holistic Care",
    description: "Integration with wearables and health providers for comprehensive monitoring.",
  },
  {
    icon: Zap,
    title: "Instant Support",
    description: "Get immediate assistance whenever you need it, day or night.",
  },
  {
    icon: Users,
    title: "Community Support",
    description: "Connect with others on similar journeys in safe, moderated spaces.",
  },
  {
    icon: Clock,
    title: "Flexible Sessions",
    description: "Therapy sessions that adapt to your schedule and preferences.",
  },
  {
    icon: Smartphone,
    title: "Multi-Platform",
    description: "Access your support system from any device, anywhere.",
  },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 dark:from-background dark:via-background/95 dark:to-background/90">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute w-72 h-72 bg-primary/10 dark:bg-primary/5 rounded-full blur-3xl top-20 right-10 animate-pulse" />
          <div className="absolute w-96 h-96 bg-secondary/10 dark:bg-secondary/5 rounded-full blur-3xl bottom-20 left-10 animate-pulse delay-700" />
        </div>

        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16 max-w-4xl mx-auto"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Platform Features
            </h1>
            <p className="text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Discover how our AI-powered platform revolutionizes mental health
              support with cutting-edge technology and unwavering privacy protection.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Features Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground dark:text-foreground">
              Core Features
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The foundation of our mental health platform
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {mainFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="h-full"
              >
                <Card className="group relative overflow-hidden p-8 h-full bg-card/50 dark:bg-card/80 backdrop-blur-sm border border-primary/10 dark:border-primary/20 hover:border-primary/20 dark:hover:border-primary/30 transition-all duration-300 hover:shadow-lg dark:hover:shadow-primary/5">
                  {/* Background gradient effect */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.color} to-transparent opacity-0 group-hover:opacity-20 dark:group-hover:opacity-30 transition-opacity duration-500`}
                  />
                  
                  <div className="relative z-10">
                    <div className="mb-6">
                      <div className="p-4 rounded-2xl bg-primary/10 dark:bg-primary/20 group-hover:bg-primary/20 dark:group-hover:bg-primary/30 transition-colors duration-300 inline-block">
                        {feature.icon}
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-semibold mb-4 text-foreground dark:text-foreground">
                      {feature.title}
                    </h3>
                    
                    <p className="text-muted-foreground leading-relaxed text-base mb-6">
                      {feature.description}
                    </p>

                    {/* Benefits list */}
                    <div className="space-y-2">
                      {feature.benefits.map((benefit, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-primary" />
                          <span className="text-sm text-muted-foreground font-medium">
                            {benefit}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Features Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30 dark:bg-muted/10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground dark:text-foreground">
              Additional Capabilities
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Extended features that enhance your mental wellness journey
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {additionalFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="h-full"
              >
                <Card className="group relative overflow-hidden p-6 h-full bg-card/50 dark:bg-card/80 backdrop-blur-sm border border-primary/10 dark:border-primary/20 hover:border-primary/20 dark:hover:border-primary/30 transition-all duration-300 hover:shadow-md dark:hover:shadow-primary/5">
                  <div className="mb-4">
                    <div className="p-3 rounded-xl bg-primary/10 dark:bg-primary/20 group-hover:bg-primary/20 dark:group-hover:bg-primary/30 transition-colors duration-300 inline-block">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-2 text-foreground dark:text-foreground">
                    {feature.title}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack Section */}
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
                Powered by Advanced Technology
              </h2>
              <div className="space-y-4 text-muted-foreground text-lg leading-relaxed">
                <p>
                  Our platform leverages state-of-the-art natural language processing, 
                  machine learning algorithms, and blockchain technology to deliver 
                  unparalleled mental health support.
                </p>
                <p>
                  Every interaction is processed through our proprietary emotion detection 
                  system, ensuring personalized and contextually appropriate responses 
                  while maintaining the highest standards of privacy and security.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="p-4 rounded-xl bg-primary/5 dark:bg-primary/10 border border-primary/10 dark:border-primary/20">
                  <div className="text-2xl font-bold text-primary mb-1">99.9%</div>
                  <div className="text-sm text-muted-foreground">Uptime</div>
                </div>
                <div className="p-4 rounded-xl bg-secondary/5 dark:bg-secondary/10 border border-secondary/10 dark:border-secondary/20">
                  <div className="text-2xl font-bold text-secondary mb-1">&lt;100ms</div>
                  <div className="text-sm text-muted-foreground">Response Time</div>
                </div>
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
                <div className="text-center space-y-6">
                  <Brain className="w-20 h-20 text-primary mx-auto animate-pulse" />
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-foreground">
                      AI-Powered Insights
                    </h3>
                    <p className="text-muted-foreground">
                      Advanced algorithms that understand and adapt to your unique needs
                    </p>
                  </div>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 dark:bg-primary/5 rounded-full blur-xl animate-pulse" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-secondary/10 dark:bg-secondary/5 rounded-full blur-xl animate-pulse delay-700" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground dark:text-foreground">
              Ready to Experience the Future?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of users who have already transformed their mental wellness 
              journey with our AI-powered platform.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <Button
                asChild
                size="lg"
                className="h-14 px-8 rounded-full bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:shadow-lg hover:shadow-primary/25 dark:hover:shadow-primary/15 transition-all duration-300"
              >
                <a href="/dashboard" className="flex items-center gap-2 text-lg font-medium">
                  Start Your Journey
                  <Heart className="w-5 h-5" />
                </a>
              </Button>
              
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-14 px-8 rounded-full border-primary/20 hover:border-primary/40 hover:bg-primary/5 dark:hover:bg-primary/10 transition-all duration-300"
              >
                <a href="/about" className="flex items-center gap-2 text-lg font-medium">
                  Learn More
                  <Brain className="w-5 h-5" />
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
