import type { Metadata } from 'next';
import Navbar from './Navbar';
import FooterWrapper from './FooterWrapper';
import DataPreloader from './DataPreloader';
import './globals.css';

export const metadata: Metadata = {
  title: 'Eli Bildman',
  description: 'Portfolio website for Eli Bildman, Software Engineer.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-50 min-h-screen">
        <DataPreloader />
        <div className="flex flex-col min-h-screen">
          <div id="navbar">
            <Navbar />
          </div>
          <div className="flex-1 px-4">{children}</div>
          <div id="footer">
            <FooterWrapper />
          </div>
        </div>
      </body>
    </html>
  );
}
