'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import CalorieRing from '@/components/CalorieRing';
import MacroBadge from '@/components/MacroBadge';
import MealCard from '@/components/MealCard';
import { getEntriesByDate, getProfile, getWaterIntake, addWater } from '@/lib/store';
import { FoodEntry, UserProfile } from '@/lib/types';
import { Droplets } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const [entries, setEntries] = useState<FoodEntry[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [water, setWater] = useState(0);
  const today = format(new Date(), 'yyyy-MM-dd');

  useEffect(() => {
    setEntries(getEntriesByDate(today));
    setProfile(getProfile());
    setWater(getWaterIntake(today));
  }, [today]);

  useEffect(() => {
    const onFocus = () => setEntries(getEntriesByDate(today));
    window.addEventListener('focus', onFocus);
    // Also poll for changes (from other tabs like chat/log)
    const interval = setInterval(() => setEntries(getEntriesByDate(today)), 2000);
    return () => { window.removeEventListener('focus', onFocus); clearInterval(interval); };
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

  const mealGroups: Record<string, FoodEntry[]> = {};
  entries.forEach((e) => {
    if (!mealGroups[e.mealType]) mealGroups[e.mealType] = [];
    mealGroups[e.mealType].push(e);
  });
  const mealOrder = ['breakfast', 'lunch', 'dinner', 'snack'];

  return (
    <div className="px-5 lg:px-8 pt-10 lg:pt-8 fade-in">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>
            {greeting}, {profile?.name || 'there'}
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-1" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
            {format(new Date(), 'EEEE, d MMMM yyyy')}
          </p>
        </div>
        <button
          onClick={() => router.push('/log')}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[var(--accent)] text-white text-sm font-medium
            hover:brightness-110 active:scale-95 transition-all"
        >
          <Plus size={16} /> Log Meal
        </button>
      </div>

      {/* Summary — Desktop: side by side, Mobile: stacked */}
      <div className="flex flex-col lg:flex-row gap-6 mb-8">
        {/* Calorie Ring */}
        <div className="flex flex-col items-center lg:items-start">
          <CalorieRing consumed={totals.calories} goal={goals.calories} />
        </div>

        {/* Macros + Quick Stats */}
        <div className="flex-1 flex flex-col justify-center gap-3">
          <div className="flex gap-2">
            <MacroBadge label="Protein" current={totals.protein} goal={goals.protein} color="var(--blue)" />
            <MacroBadge label="Carbs" current={totals.carbs} goal={goals.carbs} color="var(--amber)" />
            <MacroBadge label="Fat" current={totals.fat} goal={goals.fat} color="var(--rose)" />
          </div>
          <div className="flex gap-2">
            <div className="flex-1 glass-card rounded-xl px-3 py-2.5">
              <p className="text-[10px] text-[var(--text-muted)] uppercase font-semibold" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>Meals</p>
              <p className="text-lg font-bold mt-0.5" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>{entries.length}</p>
            </div>
            <div className="flex-1 glass-card rounded-xl px-3 py-2.5">
              <p className="text-[10px] text-[var(--text-muted)] uppercase font-semibold" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>Health Score</p>
              <p className="text-lg font-bold mt-0.5 text-[var(--green)]" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>
                {entries.length > 0 ? (entries.reduce((s, e) => s + (e.healthScore || 0), 0) / entries.length).toFixed(1) : '—'}
              </p>
            </div>
            <div className="flex-1 glass-card rounded-xl px-3 py-2.5">
              <div className="flex items-center justify-between">
                <p className="text-[10px] text-[var(--text-muted)] uppercase font-semibold" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>Water</p>
                <button
                  onClick={() => { addWater(today, 1); setWater(water + 1); }}
                  className="w-5 h-5 rounded-md flex items-center justify-center text-[var(--blue)] hover:bg-[var(--blue-dim)] transition-colors"
                >
                  <Droplets size={12} />
                </button>
              </div>
              <p className="text-lg font-bold mt-0.5 text-[var(--blue)]" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>
                {water}<span className="text-xs font-normal text-[var(--text-muted)]"> / {goals.water * 4}</span>
              </p>
              <div className="w-full h-1 rounded-full bg-[var(--bg-card-hover)] mt-1">
                <div className="h-full rounded-full bg-[var(--blue)] transition-all" style={{ width: `${Math.min((water / (goals.water * 4)) * 100, 100)}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Meals */}
      {entries.length === 0 ? (
        <div className="glass-card rounded-2xl p-10 text-center">
          <p className="text-3xl mb-3">🍽️</p>
          <p className="text-sm text-[var(--text-secondary)] font-medium mb-1">No meals logged yet today</p>
          <p className="text-xs text-[var(--text-muted)] mb-5">Upload a photo, type what you had, or chat with us</p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => router.push('/log')}
              className="px-5 py-2.5 rounded-full bg-[var(--accent)] text-white text-sm font-semibold
                hover:brightness-110 active:scale-95 transition-all"
            >
              Log a Meal
            </button>
            <button
              onClick={() => router.push('/chat')}
              className="px-5 py-2.5 rounded-full glass text-[var(--text-secondary)] text-sm font-medium
                hover:text-[var(--text-primary)] transition-colors"
            >
              Open Chat
            </button>
          </div>
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
                  <h3 className="text-sm font-semibold capitalize text-[var(--text-secondary)]" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>
                    {type}
                  </h3>
                  <span className="text-[10px] font-medium text-[var(--text-muted)]" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
                    {mealCal} kcal
                  </span>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                  {meals.map((entry) => <MealCard key={entry.id} entry={entry} />)}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
