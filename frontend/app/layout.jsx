import "./globals.css";

export const metadata = {
  title: "Aura - AI Mental Health Companion",
  description: "Your AI companion for emotional well-being. Find peace of mind with personalized support and guidance.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <div className="relative flex min-h-screen flex-col">
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
