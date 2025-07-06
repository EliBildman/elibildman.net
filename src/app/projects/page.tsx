'use client';

import Link from 'next/link';
import { useState } from 'react';

const projects = [
  {
    id: 1,
    title: 'BetaPoker',
    description:
      "BetaPoker is a CFR-based automated poker agent trained using minimal resources. It can play heads-up limit Texas Hold'em and demonstrates advanced game theory strategies. The project explores reinforcement learning and decision-making under uncertainty.",
    image: '/project_images/one.jpg',
    link: 'https://github.com/EliBildman/BetaPoker',
    tags: ['Python', 'Poker', 'AI', 'CFR'],
  },
  {
    id: 2,
    title: 'A3',
    description:
      'A3 is a Node.js/React/Arduino server for smart home device control. It provides a web interface and API for managing commercial and custom smart devices, supporting automation, scheduling, and real-time monitoring across platforms.',
    link: 'https://github.com/EliBildman/A3',
    image: '/project_images/two.webp',
    tags: ['Node.js', 'React', 'Arduino', 'IoT'],
  },
  {
    id: 3,
    title: 'Portfolio Website',
    description:
      'This very site, built with Next.js and Tailwind CSS, showcases my projects, resume, and blog posts. It features a minimalist design, animated rainbow highlights, and a modern, responsive layout.',
    // image: '/project_images/two.webp',
    link: '/projects/portfolio',
    tags: ['Next.js', 'Tailwind', 'React'],
  },
  {
    id: 4,
    title: 'Fake Project',
    description:
      'A placeholder project for layout testing. This project demonstrates the card layout, divider animation, and navigation structure for the portfolio site.',
    // No image for this project
    link: '/projects/fake',
    tags: ['Demo', 'Layout'],
  },
];

function getLinkLabel(link: string) {
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
    <img
      src={src}
      alt={alt}
      className="w-48 h-48 object-cover rounded-xl border border-gray-200 bg-gray-100 flex-shrink-0"
      onError={() => setError(true)}
    />
  );
}

export default function ProjectsPage() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  return (
    <main className="max-w-4xl w-full mx-auto mt-4 px-2 flex flex-col">
      {projects.map((project, idx) => (
        <div key={project.id}>
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
          <Link
            href={project.link}
            className="group flex items-center gap-14 p-8 bg-white rounded-2xl transition-all min-h-[220px] relative"
            style={{ minHeight: '220px' }}
            onMouseEnter={() => setHoveredIdx(idx)}
            onMouseLeave={() => setHoveredIdx(null)}
          >
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
              {getLinkLabel(project.link) && (
                <span className="block text-xs text-gray-400 mt-4 text-left pl-2 tracking-widest">
                  {getLinkLabel(project.link)}
                </span>
              )}
            </div>
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
          </Link>
        </div>
      ))}
    </main>
  );
}
