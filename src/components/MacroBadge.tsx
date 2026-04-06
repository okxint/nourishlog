'use client';

interface MacroBadgeProps {
  label: string;
  current: number;
  goal: number;
  color: string;
  unit?: string;
}

export default function MacroBadge({ label, current, goal, color, unit = 'g' }: MacroBadgeProps) {
  const progress = Math.min((current / goal) * 100, 100);
  const over = current > goal;

  return (
    <div className="glass-card rounded-2xl px-3.5 py-3 flex-1 min-w-0">
      <div className="flex items-center gap-1.5 mb-2">
        <div className="w-2 h-2 rounded-full" style={{ background: color }} />
        <span className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wide"
          style={{ fontFamily: 'JetBrains Mono, monospace' }}>
          {label}
        </span>
      </div>
      <div className="flex items-baseline gap-0.5 mb-2">
        <span className="text-lg font-bold" style={{ color, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{current}</span>
        <span className="text-[10px] text-[var(--text-muted)]">/ {goal}{unit}</span>
      </div>
      <div className="w-full h-1.5 rounded-full bg-[var(--bg-card-hover)]">
        <div
          className="h-full rounded-full macro-bar transition-all"
          style={{
            width: `${progress}%`,
            background: over ? 'var(--rose)' : color,
          }}
        />
      </div>
    </div>
  );
}
