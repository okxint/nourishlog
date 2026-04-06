'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Trash2, Edit3, Heart } from 'lucide-react';
import { getEntries, deleteEntry } from '@/lib/store';
import { FoodEntry } from '@/lib/types';

export default function MealDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [entry, setEntry] = useState<FoodEntry | null>(null);

  useEffect(() => {
    const found = getEntries().find((e) => e.id === params.id);
    setEntry(found || null);
  }, [params.id]);

  if (!entry) {
    return (
      <div className="px-5 lg:px-8 pt-16 text-center fade-in">
        <p className="text-4xl mb-4">🍽️</p>
        <p className="text-[var(--text-muted)]">Meal not found</p>
        <button onClick={() => router.push('/home')} className="mt-4 text-sm text-[var(--accent)] font-medium">
          Go Home
        </button>
      </div>
    );
  }

  const handleDelete = () => {
    deleteEntry(entry.id);
    router.push('/home');
  };

  const macros = [
    { label: 'Protein', value: entry.protein, color: '#6366f1', pct: Math.round((entry.protein / 120) * 100) },
    { label: 'Carbs', value: entry.carbs, color: '#eab308', pct: Math.round((entry.carbs / 250) * 100) },
    { label: 'Fat', value: entry.fat, color: '#f43f5e', pct: Math.round((entry.fat / 65) * 100) },
    { label: 'Fiber', value: entry.fiber, color: '#22c55e', pct: Math.round((entry.fiber / 25) * 100) },
  ];

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 lg:px-8 pt-10 lg:pt-8 mb-4">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 rounded-full glass flex items-center justify-center hover:bg-[var(--bg-card-hover)]"
        >
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-base font-bold flex-1" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Meal Details</h1>
      </div>

      {/* Hero Image */}
      {entry.imageUrl && (
        <div className="px-5 mb-4">
          <img src={entry.imageUrl} alt={entry.name} className="w-full h-48 object-cover rounded-2xl" />
        </div>
      )}

      {/* Title & Cal */}
      <div className="px-5 mb-5">
        <h2 className="text-xl font-bold" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{entry.name}</h2>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-xs text-[var(--text-muted)] capitalize">{entry.mealType}</span>
          <span className="text-[var(--text-muted)]">·</span>
          <span className="text-xs text-[var(--text-muted)]">{entry.time}</span>
          {entry.servingSize && (
            <>
              <span className="text-[var(--text-muted)]">·</span>
              <span className="text-xs text-[var(--text-muted)]">{entry.servingSize}</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-4 mt-4">
          <div>
            <span className="text-3xl font-extrabold text-[var(--accent)]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              {entry.calories}
            </span>
            <span className="text-sm text-[var(--text-muted)] ml-1">kcal</span>
          </div>
          {entry.healthScore && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--green-dim)]">
              <Heart size={12} className="text-[var(--green)]" fill="var(--green)" />
              <span className="text-xs font-bold text-[var(--green)]">{entry.healthScore}/10</span>
            </div>
          )}
        </div>
      </div>

      {/* Macros */}
      <div className="px-5 mb-5">
        <div className="glass-card rounded-2xl p-4">
          <h3 className="text-sm font-bold mb-4" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Nutrition Breakdown</h3>
          <div className="grid grid-cols-4 gap-3 mb-4">
            {macros.map((m) => (
              <div key={m.label} className="text-center">
                <div className="relative w-14 h-14 mx-auto mb-1.5">
                  <svg width="56" height="56" viewBox="0 0 56 56" className="transform -rotate-90">
                    <circle cx="28" cy="28" r="22" fill="none" stroke="var(--bg-card-hover)" strokeWidth="4" />
                    <circle
                      cx="28" cy="28" r="22" fill="none"
                      stroke={m.color} strokeWidth="4" strokeLinecap="round"
                      strokeDasharray={138}
                      strokeDashoffset={138 * (1 - Math.min(m.pct / 100, 1))}
                      className="progress-ring"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-bold" style={{ color: m.color }}>{m.value}g</span>
                  </div>
                </div>
                <p className="text-[10px] text-[var(--text-muted)]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                  {m.label}
                </p>
                <p className="text-[9px] text-[var(--text-muted)]">{m.pct}% DV</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Micronutrients */}
      {entry.micronutrients && (
        <div className="px-5 mb-5">
          <div className="glass-card rounded-2xl p-4">
            <h3 className="text-sm font-bold mb-3" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Micronutrients</h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {[
                { label: 'Vitamin A', value: `${entry.micronutrients.vitaminA}% DV` },
                { label: 'Vitamin C', value: `${entry.micronutrients.vitaminC}% DV` },
                { label: 'Iron', value: `${entry.micronutrients.iron}% DV` },
                { label: 'Calcium', value: `${entry.micronutrients.calcium}% DV` },
                { label: 'Sodium', value: `${entry.micronutrients.sodium}mg` },
                { label: 'Sugar', value: `${entry.micronutrients.sugar}g` },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-1.5 border-b border-[var(--border)]">
                  <span className="text-[11px] text-[var(--text-muted)]">{item.label}</span>
                  <span className="text-[11px] font-semibold text-[var(--text-secondary)]">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="px-5 mb-8 flex gap-3">
        <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl glass
          text-[var(--text-secondary)] text-sm font-medium hover:bg-[var(--bg-card-hover)] transition-colors">
          <Edit3 size={15} /> Edit
        </button>
        <button
          onClick={handleDelete}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl
            text-[var(--rose)] text-sm font-medium hover:bg-[var(--rose-dim)] transition-colors"
        >
          <Trash2 size={15} /> Delete
        </button>
      </div>
    </div>
  );
}
