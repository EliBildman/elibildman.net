'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { getCachedPosts, getCachedProfile } from '../lib/sanity-cache';

interface Post {
  _id: string;
  title: string;
  excerpt: string;
  link: string;
  publishedAt: string;
  image: string;
}

interface Profile {
  name: string;
  title: string;
  bio: string;
  profileImage: string;
}

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

function BioSkeleton() {
  return (
    <div className="flex flex-row items-center gap-8">
      <div className="flex flex-col gap-3 flex-1">
        <div className="h-10 bg-gray-200 rounded w-1/3 animate-pulse" />
        <div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse" />
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-4/5 animate-pulse" />
        </div>
      </div>
      <div className="w-40 h-40 bg-gray-200 rounded-xl animate-pulse" />
    </div>
  );
}

function getFaviconUrl(link: string) {
  try {
    const url = new URL(link);
    return `https://www.google.com/s2/favicons?domain=${url.hostname}&sz=64`;
  } catch {
    return '/favicon.ico';
  }
}

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [postsData, profileData] = await Promise.all([
          getCachedPosts(),
          getCachedProfile(),
        ]);
        setPosts(postsData);
        setProfile(profileData);
        // Set loading to false immediately when data is available
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const isExternalLink = (url: string) => {
    return url.startsWith('http');
  };

  return (
    <main className="max-w-2xl w-full mx-auto mt-8 pt-2 pb-6 px-2 relative z-10">
      {loading ? (
        <BioSkeleton />
      ) : (
        <div className="flex flex-row items-center gap-8">
          <div className="flex flex-col gap-3 flex-1">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
              {profile?.name || 'Eli Bildman'}
            </h1>
            <h2 className="text-lg text-gray-500 font-semibold">
              {profile?.title || 'Software Engineer'}
            </h2>
            <p className="text-base text-gray-700 leading-relaxed">
              {profile?.bio ||
                "Hi, I'm Eli. I'm a software engineer at Building36. I work on smart home automation, IoT, and full-stack web technologies. Here are some things I'm proud of."}
            </p>
          </div>
          <Image
            src={profile?.profileImage || '/profile.jpeg'}
            alt="Profile photo"
            width={160}
            height={160}
            className="w-40 h-40 object-cover rounded-xl border border-gray-200 bg-gray-100"
          />
        </div>
      )}
      {/* Subtle rainbow divider */}
      <div className="h-0.5 my-8 rounded-full bg-gradient-to-r from-pink-400 via-yellow-400 via-green-400 via-sky-400 to-purple-400 opacity-60 rainbow-animate mx-2 sm:mx-4 md:w-[calc(100%+3rem)] md:ml-[-1.5rem] md:mx-0" />

      <section>
        <div className="flex flex-col gap-8">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => <PostSkeleton key={i} />)
            : posts.map((post) => (
                <div key={post._id} className="rainbow-border-wrapper">
                  <a
                    href={post.link}
                    target={isExternalLink(post.link) ? '_blank' : undefined}
                    rel={
                      isExternalLink(post.link)
                        ? 'noopener noreferrer'
                        : undefined
                    }
                    className="group block"
                    style={{ textDecoration: 'none' }}
                  >
                    <div className="rainbow-border-inner flex items-center gap-6 p-6 rounded-xl min-h-[112px]">
                      <Image
                        src={post.image || getFaviconUrl(post.link)}
                        alt={post.title}
                        width={96}
                        height={96}
                        className={`w-24 h-24 object-cover rounded-md border border-gray-200 bg-gray-100 ${post.image ? '' : 'p-6 object-contain'}`}
                      />
                      <div className="flex-1 ml-6">
                        <div className="text-xl font-semibold text-gray-900">
                          {post.title}
                        </div>
                        <div className="text-gray-600 text-base mt-1">
                          {post.excerpt}
                        </div>
                      </div>
                      <span
                        className="ml-2 text-gray-300 text-2xl flex items-center"
                        aria-hidden="true"
                      >
                        <svg
                          width="32"
                          height="32"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-gray-300"
                        >
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                      </span>
                    </div>
                  </a>
                </div>
              ))}
        </div>
      </section>
    </main>
  );
}
