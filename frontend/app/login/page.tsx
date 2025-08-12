"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/api/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Lock, Mail, Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";
import { useSession } from "@/lib/contexts/session-context";
import { motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const { checkSession } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const response = await loginUser(email, password);
      localStorage.setItem("token", response.token);
      await checkSession();
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Login error:", error);
      setError(error.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 dark:from-background dark:via-background/95 dark:to-background/90 flex items-center justify-center p-4">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute w-72 h-72 bg-primary/10 dark:bg-primary/5 rounded-full blur-3xl top-20 left-10 animate-pulse" />
        <div className="absolute w-96 h-96 bg-secondary/10 dark:bg-secondary/5 rounded-full blur-3xl bottom-20 right-10 animate-pulse delay-700" />
      </div>

      <Container className="w-full max-w-md relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-card/80 dark:bg-card/90 backdrop-blur-lg border border-primary/10 dark:border-primary/20 shadow-xl">
            <CardHeader className="space-y-4 text-center pb-8">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mx-auto w-16 h-16 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center"
              >
                <Lock className="w-8 h-8 text-primary" />
              </motion.div>
              
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Welcome Back
              </CardTitle>
              
              <p className="text-muted-foreground text-base">
                Sign in to continue your mental wellness journey
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-lg bg-destructive/10 dark:bg-destructive/20 border border-destructive/20 dark:border-destructive/30 flex items-center gap-3"
                  >
                    <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
                    <p className="text-sm text-destructive font-medium">{error}</p>
                  </motion.div>
                )}

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-foreground">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="pl-10 h-12 bg-background/50 dark:bg-background/80 border-primary/20 dark:border-primary/30 focus:border-primary/40 dark:focus:border-primary/50 transition-colors"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium text-foreground">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="pl-10 pr-10 h-12 bg-background/50 dark:bg-background/80 border-primary/20 dark:border-primary/30 focus:border-primary/40 dark:focus:border-primary/50 transition-colors"
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        disabled={loading}
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground font-medium text-base shadow-lg hover:shadow-xl hover:shadow-primary/25 dark:hover:shadow-primary/15 transition-all duration-300"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>

              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-primary/20 dark:border-primary/30" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-card px-4 text-muted-foreground">
                      Don't have an account?
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <Button
                    asChild
                    variant="outline"
                    className="h-12 border-primary/20 dark:border-primary/30 hover:border-primary/40 dark:hover:border-primary/50 hover:bg-primary/5 dark:hover:bg-primary/10 transition-all duration-300"
                  >
                    <Link href="/signup" className="font-medium">
                      Create Account
                    </Link>
                  </Button>
                  
                  <Button
                    asChild
                    variant="ghost"
                    className="h-12 text-primary hover:text-primary/80 hover:bg-primary/5 dark:hover:bg-primary/10 transition-all duration-300"
                  >
                    <Link href="/forgot-password" className="text-sm">
                      Forgot your password?
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 text-center"
          >
            <p className="text-sm text-muted-foreground">
              By signing in, you agree to our{" "}
              <Link href="/terms" className="text-primary hover:text-primary/80 underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-primary hover:text-primary/80 underline">
                Privacy Policy
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </Container>
    </div>
  );
}
