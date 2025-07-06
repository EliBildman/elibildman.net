'use client';

import { useEffect } from 'react';

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Hide Navbar and Footer
    const navbar = document.getElementById('navbar');
    const footer = document.getElementById('footer');

    if (navbar) navbar.style.display = 'none';
    if (footer) footer.style.display = 'none';

    // Add studio class to body
    document.body.classList.add('studio-mode');

    return () => {
      if (navbar) navbar.style.display = '';
      if (footer) footer.style.display = '';
      document.body.classList.remove('studio-mode');
    };
  }, []);

  return <>{children}</>;
}
