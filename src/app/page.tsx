'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Camera } from 'lucide-react';
import { useRouter } from 'next/navigation';
import CalorieRing from '@/components/CalorieRing';
import MacroBadge from '@/components/MacroBadge';
import MealCard from '@/components/MealCard';
import { getEntriesByDate, getProfile } from '@/lib/store';
import { FoodEntry, UserProfile } from '@/lib/types';

export default function HomePage() {
  const router = useRouter();
  const [entries, setEntries] = useState<FoodEntry[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const today = format(new Date(), 'yyyy-MM-dd');

  useEffect(() => {
    setEntries(getEntriesByDate(today));
    setProfile(getProfile());
  }, [today]);

  const totals = entries.reduce(
    (acc, e) => ({
      calories: acc.calories + e.calories,
      protein: acc.protein + e.protein,
      carbs: acc.carbs + e.carbs,
      fat: acc.fat + e.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const goals = profile?.goals || { calories: 2200, protein: 150, carbs: 250, fat: 70, water: 2.5 };
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="px-5 pt-12 fade-in">
      <div className="mb-2">
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'Sora, sans-serif' }}>
          {greeting}, {profile?.name || 'there'} 👋
        </h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          {format(new Date(), 'EEEE, MMMM d, yyyy')}
        </p>
      </div>

      <CalorieRing consumed={totals.calories} goal={goals.calories} />

      <div className="flex gap-2.5 mb-8">
        <MacroBadge label="Protein" current={totals.protein} goal={goals.protein} color="var(--blue)" colorDim="var(--blue-dim)" />
        <MacroBadge label="Carbs" current={totals.carbs} goal={goals.carbs} color="var(--amber)" colorDim="var(--amber-dim)" />
        <MacroBadge label="Fat" current={totals.fat} goal={goals.fat} color="var(--rose)" colorDim="var(--rose-dim)" />
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold" style={{ fontFamily: 'Sora, sans-serif' }}>
            Today&apos;s Meals
          </h2>
          <span className="text-xs text-[var(--text-muted)]">{entries.length} items</span>
        </div>
        <div className="flex flex-col gap-2.5">
          {entries.length === 0 ? (
            <div className="glass-card rounded-2xl p-8 text-center">
              <p className="text-[var(--text-muted)] text-sm">No meals logged yet today</p>
              <button
                onClick={() => router.push('/log')}
                className="mt-3 text-sm font-medium text-[var(--green)] hover:underline"
              >
                Log your first meal →
              </button>
            </div>
          ) : (
            entries.map((entry) => <MealCard key={entry.id} entry={entry} />)
          )}
        </div>
      </div>

      <button
        onClick={() => router.push('/log')}
        className="fixed bottom-24 right-6 w-14 h-14 rounded-full bg-[var(--green)] text-[var(--bg-primary)]
          flex items-center justify-center shadow-lg shadow-[var(--green-dim)]
          hover:scale-105 active:scale-95 transition-transform duration-200 z-40"
      >
        <Camera size={24} strokeWidth={2.5} />
      </button>
    </div>
  );
}
