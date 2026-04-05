'use client';

import { useEffect, useState } from 'react';
import { Flame, UtensilsCrossed, Calendar, Bell, Clock, Ruler, Moon, Download, Info } from 'lucide-react';
import { getProfile, getEntries, updateGoals } from '@/lib/store';
import { UserProfile, DailyGoals } from '@/lib/types';
import { format, subDays } from 'date-fns';

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [totalMeals, setTotalMeals] = useState(0);
  const [streak, setStreak] = useState(0);
  const [editingGoals, setEditingGoals] = useState(false);
  const [goals, setGoals] = useState<DailyGoals>({ calories: 2200, protein: 150, carbs: 250, fat: 70, water: 2.5 });

  useEffect(() => {
    const p = getProfile();
    setProfile(p);
    setGoals(p.goals);
    const entries = getEntries();
    setTotalMeals(entries.length);
    // Calculate streak
    let count = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const dateStr = format(subDays(today, i), 'yyyy-MM-dd');
      if (entries.some((e) => e.date === dateStr)) {
        count++;
      } else break;
    }
    setStreak(count);
  }, []);

  const handleSaveGoals = () => {
    updateGoals(goals);
    setEditingGoals(false);
  };

  if (!profile) return null;

  const settings = [
    { label: 'Notifications', icon: Bell, type: 'toggle' as const, value: true },
    { label: 'Reminders', icon: Clock, type: 'text' as const, value: '8am, 1pm, 7pm' },
    { label: 'Units', icon: Ruler, type: 'text' as const, value: 'Metric' },
    { label: 'Dark Mode', icon: Moon, type: 'toggle' as const, value: true },
    { label: 'Export Data', icon: Download, type: 'arrow' as const },
    { label: 'About NourishLog', icon: Info, type: 'arrow' as const },
  ];

  return (
    <div className="px-5 pt-12 fade-in">
      {/* Profile Card */}
      <div className="glass-card rounded-2xl p-5 mb-4 text-center">
        <div className="w-16 h-16 rounded-full bg-[var(--green)] flex items-center justify-center mx-auto mb-3">
          <span className="text-2xl font-bold text-[var(--bg-primary)]" style={{ fontFamily: 'Sora, sans-serif' }}>
            {profile.name.charAt(0)}
          </span>
        </div>
        <h2 className="text-lg font-bold" style={{ fontFamily: 'Sora, sans-serif' }}>{profile.name}</h2>
        <p className="text-xs text-[var(--text-muted)] mt-0.5">{profile.email}</p>
        <button className="text-xs text-[var(--green)] font-medium mt-2 hover:underline">Edit Profile</button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-2.5 mb-4">
        <div className="glass-card rounded-xl p-3 text-center">
          <Flame size={18} className="text-[var(--amber)] mx-auto mb-1" />
          <p className="text-sm font-bold">{streak}</p>
          <p className="text-[10px] text-[var(--text-muted)]">Day Streak</p>
        </div>
        <div className="glass-card rounded-xl p-3 text-center">
          <UtensilsCrossed size={18} className="text-[var(--green)] mx-auto mb-1" />
          <p className="text-sm font-bold">{totalMeals}</p>
          <p className="text-[10px] text-[var(--text-muted)]">Meals Logged</p>
        </div>
        <div className="glass-card rounded-xl p-3 text-center">
          <Calendar size={18} className="text-[var(--blue)] mx-auto mb-1" />
          <p className="text-sm font-bold">Mar &apos;26</p>
          <p className="text-[10px] text-[var(--text-muted)]">Member Since</p>
        </div>
      </div>

      {/* Goals */}
      <div className="glass-card rounded-2xl p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold" style={{ fontFamily: 'Sora, sans-serif' }}>Daily Goals</h3>
          {editingGoals ? (
            <button onClick={handleSaveGoals} className="text-xs font-medium text-[var(--green)]">Save</button>
          ) : (
            <button onClick={() => setEditingGoals(true)} className="text-xs font-medium text-[var(--green)]">Edit Goals</button>
          )}
        </div>
        <div className="flex flex-col gap-2.5">
          {[
            { label: 'Calories', key: 'calories' as const, unit: 'kcal', color: 'var(--green)' },
            { label: 'Protein', key: 'protein' as const, unit: 'g', color: 'var(--blue)' },
            { label: 'Carbs', key: 'carbs' as const, unit: 'g', color: 'var(--amber)' },
            { label: 'Fat', key: 'fat' as const, unit: 'g', color: 'var(--rose)' },
            { label: 'Water', key: 'water' as const, unit: 'L', color: 'var(--blue)' },
          ].map((g) => (
            <div key={g.key} className="flex items-center justify-between py-1.5 border-b border-[var(--border)] last:border-0">
              <span className="text-xs text-[var(--text-secondary)]">{g.label}</span>
              {editingGoals ? (
                <input
                  type="number"
                  value={goals[g.key]}
                  onChange={(e) => setGoals({ ...goals, [g.key]: Number(e.target.value) })}
                  className="w-20 text-right text-xs font-semibold bg-[var(--bg-card-hover)] rounded px-2 py-1 text-[var(--text-primary)]"
                />
              ) : (
                <span className="text-xs font-semibold" style={{ color: g.color }}>
                  {goals[g.key]} {g.unit}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Settings */}
      <div className="glass-card rounded-2xl p-4 mb-8">
        <h3 className="text-sm font-bold mb-3" style={{ fontFamily: 'Sora, sans-serif' }}>Settings</h3>
        <div className="flex flex-col">
          {settings.map((s) => (
            <div key={s.label} className="flex items-center justify-between py-3 border-b border-[var(--border)] last:border-0">
              <div className="flex items-center gap-2.5">
                <s.icon size={16} className="text-[var(--text-muted)]" />
                <span className="text-xs text-[var(--text-secondary)]">{s.label}</span>
              </div>
              {s.type === 'toggle' ? (
                <div className={`w-9 h-5 rounded-full relative transition-colors ${s.value ? 'bg-[var(--green)]' : 'bg-[var(--bg-card-hover)]'}`}>
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${s.value ? 'left-[18px]' : 'left-0.5'}`} />
                </div>
              ) : s.type === 'text' ? (
                <span className="text-[11px] text-[var(--text-muted)]">{s.value}</span>
              ) : (
                <span className="text-[var(--text-muted)]">›</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
