'use client';

import { useEffect, useState } from 'react';

interface CalorieRingProps {
  consumed: number;
  goal: number;
}

export default function CalorieRing({ consumed, goal }: CalorieRingProps) {
  const [offset, setOffset] = useState(314);
  const radius = 100;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(consumed / goal, 1);
  const remaining = Math.max(goal - consumed, 0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOffset(circumference * (1 - progress));
    }, 100);
    return () => clearTimeout(timer);
  }, [circumference, progress]);

  return (
    <div className="relative flex items-center justify-center my-6">
      <svg width="240" height="240" viewBox="0 0 240 240" className="transform -rotate-90">
        <circle
          cx="120" cy="120" r={radius}
          fill="none"
          stroke="var(--bg-card)"
          strokeWidth="14"
        />
        <circle
          cx="120" cy="120" r={radius}
          fill="none"
          stroke="url(#greenGradient)"
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="progress-ring"
        />
        <defs>
          <linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4ADE80" />
            <stop offset="100%" stopColor="#22D3EE" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-5xl font-bold" style={{ fontFamily: 'Sora, sans-serif' }}>
          {consumed.toLocaleString()}
        </span>
        <span className="text-sm text-[var(--text-muted)] mt-0.5">kcal</span>
        <span className="text-xs text-[var(--text-secondary)] mt-2">
          {remaining.toLocaleString()} remaining
        </span>
      </div>
    </div>
  );
}
