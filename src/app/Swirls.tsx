import React, { useEffect, useState } from 'react';

const SWIRL_COLORS = [
  '#38bdf8', // sky
  '#f472b6', // pink
  '#facc15', // yellow
  '#34d399', // green
  '#a78bfa', // purple
  '#fb7185', // red
  '#fbbf24', // amber
  '#818cf8', // indigo
];

const SWIRL_BUFFER = 40;

function Swirl({
  color,
  size,
  top,
  side,
  y,
  offset,
}: {
  color: string;
  size: number;
  top: number;
  side: 'left' | 'right';
  y: number;
  offset: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 125"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`absolute`}
      style={{
        top: `${top}%`,
        [side]: `-${offset}px`,
        zIndex: 0,
        pointerEvents: 'auto',
        transition: 'transform 0.5s',
        cursor: 'pointer',
      }}
      onMouseOver={(e) => (e.currentTarget.style.transform = 'rotate(-360deg)')}
      onMouseOut={(e) => (e.currentTarget.style.transform = '')}
    >
      <path
        d="M52,32a2,2,0,0,0,0-4,22,22,0,0,0,0,44h1a17,17,0,0,0,0-34H52a12,12,0,0,0,0,24h1a7,7,0,0,0,0-14H52a2,2,0,0,0,0,4h1a3,3,0,0,1,0,6H52a8,8,0,0,1,0-16h1a13,13,0,0,1,0,26H52a18,18,0,0,1,0-36Z"
        fill={color}
      />
    </svg>
  );
}

function generateSwirls(count = 9, gutterWidth = 120) {
  const swirls: {
    color: string;
    size: number;
    top: number;
    side: 'left' | 'right';
    y: number;
    offset: number;
  }[] = [];
  for (let i = 0; i < count; i++) {
    const color = SWIRL_COLORS[Math.floor(Math.random() * SWIRL_COLORS.length)];
    const size = 30 + Math.random() * 20; // 30-50px
    const top = 5 + (90 / count) * i + Math.random() * (60 / count); // spread vertically
    const side: 'left' | 'right' = i % 2 === 0 ? 'left' : 'right';
    const maxOffset = Math.max(gutterWidth - size - SWIRL_BUFFER, SWIRL_BUFFER);
    const offset = SWIRL_BUFFER + Math.random() * (maxOffset - SWIRL_BUFFER);
    swirls.push({ color, size, top, side, y: i, offset });
  }
  return swirls;
}

export function Swirls({
  gutterWidth = 120,
  count = 9,
}: {
  gutterWidth?: number;
  count?: number;
}) {
  const [swirls, setSwirls] = useState<
    Array<{
      color: string;
      size: number;
      top: number;
      side: 'left' | 'right';
      y: number;
      offset: number;
    }>
  >([]);
  useEffect(() => {
    setSwirls(generateSwirls(count, gutterWidth));
  }, [gutterWidth, count]);
  if (gutterWidth < SWIRL_BUFFER * 2) return null;
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none select-none z-0">
      {swirls.map((swirl, i) => (
        <Swirl key={i} {...swirl} />
      ))}
    </div>
  );
}
