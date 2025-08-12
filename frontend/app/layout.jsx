import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SessionProvider } from "@/lib/contexts/session-context";

export const metadata = {
  title: "Aura - AI Mental Health Companion",
  description: "Your AI companion for emotional well-being. Find peace of mind with personalized support and guidance.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <body className="min-h-screen bg-background font-sans antialiased transition-colors duration-300 dark:bg-background">
        <ThemeProvider>
          <SessionProvider>
            <div className="relative flex min-h-screen flex-col bg-gradient-to-br from-background via-background/98 to-background/95 dark:from-background dark:via-background/98 dark:to-background/95">
              {/* Background Pattern */}
              <div className="fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] dark:bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)]" />
                <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/5 dark:bg-primary/3 opacity-20 blur-[100px]" />
              </div>
              
              <Header />
              <main className="flex-1 relative z-10">{children}</main>
              <Footer />
            </div>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
