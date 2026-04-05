'use client';

import { ChevronRight } from 'lucide-react';
import { FoodEntry } from '@/lib/types';
import { useRouter } from 'next/navigation';

const mealTypeLabel: Record<string, string> = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
  snack: 'Snack',
};

export default function MealCard({ entry }: { entry: FoodEntry }) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(`/meal/${entry.id}`)}
      className="glass-card rounded-2xl p-3.5 flex items-center gap-3.5 w-full text-left
        hover:bg-[var(--bg-card-hover)] transition-all duration-200 active:scale-[0.98]"
    >
      {entry.imageUrl ? (
        <img
          src={entry.imageUrl}
          alt={entry.name}
          className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
        />
      ) : (
        <div className="w-14 h-14 rounded-xl bg-[var(--bg-card-hover)] flex items-center justify-center flex-shrink-0">
          <span className="text-2xl">🍽️</span>
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-[var(--text-primary)] truncate">{entry.name}</p>
        <p className="text-xs text-[var(--text-muted)] mt-0.5">
          {mealTypeLabel[entry.mealType]} · {entry.time}
        </p>
      </div>
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <span className="text-sm font-bold text-[var(--green)]">{entry.calories}</span>
        <span className="text-[10px] text-[var(--text-muted)]">kcal</span>
        <ChevronRight size={16} className="text-[var(--text-muted)]" />
      </div>
    </button>
  );
}
