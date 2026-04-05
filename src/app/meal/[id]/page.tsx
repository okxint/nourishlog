'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Trash2, Edit3 } from 'lucide-react';
import { getEntries, deleteEntry } from '@/lib/store';
import { FoodEntry } from '@/lib/types';

const mealLabel: Record<string, string> = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
  snack: 'Snack',
};

export default function MealDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [entry, setEntry] = useState<FoodEntry | null>(null);

  useEffect(() => {
    const all = getEntries();
    const found = all.find((e) => e.id === params.id);
    setEntry(found || null);
  }, [params.id]);

  if (!entry) {
    return (
      <div className="px-5 pt-12 text-center">
        <p className="text-[var(--text-muted)]">Meal not found</p>
        <button onClick={() => router.push('/')} className="mt-4 text-sm text-[var(--green)]">Go Home</button>
      </div>
    );
  }

  const handleDelete = () => {
    deleteEntry(entry.id);
    router.push('/');
  };

  const macros = [
    { label: 'Protein', value: entry.protein, unit: 'g', color: 'var(--blue)', colorDim: 'var(--blue-dim)', dailyPct: Math.round((entry.protein / 150) * 100) },
    { label: 'Carbs', value: entry.carbs, unit: 'g', color: 'var(--amber)', colorDim: 'var(--amber-dim)', dailyPct: Math.round((entry.carbs / 250) * 100) },
    { label: 'Fat', value: entry.fat, unit: 'g', color: 'var(--rose)', colorDim: 'var(--rose-dim)', dailyPct: Math.round((entry.fat / 70) * 100) },
    { label: 'Fiber', value: entry.fiber, unit: 'g', color: 'var(--green)', colorDim: 'var(--green-dim)', dailyPct: Math.round((entry.fiber / 25) * 100) },
  ];

  const micro = entry.micronutrients;

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-12 mb-4">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 rounded-full glass-card flex items-center justify-center hover:bg-[var(--bg-card-hover)]"
        >
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-lg font-bold" style={{ fontFamily: 'Sora, sans-serif' }}>Meal Details</h1>
      </div>

      {/* Hero Image */}
      {entry.imageUrl && (
        <div className="px-5 mb-4">
          <img
            src={entry.imageUrl}
            alt={entry.name}
            className="w-full h-52 object-cover rounded-2xl"
          />
        </div>
      )}

      {/* Title & Calories */}
      <div className="px-5 mb-5">
        <h2 className="text-xl font-bold" style={{ fontFamily: 'Sora, sans-serif' }}>{entry.name}</h2>
        <p className="text-sm text-[var(--text-muted)] mt-0.5">
          {mealLabel[entry.mealType]} — {entry.time}
        </p>
        <p className="text-3xl font-bold text-[var(--green)] mt-2" style={{ fontFamily: 'Sora, sans-serif' }}>
          {entry.calories} <span className="text-base font-normal text-[var(--text-muted)]">kcal</span>
        </p>
      </div>

      {/* Nutrition Facts */}
      <div className="px-5 mb-5">
        <div className="glass-card rounded-2xl p-4">
          <h3 className="text-sm font-bold mb-1" style={{ fontFamily: 'Sora, sans-serif' }}>Nutrition Facts</h3>
          {entry.servingSize && (
            <p className="text-xs text-[var(--text-muted)] mb-4">Serving: {entry.servingSize}</p>
          )}
          <div className="flex flex-col gap-3.5">
            {macros.map((m) => (
              <div key={m.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-[var(--text-secondary)]">{m.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold" style={{ color: m.color }}>
                      {m.value}{m.unit}
                    </span>
                    <span className="text-[10px] text-[var(--text-muted)]">{m.dailyPct}% DV</span>
                  </div>
                </div>
                <div className="w-full h-2 rounded-full" style={{ background: m.colorDim }}>
                  <div
                    className="h-full rounded-full macro-bar"
                    style={{ width: `${Math.min(m.dailyPct, 100)}%`, background: m.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Micronutrients */}
      {micro && (
        <div className="px-5 mb-5">
          <div className="glass-card rounded-2xl p-4">
            <h3 className="text-sm font-bold mb-3" style={{ fontFamily: 'Sora, sans-serif' }}>Micronutrients</h3>
            <div className="flex flex-col gap-2">
              {[
                { label: 'Vitamin A', value: `${micro.vitaminA}% DV` },
                { label: 'Vitamin C', value: `${micro.vitaminC}% DV` },
                { label: 'Iron', value: `${micro.iron}% DV` },
                { label: 'Calcium', value: `${micro.calcium}% DV` },
                { label: 'Sodium', value: `${micro.sodium}mg` },
                { label: 'Sugar', value: `${micro.sugar}g` },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-1.5 border-b border-[var(--border)] last:border-0">
                  <span className="text-xs text-[var(--text-secondary)]">{item.label}</span>
                  <span className="text-xs font-medium text-[var(--text-primary)]">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="px-5 mb-8 flex gap-3">
        <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl glass-card
          text-[var(--text-secondary)] text-sm font-medium hover:bg-[var(--bg-card-hover)] transition-colors">
          <Edit3 size={16} /> Edit Entry
        </button>
        <button
          onClick={handleDelete}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl
            text-[var(--rose)] text-sm font-medium hover:bg-[var(--rose-dim)] transition-colors"
        >
          <Trash2 size={16} /> Delete
        </button>
      </div>
    </div>
  );
}
