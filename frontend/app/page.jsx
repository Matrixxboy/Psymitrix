"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
  Brain,
  Heart,
  Shield,
  MessageCircle,
  Sparkles,
  LineChart,
  Waves,
  Check,
  ArrowRight,
  HeartPulse,
  Lightbulb,
  Lock,
  MessageSquareHeart,
} from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import React from "react";
import { Ripple } from "@/components/ui/ripple";

export default function Home() {
  const emotions = [
    { value: 0, label: "😔 Down", color: "from-blue-500/50" },
    { value: 25, label: "😊 Content", color: "from-green-500/50" },
    { value: 50, label: "😌 Peaceful", color: "from-purple-500/50" },
    { value: 75, label: "🤗 Happy", color: "from-yellow-500/50" },
    { value: 100, label: "✨ Excited", color: "from-pink-500/50" },
  ];

  const [emotion, setEmotion] = useState(50);
  const [mounted, setMounted] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const welcomeSteps = [
    {
      title: "Hi, I'm Aura 👋",
      description:
        "Your AI companion for emotional well-being. I'm here to provide a safe, judgment-free space for you to express yourself.",
      icon: Waves,
    },
    {
      title: "Personalized Support 🌱",
      description:
        "I adapt to your needs and emotional state, offering evidence-based techniques and gentle guidance when you need it most.",
      icon: Brain,
    },
    {
      title: "Your Privacy Matters 🛡️",
      description:
        "Our conversations are completely private and secure. I follow strict ethical guidelines and respect your boundaries.",
      icon: Shield,
    },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentEmotion =
    emotions.find((em) => Math.abs(emotion - em.value) < 15) || emotions[2];

  const features = [
    {
      icon: HeartPulse,
      title: "24/7 Support",
      description: "Always here to listen and support you, any time of day",
      color: "from-rose-500/20",
      delay: 0.2,
    },
    {
      icon: Lightbulb,
      title: "Smart Insights",
      description: "Personalized guidance powered by emotional intelligence",
      color: "from-amber-500/20",
      delay: 0.4,
    },
    {
      icon: Lock,
      title: "Private & Secure",
      description: "Your conversations are always confidential and encrypted",
      color: "from-emerald-500/20",
      delay: 0.6,
    },
    {
      icon: MessageSquareHeart,
      title: "Evidence-Based",
      description: "Therapeutic techniques backed by clinical research",
      color: "from-blue-500/20",
      delay: 0.8,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen overflow-hidden bg-gradient-to-br from-background via-background/95 to-background/90 dark:from-background dark:via-background/95 dark:to-background/90">
      {/* Hero Section with Advanced Grid */}
      <section className="relative min-h-screen grid grid-cols-1 lg:grid-cols-12 gap-8 mt-20 px-4 sm:px-6 lg:px-8">
        {/* Background Elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div
            className={`absolute w-[500px] h-[500px] rounded-full blur-3xl top-0 -left-20 transition-all duration-700 ease-in-out
            bg-gradient-to-r ${currentEmotion.color} to-transparent opacity-60 dark:opacity-40`}
          />
          <div className="absolute w-[400px] h-[400px] rounded-full bg-secondary/10 dark:bg-secondary/5 blur-3xl bottom-0 right-0 animate-pulse delay-700" />
          <div className="absolute inset-0 bg-background/80 dark:bg-background/90 backdrop-blur-3xl" />
        </div>
        <Ripple className="opacity-60 dark:opacity-40" />

        {/* Main Content - Takes full width on mobile, centered on desktop */}
        <div className="lg:col-span-12 flex flex-col items-center justify-center py-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="space-y-8 text-center max-w-5xl mx-auto"
          >
            {/* Enhanced badge */}
            <div className="inline-flex items-center gap-2 rounded-full px-6 py-2 text-sm border border-primary/20 bg-primary/5 dark:bg-primary/10 backdrop-blur-sm hover:border-primary/40 transition-all duration-300">
              <Waves className="w-4 h-4 animate-wave text-primary" />
              <span className="relative text-foreground/90 dark:text-foreground font-medium">
                Your AI Agent Mental Health Companion
              </span>
            </div>

            {/* Enhanced main heading with responsive typography */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight">
              <span className="inline-block bg-gradient-to-r from-primary via-primary/90 to-secondary bg-clip-text text-transparent hover:to-primary transition-all duration-300">
                Find Peace
              </span>
              <br />
              <span className="inline-block mt-2 bg-gradient-to-b from-foreground to-foreground/90 dark:from-foreground dark:to-foreground/80 bg-clip-text text-transparent">
                of Mind
              </span>
            </h1>

            {/* Enhanced description */}
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground leading-relaxed">
              Experience a new way of emotional support. Our AI companion is here
              to listen, understand, and guide you through life's journey.
            </p>

            {/* Emotion slider section with enhanced grid layout */}
            <motion.div
              className="w-full max-w-4xl mx-auto space-y-8 py-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <div className="space-y-6 text-center">
                <p className="text-base text-muted-foreground/80 font-medium">
                  Whatever you're feeling, we're here to listen
                </p>
                
                {/* Emotion grid - responsive layout */}
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 max-w-md mx-auto">
                  {emotions.map((em) => (
                    <div
                      key={em.value}
                      className={`transition-all duration-500 ease-out cursor-pointer hover:scale-105 p-3 rounded-xl ${
                        Math.abs(emotion - em.value) < 15
                          ? "opacity-100 scale-110 bg-primary/10 dark:bg-primary/20"
                          : "opacity-70 scale-100 hover:bg-primary/5"
                      }`}
                      onClick={() => setEmotion(em.value)}
                    >
                      <div className="text-2xl sm:text-3xl mb-2">
                        {em.label.split(" ")[0]}
                      </div>
                      <div className="text-xs font-medium text-muted-foreground">
                        {em.label.split(" ")[1]}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Enhanced slider */}
              <div className="relative px-4">
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${currentEmotion.color} to-transparent blur-2xl -z-10 transition-all duration-500`}
                />
                <Slider
                  value={[emotion]}
                  onValueChange={(value) => setEmotion(value[0])}
                  min={0}
                  max={100}
                  step={1}
                  className="py-6"
                />
              </div>

              <div className="text-center">
                <p className="text-sm text-muted-foreground animate-pulse">
                  Slide to express how you're feeling today
                </p>
              </div>
            </motion.div>

            {/* Enhanced CTA section */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <Button
                size="lg"
                onClick={() => setShowDialog(true)}
                className="relative group h-14 px-8 rounded-full bg-gradient-to-r from-primary via-primary/90 to-secondary hover:to-primary shadow-lg shadow-primary/20 dark:shadow-primary/10 transition-all duration-500 hover:shadow-xl hover:shadow-primary/30"
              >
                <span className="relative z-10 font-medium flex items-center gap-2 text-lg">
                  Begin Your Journey
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 lg:col-span-12 flex justify-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-primary/20 dark:border-primary/30 flex items-start justify-center p-1 hover:border-primary/40 transition-colors duration-300">
            <div className="w-1 h-2 rounded-full bg-primary animate-scroll" />
          </div>
        </motion.div>
      </section>

      {/* Enhanced Features Grid Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          {/* Section Header with improved grid */}
          <motion.div className="text-center mb-16 space-y-6 max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary/90 to-primary bg-clip-text text-transparent dark:text-primary/90">
              How Aura Helps You
            </h2>
            <p className="text-foreground dark:text-foreground/95 max-w-2xl mx-auto font-medium text-lg lg:text-xl">
              Experience a new kind of emotional support, powered by empathetic AI
            </p>
          </motion.div>

          {/* Enhanced Features Grid - Responsive and with better spacing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 relative">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: feature.delay, duration: 0.5 }}
                viewport={{ once: true }}
                className="h-full"
              >
                <Card className="group relative overflow-hidden border border-primary/10 hover:border-primary/20 dark:border-primary/20 dark:hover:border-primary/30 transition-all duration-300 h-full bg-card/30 dark:bg-card/80 backdrop-blur-sm hover:shadow-lg dark:hover:shadow-primary/5">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.color} to-transparent opacity-0 group-hover:opacity-20 dark:group-hover:opacity-30 transition-opacity duration-500`}
                  />
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-xl bg-primary/10 dark:bg-primary/20 group-hover:bg-primary/20 dark:group-hover:bg-primary/30 transition-colors duration-300">
                        <feature.icon className="w-6 h-6 text-primary dark:text-primary/90" />
                      </div>
                      <h3 className="font-semibold tracking-tight text-foreground/90 dark:text-foreground text-lg">
                        {feature.title}
                      </h3>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground/90 dark:text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/20 dark:via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Welcome Dialog with improved styling */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[425px] bg-card/80 dark:bg-card/90 backdrop-blur-lg border border-primary/10 dark:border-primary/20">
          <DialogHeader>
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                {welcomeSteps[currentStep] && (
                  <div>
                    {React.createElement(welcomeSteps[currentStep].icon, {
                      className: "w-8 h-8 text-primary",
                    })}
                  </div>
                )}
              </div>
              <DialogTitle className="text-2xl text-center">
                {welcomeSteps[currentStep]?.title}
              </DialogTitle>
              <DialogDescription className="text-center text-base leading-relaxed">
                {welcomeSteps[currentStep]?.description}
              </DialogDescription>
            </motion.div>
          </DialogHeader>
          <div className="flex justify-between items-center mt-8">
            <div className="flex gap-2">
              {welcomeSteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentStep ? "bg-primary w-4" : "bg-primary/20"
                  }`}
                />
              ))}
            </div>
            <Button
              onClick={() => {
                if (currentStep < welcomeSteps.length - 1) {
                  setCurrentStep((c) => c + 1);
                } else {
                  setShowDialog(false);
                  setCurrentStep(0);
                  // Here you would navigate to the chat interface
                }
              }}
              className="relative group px-6"
            >
              <span className="flex items-center gap-2">
                {currentStep === welcomeSteps.length - 1 ? (
                  <>
                    Let's Begin
                    <Sparkles className="w-4 h-4 animate-pulse" />
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </>
                )}
              </span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
