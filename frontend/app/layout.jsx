export const metadata = {
  title: 'AI Therapy Agent',
  description: 'Your AI companion for emotional well-being',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
