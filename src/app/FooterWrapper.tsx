'use client';

import { useEffect, useState } from 'react';
import { getCachedLinks } from '../lib/sanity-cache';
import Footer from './Footer';

interface Link {
  _id: string;
  displayName: string;
  url: string;
  icon?: string;
}

export default function FooterWrapper() {
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLinks() {
      try {
        const linksData = await getCachedLinks();
        setLinks(linksData);
      } catch (error) {
        console.error('Error fetching links:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchLinks();
  }, []);

  if (loading) {
    return null;
  }

  return <Footer links={links} />;
}
