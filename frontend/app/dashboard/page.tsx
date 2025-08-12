"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Brain,
  Calendar,
  Activity,
  Sun,
  Moon,
  Heart,
  Trophy,
  Bell,
  AlertCircle,
  PhoneCall,
  Sparkles,
  MessageSquare,
  BrainCircuit,
  ArrowRight,
  X,
  Loader2,
  TrendingUp,
  Users,
  Shield,
  Zap,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";

import { MoodForm } from "@/components/mood/mood-form";
import { AnxietyGames } from "@/components/games/anxiety-games";

import {
  getUserActivities,
  saveMoodData,
  logActivity,
} from "@/lib/static-dashboard-data";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "@/lib/contexts/session-context";

export default function DashboardPage() {
  const { isAuthenticated, loading: authLoading, user } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [currentTime, setCurrentTime] = useState(new Date());
  const [moodData, setMoodData] = useState(null);
  const [activities, setActivities] = useState([]);
  const [showMoodForm, setShowMoodForm] = useState(false);
  const [showGames, setShowGames] = useState(false);
  const [showCrisisDialog, setShowCrisisDialog] = useState(false);
  const [loading, setLoading] = useState(true);

  // Quick stats data
  const quickStats = [
    {
      title: "Sessions This Week",
      value: "12",
      change: "+3 from last week",
      icon: MessageSquare,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10 dark:bg-blue-500/20",
    },
    {
      title: "Mood Average",
      value: "7.2/10",
      change: "+0.8 improvement",
      icon: Heart,
      color: "text-rose-500",
      bgColor: "bg-rose-500/10 dark:bg-rose-500/20",
    },
    {
      title: "Streak Days",
      value: "15",
      change: "Personal best!",
      icon: Trophy,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10 dark:bg-amber-500/20",
    },
    {
      title: "Progress Score",
      value: "85%",
      change: "+12% this month",
      icon: TrendingUp,
      color: "text-green-500",
      bgColor: "bg-green-500/10 dark:bg-green-500/20",
    },
  ];

  // Quick actions
  const quickActions = [
    {
      title: "Start Therapy Session",
      description: "Begin a guided conversation with your AI therapist",
      icon: BrainCircuit,
      color: "from-primary to-primary/80",
      action: () => router.push("/therapy/new"),
    },
    {
      title: "Log Your Mood",
      description: "Track how you're feeling right now",
      icon: Heart,
      color: "from-rose-500 to-rose-400",
      action: () => setShowMoodForm(true),
    },
    {
      title: "Mindfulness Games",
      description: "Reduce anxiety with interactive exercises",
      icon: Sparkles,
      color: "from-purple-500 to-purple-400",
      action: () => setShowGames(true),
    },
    {
      title: "Crisis Support",
      description: "Get immediate help if you're in crisis",
      icon: PhoneCall,
      color: "from-red-500 to-red-400",
      action: () => setShowCrisisDialog(true),
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
      return;
    }
    
    if (isAuthenticated) {
      loadDashboardData();
    }
  }, [isAuthenticated, authLoading, router]);

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const [userActivities] = await Promise.all([
        getUserActivities(),
      ]);
      setActivities(userActivities);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleMoodSubmit = async (mood, notes) => {
    try {
      const data = await saveMoodData(mood, notes);
      setMoodData(data);
      setShowMoodForm(false);
      await logActivity("mood_logged", { mood, notes });
      await loadDashboardData();
    } catch (error) {
      console.error("Error saving mood:", error);
    }
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 dark:from-background dark:via-background/95 dark:to-background/90 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 dark:from-background dark:via-background/95 dark:to-background/90">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute w-72 h-72 bg-primary/5 dark:bg-primary/3 rounded-full blur-3xl top-20 left-10 animate-pulse" />
        <div className="absolute w-96 h-96 bg-secondary/5 dark:bg-secondary/3 rounded-full blur-3xl bottom-20 right-10 animate-pulse delay-700" />
      </div>

      <Container className="py-8 space-y-8 relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center lg:text-left"
        >
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground dark:text-foreground mb-4">
            {getGreeting()}, {user?.name || "there"}! 👋
          </h1>
          <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl">
            Welcome back to your mental wellness journey. How are you feeling today?
          </p>
        </motion.div>

        {/* Quick Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {quickStats.map((stat, index) => (
            <Card key={stat.title} className="bg-card/50 dark:bg-card/80 backdrop-blur-sm border border-primary/10 dark:border-primary/20 hover:border-primary/20 dark:hover:border-primary/30 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {stat.value}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {stat.change}
                    </p>
                  </div>
                  <div className={cn("p-3 rounded-xl", stat.bgColor)}>
                    <stat.icon className={cn("w-6 h-6", stat.color)} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Quick Actions Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          <h2 className="text-2xl lg:text-3xl font-bold text-foreground dark:text-foreground">
            Quick Actions
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <Card 
                key={action.title} 
                className="group cursor-pointer bg-card/50 dark:bg-card/80 backdrop-blur-sm border border-primary/10 dark:border-primary/20 hover:border-primary/20 dark:hover:border-primary/30 transition-all duration-300 hover:shadow-lg dark:hover:shadow-primary/5"
                onClick={action.action}
              >
                <CardContent className="p-6 space-y-4">
                  <div className={cn(
                    "w-12 h-12 rounded-xl bg-gradient-to-r flex items-center justify-center group-hover:scale-110 transition-transform duration-300",
                    action.color
                  )}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-semibold text-foreground dark:text-foreground">
                      {action.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {action.description}
                    </p>
                  </div>
                  
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity & Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Recent Activity */}
          <Card className="bg-card/50 dark:bg-card/80 backdrop-blur-sm border border-primary/10 dark:border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {activities.length > 0 ? (
                activities.slice(0, 5).map((activity, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-background/50 dark:bg-background/80">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">
                        {activity.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(activity.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No recent activity. Start your wellness journey today!
                </p>
              )}
            </CardContent>
          </Card>

          {/* AI Insights */}
          <Card className="bg-card/50 dark:bg-card/80 backdrop-blur-sm border border-primary/10 dark:border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-primary" />
                AI Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-primary/5 dark:bg-primary/10 border border-primary/10 dark:border-primary/20">
                  <h4 className="font-medium text-foreground mb-2">Weekly Progress</h4>
                  <p className="text-sm text-muted-foreground">
                    You've been consistently engaging with therapy sessions this week. 
                    Your mood tracking shows a positive trend, especially in the evenings.
                  </p>
                </div>
                
                <div className="p-4 rounded-lg bg-secondary/5 dark:bg-secondary/10 border border-secondary/10 dark:border-secondary/20">
                  <h4 className="font-medium text-foreground mb-2">Recommendation</h4>
                  <p className="text-sm text-muted-foreground">
                    Consider trying the mindfulness exercises in the evening when 
                    your stress levels tend to be higher.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </Container>

      {/* Dialogs */}
      <Dialog open={showMoodForm} onOpenChange={setShowMoodForm}>
        <DialogContent className="bg-card/95 dark:bg-card/95 backdrop-blur-lg">
          <DialogHeader>
            <DialogTitle>How are you feeling?</DialogTitle>
            <DialogDescription>
              Take a moment to reflect on your current emotional state
            </DialogDescription>
          </DialogHeader>
          <MoodForm onSubmit={handleMoodSubmit} onCancel={() => setShowMoodForm(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={showGames} onOpenChange={setShowGames}>
        <DialogContent className="max-w-4xl bg-card/95 dark:bg-card/95 backdrop-blur-lg">
          <DialogHeader>
            <DialogTitle>Mindfulness Games</DialogTitle>
            <DialogDescription>
              Interactive exercises to help you relax and center yourself
            </DialogDescription>
          </DialogHeader>
          <AnxietyGames />
        </DialogContent>
      </Dialog>

      <Dialog open={showCrisisDialog} onOpenChange={setShowCrisisDialog}>
        <DialogContent className="bg-card/95 dark:bg-card/95 backdrop-blur-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertCircle className="w-5 h-5" />
              Crisis Support
            </DialogTitle>
            <DialogDescription>
              If you're in immediate danger or having thoughts of self-harm, please reach out for help immediately.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Alert className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20">
              <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
              <AlertTitle className="text-red-800 dark:text-red-200">Emergency Resources</AlertTitle>
              <AlertDescription className="text-red-700 dark:text-red-300">
                • National Suicide Prevention Lifeline: 988
                <br />
                • Crisis Text Line: Text HOME to 741741
                <br />
                • Emergency Services: 911
              </AlertDescription>
            </Alert>
            <div className="flex gap-3">
              <Button 
                variant="destructive" 
                className="flex-1"
                onClick={() => window.open("tel:988", "_self")}
              >
                <PhoneCall className="w-4 h-4 mr-2" />
                Call 988
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setShowCrisisDialog(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
