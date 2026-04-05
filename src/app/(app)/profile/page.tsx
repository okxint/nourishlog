'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Flame, UtensilsCrossed, Calendar, Bell, Clock, Moon, Download, LogOut, ChevronRight } from 'lucide-react';
import { getProfile, getEntries, updateGoals, logout } from '@/lib/store';
import { UserProfile, DailyGoals } from '@/lib/types';
import { format, subDays } from 'date-fns';

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [totalMeals, setTotalMeals] = useState(0);
  const [streak, setStreak] = useState(0);
  const [editingGoals, setEditingGoals] = useState(false);
  const [goals, setGoals] = useState<DailyGoals>({ calories: 2000, protein: 120, carbs: 250, fat: 65, water: 3 });

  useEffect(() => {
    const p = getProfile();
    setProfile(p);
    setGoals(p.goals);
    const entries = getEntries();
    setTotalMeals(entries.length);
    let count = 0;
    for (let i = 0; i < 365; i++) {
      if (entries.some((e) => e.date === format(subDays(new Date(), i), 'yyyy-MM-dd'))) count++;
      else break;
    }
    setStreak(count);
  }, []);

  const handleSaveGoals = () => {
    updateGoals(goals);
    setEditingGoals(false);
  };

  const handleLogout = () => {
    logout();
    router.replace('/');
  };

  if (!profile) return null;

  return (
    <div className="px-5 pt-12 fade-in">
      {/* Profile Card */}
      <div className="glass-card rounded-2xl p-6 mb-4 text-center gradient-border">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--accent)] to-[#fb923c] flex items-center justify-center mx-auto mb-3 glow-sm">
          <span className="text-2xl font-bold text-white" style={{ fontFamily: 'Sora, sans-serif' }}>
            {profile.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <h2 className="text-lg font-bold" style={{ fontFamily: 'Sora, sans-serif' }}>{profile.name}</h2>
        <p className="text-xs text-[var(--text-muted)] mt-0.5">{profile.email}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="glass-card rounded-2xl p-3 text-center">
          <Flame size={16} className="text-[var(--accent)] mx-auto mb-1.5" />
          <p className="text-base font-bold" style={{ fontFamily: 'Sora, sans-serif' }}>{streak}</p>
          <p className="text-[9px] text-[var(--text-muted)] uppercase tracking-wide" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Day Streak
          </p>
        </div>
        <div className="glass-card rounded-2xl p-3 text-center">
          <UtensilsCrossed size={16} className="text-[var(--green)] mx-auto mb-1.5" />
          <p className="text-base font-bold" style={{ fontFamily: 'Sora, sans-serif' }}>{totalMeals}</p>
          <p className="text-[9px] text-[var(--text-muted)] uppercase tracking-wide" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Meals
          </p>
        </div>
        <div className="glass-card rounded-2xl p-3 text-center">
          <Calendar size={16} className="text-[var(--blue)] mx-auto mb-1.5" />
          <p className="text-base font-bold" style={{ fontFamily: 'Sora, sans-serif' }}>
            {profile.joinedDate ? format(new Date(profile.joinedDate), 'MMM') : 'N/A'}
          </p>
          <p className="text-[9px] text-[var(--text-muted)] uppercase tracking-wide" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Joined
          </p>
        </div>
      </div>

      {/* Goals */}
      <div className="glass-card rounded-2xl p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold" style={{ fontFamily: 'Sora, sans-serif' }}>Daily Goals</h3>
          {editingGoals ? (
            <button onClick={handleSaveGoals} className="text-xs font-semibold text-[var(--accent)]">Save</button>
          ) : (
            <button onClick={() => setEditingGoals(true)} className="text-xs font-semibold text-[var(--accent)]">Edit</button>
          )}
        </div>
        <div className="flex flex-col gap-2">
          {[
            { label: 'Calories', key: 'calories' as const, unit: 'kcal', color: 'var(--accent)' },
            { label: 'Protein', key: 'protein' as const, unit: 'g', color: 'var(--blue)' },
            { label: 'Carbs', key: 'carbs' as const, unit: 'g', color: 'var(--amber)' },
            { label: 'Fat', key: 'fat' as const, unit: 'g', color: 'var(--rose)' },
            { label: 'Water', key: 'water' as const, unit: 'L', color: 'var(--blue)' },
          ].map((g) => (
            <div key={g.key} className="flex items-center justify-between py-2 border-b border-[var(--border)] last:border-0">
              <span className="text-xs text-[var(--text-secondary)]">{g.label}</span>
              {editingGoals ? (
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={goals[g.key]}
                    onChange={(e) => setGoals({ ...goals, [g.key]: Number(e.target.value) })}
                    className="w-16 text-right text-xs font-bold bg-[var(--bg-elevated)] rounded-lg px-2 py-1.5
                      text-[var(--text-primary)] border border-[var(--border)] focus:outline-none focus:border-[var(--accent)]"
                  />
                  <span className="text-[10px] text-[var(--text-muted)]">{g.unit}</span>
                </div>
              ) : (
                <span className="text-xs font-bold" style={{ color: g.color }}>{goals[g.key]} {g.unit}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Settings */}
      <div className="glass-card rounded-2xl p-4 mb-4">
        <h3 className="text-sm font-bold mb-2" style={{ fontFamily: 'Sora, sans-serif' }}>Settings</h3>
        {[
          { icon: Bell, label: 'Notifications', right: <ToggleSwitch on={true} /> },
          { icon: Clock, label: 'Meal Reminders', right: <span className="text-[10px] text-[var(--text-muted)]">8am, 1pm, 7pm</span> },
          { icon: Moon, label: 'Dark Mode', right: <ToggleSwitch on={true} /> },
          { icon: Download, label: 'Export Data', right: <ChevronRight size={14} className="text-[var(--text-muted)]" /> },
        ].map((s) => (
          <div key={s.label} className="flex items-center justify-between py-3 border-b border-[var(--border)] last:border-0">
            <div className="flex items-center gap-2.5">
              <s.icon size={15} className="text-[var(--text-muted)]" />
              <span className="text-xs text-[var(--text-secondary)]">{s.label}</span>
            </div>
            {s.right}
          </div>
        ))}
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="w-full glass-card rounded-2xl p-3.5 flex items-center justify-center gap-2
          text-[var(--rose)] text-sm font-medium hover:bg-[var(--rose-dim)] transition-colors mb-8"
      >
        <LogOut size={16} /> Sign Out
      </button>
    </div>
  );
}

function ToggleSwitch({ on }: { on: boolean }) {
  return (
    <div className={`w-9 h-5 rounded-full relative transition-colors ${on ? 'bg-[var(--accent)]' : 'bg-[var(--bg-card-hover)]'}`}>
      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${on ? 'left-[18px]' : 'left-0.5'}`} />
    </div>
  );
}
