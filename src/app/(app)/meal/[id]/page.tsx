'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Trash2, Save, X, Pencil, Heart } from 'lucide-react';
import { getEntries, deleteEntry, updateEntry } from '@/lib/store';
import { FoodEntry } from '@/lib/types';

export default function MealDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [entry, setEntry] = useState<FoodEntry | null>(null);
  const [editing, setEditing] = useState(false);
  const [editValues, setEditValues] = useState({ calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, name: '', servingSize: '' });

  useEffect(() => {
    const found = getEntries().find((e) => e.id === params.id);
    if (found) {
      setEntry(found);
      setEditValues({
        calories: found.calories,
        protein: found.protein,
        carbs: found.carbs,
        fat: found.fat,
        fiber: found.fiber,
        name: found.name,
        servingSize: found.servingSize || '1 serving',
      });
    }
  }, [params.id]);

  if (!entry) {
    return (
      <div className="px-5 lg:px-8 pt-16 text-center fade-in">
        <p className="text-4xl mb-4">🍽️</p>
        <p style={{ color: 'var(--text-muted)' }}>Meal not found</p>
        <button onClick={() => router.push('/home')} className="mt-4 text-sm font-medium" style={{ color: 'var(--accent)' }}>Go Home</button>
      </div>
    );
  }

  const handleSave = () => {
    updateEntry(entry.id, {
      name: editValues.name,
      calories: editValues.calories,
      protein: editValues.protein,
      carbs: editValues.carbs,
      fat: editValues.fat,
      fiber: editValues.fiber,
      servingSize: editValues.servingSize,
    });
    setEntry({ ...entry, ...editValues });
    setEditing(false);
  };

  const handleDelete = () => {
    deleteEntry(entry.id);
    router.push('/home');
  };

  const macros = [
    { label: 'Protein', value: entry.protein, color: 'var(--blue)', pct: Math.round((entry.protein / 120) * 100) },
    { label: 'Carbs', value: entry.carbs, color: 'var(--amber)', pct: Math.round((entry.carbs / 250) * 100) },
    { label: 'Fat', value: entry.fat, color: 'var(--rose)', pct: Math.round((entry.fat / 65) * 100) },
    { label: 'Fiber', value: entry.fiber, color: 'var(--green)', pct: Math.round((entry.fiber / 25) * 100) },
  ];

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 lg:px-8 pt-10 lg:pt-8 mb-4">
        <button onClick={() => router.back()} className="w-9 h-9 rounded-full glass flex items-center justify-center hover:bg-[var(--bg-card-hover)]">
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-base font-bold flex-1" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>Meal Details</h1>
        {!editing ? (
          <button onClick={() => setEditing(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
            <Pencil size={13} /> Edit
          </button>
        ) : (
          <div className="flex gap-2">
            <button onClick={() => setEditing(false)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg glass text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
              <X size={13} /> Cancel
            </button>
            <button onClick={handleSave} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ background: 'var(--accent)', color: '#fff' }}>
              <Save size={13} /> Save
            </button>
          </div>
        )}
      </div>

      {/* Hero Image */}
      {entry.imageUrl && (
        <div className="px-5 lg:px-8 mb-4">
          <img src={entry.imageUrl} alt={entry.name} className="w-full h-48 object-cover rounded-2xl" />
        </div>
      )}

      {/* Title & Cal */}
      <div className="px-5 lg:px-8 mb-5">
        {editing ? (
          <input type="text" value={editValues.name} onChange={(e) => setEditValues({ ...editValues, name: e.target.value })}
            className="text-xl font-bold w-full bg-transparent border-b-2 pb-1 focus:outline-none"
            style={{ fontFamily: 'Bricolage Grotesque', borderColor: 'var(--accent)', color: 'var(--text-primary)' }} />
        ) : (
          <h2 className="text-xl font-bold" style={{ fontFamily: 'Bricolage Grotesque' }}>{entry.name}</h2>
        )}
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-xs capitalize" style={{ color: 'var(--text-muted)' }}>{entry.mealType}</span>
          <span style={{ color: 'var(--text-muted)' }}>·</span>
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{entry.time}</span>
          {editing ? (
            <>
              <span style={{ color: 'var(--text-muted)' }}>·</span>
              <input type="text" value={editValues.servingSize} onChange={(e) => setEditValues({ ...editValues, servingSize: e.target.value })}
                className="text-xs bg-transparent border-b focus:outline-none w-24" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }} />
            </>
          ) : entry.servingSize ? (
            <>
              <span style={{ color: 'var(--text-muted)' }}>·</span>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{entry.servingSize}</span>
            </>
          ) : null}
        </div>

        <div className="flex items-center gap-4 mt-4">
          {editing ? (
            <div className="flex items-baseline gap-1">
              <input type="number" value={editValues.calories} onChange={(e) => setEditValues({ ...editValues, calories: Number(e.target.value) })}
                className="text-3xl font-extrabold w-24 bg-transparent border-b-2 focus:outline-none text-right"
                style={{ fontFamily: 'Bricolage Grotesque', borderColor: 'var(--accent)', color: 'var(--accent)' }} />
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>kcal</span>
            </div>
          ) : (
            <div>
              <span className="text-3xl font-extrabold" style={{ fontFamily: 'Bricolage Grotesque', color: 'var(--accent)' }}>{entry.calories}</span>
              <span className="text-sm ml-1" style={{ color: 'var(--text-muted)' }}>kcal</span>
            </div>
          )}
          {entry.healthScore && !editing && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: 'var(--green-dim)' }}>
              <Heart size={12} style={{ color: 'var(--green)' }} fill="var(--green)" />
              <span className="text-xs font-bold" style={{ color: 'var(--green)' }}>{entry.healthScore}/10</span>
            </div>
          )}
        </div>
      </div>

      {/* Macros */}
      <div className="px-5 lg:px-8 mb-5">
        <div className="glass-card rounded-2xl p-4">
          <h3 className="text-sm font-bold mb-4" style={{ fontFamily: 'Bricolage Grotesque' }}>
            Nutrition Breakdown
            {editing && <span className="text-xs font-normal ml-2" style={{ color: 'var(--text-muted)' }}>— click values to edit</span>}
          </h3>

          {editing ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { key: 'protein' as const, label: 'Protein', color: 'var(--blue)', unit: 'g' },
                { key: 'carbs' as const, label: 'Carbs', color: 'var(--amber)', unit: 'g' },
                { key: 'fat' as const, label: 'Fat', color: 'var(--rose)', unit: 'g' },
                { key: 'fiber' as const, label: 'Fiber', color: 'var(--green)', unit: 'g' },
              ].map((m) => (
                <div key={m.key} className="rounded-xl p-3 text-center" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
                  <label className="text-[10px] font-semibold block mb-1.5" style={{ color: m.color, fontFamily: 'IBM Plex Mono' }}>{m.label}</label>
                  <div className="flex items-center justify-center gap-1">
                    <input type="number" value={editValues[m.key]}
                      onChange={(e) => setEditValues({ ...editValues, [m.key]: Number(e.target.value) })}
                      className="w-14 text-center text-lg font-bold bg-transparent border-b-2 focus:outline-none"
                      style={{ borderColor: m.color, color: m.color, fontFamily: 'Bricolage Grotesque' }} />
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{m.unit}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-3">
              {macros.map((m) => (
                <div key={m.label} className="text-center">
                  <div className="relative w-14 h-14 mx-auto mb-1.5">
                    <svg width="56" height="56" viewBox="0 0 56 56" className="transform -rotate-90">
                      <circle cx="28" cy="28" r="22" fill="none" stroke="var(--bg-card-hover)" strokeWidth="4" />
                      <circle cx="28" cy="28" r="22" fill="none" stroke={m.color} strokeWidth="4" strokeLinecap="round"
                        strokeDasharray="138" strokeDashoffset={138 * (1 - Math.min(m.pct / 100, 1))} className="progress-ring" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-bold" style={{ color: m.color }}>{m.value}g</span>
                    </div>
                  </div>
                  <p className="text-[10px]" style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono' }}>{m.label}</p>
                  <p className="text-[9px]" style={{ color: 'var(--text-muted)' }}>{m.pct}% DV</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Micronutrients */}
      {entry.micronutrients && !editing && (
        <div className="px-5 lg:px-8 mb-5">
          <div className="glass-card rounded-2xl p-4">
            <h3 className="text-sm font-bold mb-3" style={{ fontFamily: 'Bricolage Grotesque' }}>Micronutrients</h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {[
                { label: 'Vitamin A', value: `${entry.micronutrients.vitaminA}% DV` },
                { label: 'Vitamin C', value: `${entry.micronutrients.vitaminC}% DV` },
                { label: 'Iron', value: `${entry.micronutrients.iron}% DV` },
                { label: 'Calcium', value: `${entry.micronutrients.calcium}% DV` },
                { label: 'Sodium', value: `${entry.micronutrients.sodium}mg` },
                { label: 'Sugar', value: `${entry.micronutrients.sugar}g` },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-1.5" style={{ borderBottom: '1px solid var(--border)' }}>
                  <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{item.label}</span>
                  <span className="text-[11px] font-semibold" style={{ color: 'var(--text-secondary)' }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Source note */}
      <div className="px-5 lg:px-8 mb-3">
        <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
          Nutrition data sourced from IFCT (Indian Food Composition Tables). Values are approximate for standard serving sizes. {!editing && <button onClick={() => setEditing(true)} className="underline" style={{ color: 'var(--accent)' }}>Edit if incorrect →</button>}
        </p>
      </div>

      {/* Delete */}
      {!editing && (
        <div className="px-5 lg:px-8 mb-8">
          <button onClick={handleDelete}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-colors"
            style={{ color: 'var(--rose)' }}>
            <Trash2 size={15} /> Delete this entry
          </button>
        </div>
      )}
    </div>
  );
}
