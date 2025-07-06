'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

const navLinkClass =
  'text-gray-500 hover:text-black hover:no-underline transition-colors';
const links = [
  { href: '/', label: 'Home', match: (p: string) => p === '/' },
  {
    href: '/projects',
    label: 'Projects',
    match: (p: string) => p.startsWith('/projects'),
  },
  {
    href: '/resume',
    label: 'Resume',
    match: (p: string) => p.startsWith('/resume'),
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const [underline, setUnderline] = useState<null | {
    left: number;
    width: number;
    top: number;
    height: number;
  }>(null);
  const [hasMounted, setHasMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    const idx = links.findIndex((l) => l.match(pathname));
    const link = linkRefs.current[idx];
    const container = containerRef.current;
    if (link && container) {
      const linkRect = link.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      setUnderline({
        left: linkRect.left - containerRect.left,
        width: linkRect.width,
        top: linkRect.top - containerRect.top + linkRect.height + 2, // 2px below the text
        height: 2,
      });
    }
    if (!hasMounted) setHasMounted(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <nav className="sticky top-0 z-20 w-full bg-white border-b border-gray-200">
      <div
        className="relative max-w-2xl w-full mx-auto flex gap-8 text-base font-semibold justify-start px-4 py-4"
        ref={containerRef}
      >
        {links.map((link, i) => (
          <Link
            key={link.href}
            href={link.href}
            ref={(el) => {
              linkRefs.current[i] = el;
            }}
            className={link.match(pathname) ? 'text-black' : navLinkClass}
          >
            {link.label}
          </Link>
        ))}
        {/* Animated rainbow underline */}
        {underline && (
          <span
            className={`absolute rounded-full ${
              hasMounted ? 'transition-all duration-300' : ''
            }`}
            style={{
              left: underline.left,
              width: underline.width,
              top: underline.top,
              height: underline.height,
              background:
                'linear-gradient(90deg, #f472b6, #facc15, #4ade80, #38bdf8, #a78bfa)',
              backgroundSize: '200% 100%',
              animation: 'rainbow-move 2s linear infinite',
              transition: hasMounted ? undefined : 'none',
            }}
          />
        )}
      </div>
    </nav>
  );
}
