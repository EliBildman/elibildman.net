import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Link from 'next/link';
import Navbar from './Navbar';
import Footer from './Footer';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Eli Bildman Portfolio',
  description: 'Portfolio website for Eli Bildman, Software Engineer.',
};

const navLinkClass =
  'text-gray-500 hover:text-black hover:no-underline transition-colors';
const footerLinkClass =
  'text-gray-500 hover:text-black hover:no-underline transition-colors';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-50 min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 px-4">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
