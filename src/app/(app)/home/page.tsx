'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Camera, Plus } from 'lucide-react';
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

  // Re-check on window focus (after logging from chat)
  useEffect(() => {
    const onFocus = () => {
      setEntries(getEntriesByDate(today));
    };
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
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

  const goals = profile?.goals || { calories: 2000, protein: 120, carbs: 250, fat: 65, water: 3 };
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  // Group by meal type
  const mealGroups: Record<string, FoodEntry[]> = {};
  entries.forEach((e) => {
    if (!mealGroups[e.mealType]) mealGroups[e.mealType] = [];
    mealGroups[e.mealType].push(e);
  });
  const mealOrder = ['breakfast', 'lunch', 'dinner', 'snack'];

  return (
    <div className="px-5 pt-12 fade-in">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold" style={{ fontFamily: 'Sora, sans-serif' }}>
            {greeting}, {profile?.name || 'there'}
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            {format(new Date(), 'EEEE, d MMMM yyyy')}
          </p>
        </div>
        <button
          onClick={() => router.push('/chat')}
          className="w-10 h-10 rounded-full glass-card flex items-center justify-center
            hover:bg-[var(--bg-card-hover)] transition-colors"
        >
          <Plus size={20} className="text-[var(--text-secondary)]" />
        </button>
      </div>

      {/* Calorie Ring */}
      <div className="flex justify-center mb-6">
        <CalorieRing consumed={totals.calories} goal={goals.calories} />
      </div>

      {/* Macro Badges */}
      <div className="flex gap-2 mb-8">
        <MacroBadge label="Protein" current={totals.protein} goal={goals.protein} color="var(--blue)" />
        <MacroBadge label="Carbs" current={totals.carbs} goal={goals.carbs} color="var(--amber)" />
        <MacroBadge label="Fat" current={totals.fat} goal={goals.fat} color="var(--rose)" />
      </div>

      {/* Meals by type */}
      {entries.length === 0 ? (
        <div className="glass-card rounded-2xl p-8 text-center mb-6">
          <p className="text-3xl mb-3">🍽️</p>
          <p className="text-sm text-[var(--text-secondary)] font-medium mb-1">No meals logged yet</p>
          <p className="text-xs text-[var(--text-muted)] mb-4">Start by chatting what you ate</p>
          <button
            onClick={() => router.push('/chat')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--accent)] text-white
              text-sm font-semibold hover:brightness-110 active:scale-95 transition-all"
          >
            <MessageIcon /> Log your first meal
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-5 mb-6">
          {mealOrder.map((type) => {
            const meals = mealGroups[type];
            if (!meals || meals.length === 0) return null;
            const mealCal = meals.reduce((s, e) => s + e.calories, 0);
            return (
              <div key={type}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold capitalize text-[var(--text-secondary)]"
                    style={{ fontFamily: 'Sora, sans-serif' }}>
                    {type}
                  </h3>
                  <span className="text-[10px] font-medium text-[var(--text-muted)]"
                    style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    {mealCal} kcal
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  {meals.map((entry) => <MealCard key={entry.id} entry={entry} />)}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* FAB */}
      <button
        onClick={() => router.push('/chat')}
        className="fixed bottom-24 right-5 w-14 h-14 rounded-full bg-[var(--accent)] text-white
          flex items-center justify-center shadow-lg shadow-[var(--accent-dim)] pulse-glow
          hover:scale-105 active:scale-95 transition-transform duration-200 z-40"
      >
        <Camera size={22} strokeWidth={2.5} />
      </button>
    </div>
  );
}

function MessageIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" />
    </svg>
  );
}
