'use client';

import { useEffect, useState } from 'react';

interface CalorieRingProps {
  consumed: number;
  goal: number;
  size?: number;
}

export default function CalorieRing({ consumed, goal, size = 200 }: CalorieRingProps) {
  const [offset, setOffset] = useState(628);
  const radius = (size / 2) - 16;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(consumed / goal, 1);
  const remaining = Math.max(goal - consumed, 0);
  const over = consumed > goal;

  useEffect(() => {
    const timer = setTimeout(() => {
      setOffset(circumference * (1 - progress));
    }, 200);
    return () => clearTimeout(timer);
  }, [circumference, progress]);

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
        {/* Background ring */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none"
          stroke="var(--bg-card)"
          strokeWidth="10"
        />
        {/* Progress ring */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none"
          stroke={over ? 'url(#overGradient)' : 'url(#progressGradient)'}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="progress-ring"
        />
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#fb923c" />
          </linearGradient>
          <linearGradient id="overGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f43f5e" />
            <stop offset="100%" stopColor="#fb7185" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="text-4xl font-extrabold tracking-tight"
          style={{ fontFamily: 'Sora, sans-serif', color: over ? 'var(--rose)' : 'var(--text-primary)' }}
        >
          {consumed.toLocaleString()}
        </span>
        <span className="text-[11px] text-[var(--text-muted)] mt-0.5 font-medium" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
          kcal consumed
        </span>
        <span className={`text-xs mt-1.5 font-semibold ${over ? 'text-[var(--rose)]' : 'text-[var(--accent)]'}`}>
          {over ? `${(consumed - goal).toLocaleString()} over` : `${remaining.toLocaleString()} left`}
        </span>
      </div>
    </div>
  );
}
