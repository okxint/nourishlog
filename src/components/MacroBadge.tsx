'use client';

interface MacroBadgeProps {
  label: string;
  current: number;
  goal: number;
  color: string;
  colorDim: string;
  unit?: string;
}

export default function MacroBadge({ label, current, goal, color, colorDim, unit = 'g' }: MacroBadgeProps) {
  const progress = Math.min((current / goal) * 100, 100);

  return (
    <div className="glass-card rounded-xl px-3 py-2.5 flex-1 min-w-0">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[11px] font-medium text-[var(--text-muted)]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
          {label}
        </span>
        <span className="text-[11px] font-semibold" style={{ color }}>
          {current}{unit}
        </span>
      </div>
      <div className="w-full h-1.5 rounded-full" style={{ background: colorDim }}>
        <div
          className="h-full rounded-full macro-bar"
          style={{ width: `${progress}%`, background: color }}
        />
      </div>
      <div className="text-[10px] text-[var(--text-muted)] mt-1 text-right">
        / {goal}{unit}
      </div>
    </div>
  );
}
