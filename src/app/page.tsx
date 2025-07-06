'use client';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
// ('use client');

// Placeholder posts data (could be loaded from a JSON file or DB in the future)
const posts = [
  {
    id: 1,
    title: 'How I Built My Portfolio',
    description: 'A behind-the-scenes look at building this site.',
    image: '/posts_images/one.jpg', // Placeholder image path
    link: '/posts/portfolio-build',
    external: false,
  },
  {
    id: 2,
    title: 'Open Source Project: BetaPoker',
    description: 'Check out my open source poker agent on GitHub.',
    image: '/posts_images/one.jpg',
    link: 'https://github.com/EliBildman/BetaPoker',
    external: true,
  },
  {
    id: 3,
    title: 'Open Source Project: BetaPoker',
    description: 'Check out my open source poker agent on GitHub.',
    image: '/posts_images/one.jpg',
    link: 'https://github.com/EliBildman/BetaPoker',
    external: true,
  },
  {
    id: 4,
    title: 'Open Source Project: BetaPoker',
    description: 'Check out my open source poker agent on GitHub.',
    image: '/posts_images/one.jpg',
    link: 'https://github.com/EliBildman/BetaPoker',
    external: true,
  },
];

function PostSkeleton() {
  return (
    <div className="rainbow-border-wrapper animate-pulse">
      <div className="rainbow-border-inner flex items-center gap-6 p-6 rounded-xl min-h-[112px]">
        <div className="w-24 h-24 bg-gray-200 rounded-md" />
        <div className="flex-1 ml-6 space-y-3">
          <div className="h-6 bg-gray-200 rounded w-1/2" />
          <div className="h-4 bg-gray-200 rounded w-2/3" />
        </div>
        <span className="ml-2 text-sky-200 text-2xl">→</span>
      </div>
    </div>
  );
}

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [showPosts, setShowPosts] = useState(false);
  const [gutterWidth, setGutterWidth] = useState(120);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    function updateGutter() {
      const contentWidth = 672; // max-w-2xl
      const winWidth = window.innerWidth;
      const gutter = Math.max((winWidth - contentWidth) / 2, 60);
      setGutterWidth(gutter);
    }
    updateGutter();
    window.addEventListener('resize', updateGutter);
    return () => window.removeEventListener('resize', updateGutter);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loading) {
      const showTimer = setTimeout(() => setShowPosts(true), 10);
      // Set hasAnimated to true after the last post's animation finishes
      const totalAnim = 700 + (posts.length - 1) * 120;
      const animTimer = setTimeout(() => setHasAnimated(true), totalAnim);
      return () => {
        clearTimeout(showTimer);
        clearTimeout(animTimer);
      };
    } else {
      setShowPosts(false);
      setHasAnimated(false);
    }
  }, [loading]);

  return (
    <main className="max-w-2xl w-full mx-auto mt-8 pt-2 pb-6 px-2 relative z-10">
      <div className="flex flex-row items-center gap-8">
        <div className="flex flex-col gap-3 flex-1">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
            Eli Bildman
          </h1>
          <h2 className="text-lg text-gray-500 font-semibold">
            Software Engineer
          </h2>
          <p className="text-base text-gray-700 leading-relaxed">
            Hi, I'm Eli. I'm a software engineer at Building36. I work on smart
            home automation, IoT, and full-stack web technologies. Here are some
            things I'm proud of.
          </p>
        </div>
        <img
          src="/profile.jpeg" // Replace with actual image path
          alt="Profile photo"
          className="w-40 h-40 object-cover rounded-xl border border-gray-200 bg-gray-100"
        />
      </div>
      {/* Subtle rainbow divider */}
      <div className="w-full h-0.5 my-8 rounded-full bg-gradient-to-r from-pink-400 via-yellow-400 via-green-400 via-sky-400 to-purple-400 opacity-60 rainbow-animate" />
      <section>
        <div className="flex flex-col gap-8">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => <PostSkeleton key={i} />)
            : posts.map((post, idx) => (
                <div
                  key={post.id}
                  className={`rainbow-border-wrapper ${
                    !hasAnimated ? 'fade-in-up pointer-events-none' : ''
                  }`}
                  style={
                    !hasAnimated ? { animationDelay: `${idx * 120}ms` } : {}
                  }
                >
                  <a
                    href={post.link}
                    target={post.external ? '_blank' : undefined}
                    rel={post.external ? 'noopener noreferrer' : undefined}
                    className="group block"
                    style={{ textDecoration: 'none' }}
                  >
                    <div className="rainbow-border-inner flex items-center gap-6 p-6 rounded-xl min-h-[112px]">
                      <img
                        src={post.image}
                        // alt={post.title}
                        className="w-24 h-24 object-cover rounded-md border border-gray-200 bg-gray-100"
                      />
                      <div className="flex-1 ml-6">
                        <div className="text-xl font-semibold text-gray-900">
                          {post.title}
                        </div>
                        <div className="text-gray-600 text-base mt-1">
                          {post.description}
                        </div>
                      </div>
                      <span className="ml-2 text-sky-500 text-2xl">→</span>
                    </div>
                  </a>
                </div>
              ))}
        </div>
      </section>
    </main>
  );
}
