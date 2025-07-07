'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { getCachedProjects } from '../../lib/sanity-cache';

function ProjectSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="flex items-center gap-8 sm:gap-14 p-6 sm:p-8 bg-white rounded-2xl min-h-[220px]">
        <div className="w-32 h-32 sm:w-48 sm:h-48 bg-gray-200 rounded-xl flex-shrink-0" />
        <div className="flex-1 flex flex-col justify-center space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
            <div className="h-4 bg-gray-200 rounded w-4/5" />
          </div>
        </div>
      </div>
    </div>
  );
}

interface Project {
  _id: string;
  title: string;
  description: string;
  url?: string;
  tags: string[];
  image?: string;
}

function getLinkLabel(link?: string) {
  if (!link) return null;
  if (link.startsWith('http')) {
    try {
      const url = new URL(link);
      return url.hostname.replace(/^www\./, '').toUpperCase();
    } catch {
      return link.toUpperCase();
    }
  }
  return null;
}

function ProjectImage({ src, alt }: { src?: string; alt: string }) {
  const [error, setError] = useState(false);
  if (!src || error) {
    return null;
  }
  return (
    <Image
      src={src}
      alt={alt}
      width={192}
      height={192}
      className="w-32 h-32 sm:w-48 sm:h-48 object-cover rounded-xl border border-gray-200 bg-gray-100 flex-shrink-0"
      onError={() => setError(true)}
    />
  );
}

export default function ProjectsPage() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const projectsData = await getCachedProjects();
        setProjects(projectsData);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  if (loading) {
    return (
      <main className="max-w-4xl w-full mx-auto mt-4 px-2 flex flex-col gap-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <ProjectSkeleton key={i} />
        ))}
      </main>
    );
  }

  return (
    <main className="max-w-4xl w-full mx-auto mt-4 px-2 flex flex-col">
      {projects.map((project, idx) => (
        <div key={project._id}>
          {/* Top divider except for the first project */}
          {idx > 0 && (
            <hr
              className={`rainbow-divider mx-16${
                hoveredIdx === idx || hoveredIdx === idx - 1
                  ? ' group-hovered'
                  : ''
              }`}
            />
          )}
          <div
            className={`group flex items-center gap-8 sm:gap-14 p-6 sm:p-8 bg-white rounded-2xl transition-all min-h-[220px] relative ${
              project.url ? 'cursor-pointer' : ''
            }`}
            style={{ minHeight: '220px' }}
            onMouseEnter={() => setHoveredIdx(idx)}
            onMouseLeave={() => setHoveredIdx(null)}
          >
            {project.url && (
              <Link href={project.url} className="absolute inset-0 z-10">
                <span className="sr-only">View {project.title}</span>
              </Link>
            )}
            <ProjectImage src={project.image} alt={project.title} />
            <div className="flex-1 flex flex-col justify-center">
              <div className="flex flex-wrap items-baseline gap-3 mb-4">
                <h2 className="text-3xl font-bold text-gray-900 transition-colors m-0 p-0">
                  {project.title}
                </h2>
                {project.tags && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="text-xs text-gray-400 tracking-widest uppercase pl-2"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <p className="text-base text-gray-700 font-normal leading-relaxed mb-2 max-w-[90%]">
                {project.description}
              </p>
              {getLinkLabel(project.url) && (
                <span className="block text-xs text-gray-400 mt-4 text-left pl-2 tracking-widest">
                  {getLinkLabel(project.url)}
                </span>
              )}
            </div>
            {project.url && (
              <span
                className="absolute right-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                aria-hidden="true"
              >
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-gray-400"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </span>
            )}
          </div>
        </div>
      ))}
    </main>
  );
}
