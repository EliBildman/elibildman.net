'use client';

import { useEffect } from 'react';
import { preloadAllData } from '../lib/sanity-cache';

export default function DataPreloader() {
  useEffect(() => {
    // Preload all data on initial page load
    preloadAllData().catch(console.error);
  }, []);

  // This component doesn't render anything
  return null;
}
