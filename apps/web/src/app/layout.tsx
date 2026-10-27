import type { Metadata } from 'next';
import './globals.css';
import { WardrobeProvider } from '@/context/WardrobeContext';

export const metadata: Metadata = {
  title: 'StyleMuse AI - Your Personal AI Wardrobe Stylist',
  description: 'AI-powered digital wardrobe curation, smart clothing recognition, and personalized outfit generation from real clothes.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased selection:bg-stone-200">
        <WardrobeProvider>{children}</WardrobeProvider>
      </body>
    </html>
  );
}
