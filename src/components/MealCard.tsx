'use client';

import { ChevronRight } from 'lucide-react';
import { FoodEntry } from '@/lib/types';
import { useRouter } from 'next/navigation';

const mealEmoji: Record<string, string> = {
  breakfast: '🌅',
  lunch: '☀️',
  dinner: '🌙',
  snack: '🍿',
};

export default function MealCard({ entry }: { entry: FoodEntry }) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(`/meal/${entry.id}`)}
      className="glass-card rounded-2xl p-3 flex items-center gap-3 w-full text-left
        hover:bg-[var(--bg-card-hover)] transition-all duration-200 active:scale-[0.98] group"
    >
      {entry.imageUrl ? (
        <img
          src={entry.imageUrl}
          alt={entry.name}
          className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
        />
      ) : (
        <div className="w-14 h-14 rounded-xl bg-[var(--bg-elevated)] flex items-center justify-center flex-shrink-0 text-2xl">
          {mealEmoji[entry.mealType] || '🍽️'}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-[13px] text-[var(--text-primary)] truncate">{entry.name}</p>
        <div className="flex items-center gap-1.5 mt-1">
          <span className="text-[10px] text-[var(--text-muted)] capitalize">{entry.mealType}</span>
          <span className="text-[var(--text-muted)]">·</span>
          <span className="text-[10px] text-[var(--text-muted)]">{entry.time}</span>
          {entry.healthScore && (
            <>
              <span className="text-[var(--text-muted)]">·</span>
              <span className="text-[10px] text-[var(--green)]">💚 {entry.healthScore}/10</span>
            </>
          )}
        </div>
      </div>
      <div className="flex items-center gap-1 flex-shrink-0">
        <div className="text-right mr-1">
          <span className="text-sm font-bold text-[var(--accent)]" style={{ fontFamily: 'Sora, sans-serif' }}>{entry.calories}</span>
          <span className="text-[9px] text-[var(--text-muted)] block">kcal</span>
        </div>
        <ChevronRight size={14} className="text-[var(--text-muted)] group-hover:text-[var(--text-secondary)] transition-colors" />
      </div>
    </button>
  );
}
