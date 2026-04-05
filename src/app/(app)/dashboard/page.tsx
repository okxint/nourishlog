'use client';

import { useEffect, useState, useMemo } from 'react';
import { format, subDays } from 'date-fns';
import { ChevronLeft, ChevronRight, Flame, Droplets, Trophy, TrendingUp } from 'lucide-react';
import { getEntries, getProfile } from '@/lib/store';
import { FoodEntry } from '@/lib/types';
import { BarChart, Bar, XAxis, ResponsiveContainer, Cell, ReferenceLine, PieChart, Pie } from 'recharts';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function DashboardPage() {
  const [entries, setEntries] = useState<FoodEntry[]>([]);
  const [goals, setGoals] = useState({ calories: 2000, protein: 120, carbs: 250, fat: 65, water: 3 });

  useEffect(() => {
    setEntries(getEntries());
    setGoals(getProfile().goals);
  }, []);

  const weekData = useMemo(() => {
    const data = [];
    const today = new Date();
    const dayOfWeek = today.getDay();
    const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

    for (let i = 0; i < 7; i++) {
      const date = subDays(today, mondayOffset - i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const dayEntries = entries.filter((e) => e.date === dateStr);
      const totalCal = dayEntries.reduce((sum, e) => sum + e.calories, 0);
      const isToday = dateStr === format(today, 'yyyy-MM-dd');
      data.push({ day: DAYS[i], calories: totalCal, isToday });
    }
    return data;
  }, [entries]);

  const avgCalories = useMemo(() => {
    const withData = weekData.filter((d) => d.calories > 0);
    return withData.length > 0 ? Math.round(withData.reduce((s, d) => s + d.calories, 0) / withData.length) : 0;
  }, [weekData]);

  const macroTotals = useMemo(() => {
    const week = entries.filter((e) => {
      const diff = (new Date().getTime() - new Date(e.date).getTime()) / (1000 * 60 * 60 * 24);
      return diff <= 7;
    });
    const p = week.reduce((s, e) => s + e.protein, 0);
    const c = week.reduce((s, e) => s + e.carbs, 0);
    const f = week.reduce((s, e) => s + e.fat, 0);
    const total = p + c + f || 1;
    return {
      protein: { grams: p, pct: Math.round((p / total) * 100) },
      carbs: { grams: c, pct: Math.round((c / total) * 100) },
      fat: { grams: f, pct: Math.round((f / total) * 100) },
    };
  }, [entries]);

  const pieData = [
    { name: 'Protein', value: macroTotals.protein.pct || 33, color: '#6366f1' },
    { name: 'Carbs', value: macroTotals.carbs.pct || 34, color: '#eab308' },
    { name: 'Fat', value: macroTotals.fat.pct || 33, color: '#f43f5e' },
  ];

  const foodCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    entries.forEach((e) => { counts[e.name] = (counts[e.name] || 0) + 1; });
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0] || ['None', 0];
  }, [entries]);

  const highestCalDay = useMemo(() => {
    const byDate: Record<string, number> = {};
    entries.forEach((e) => { byDate[e.date] = (byDate[e.date] || 0) + e.calories; });
    const sorted = Object.entries(byDate).sort((a, b) => b[1] - a[1]);
    if (sorted.length === 0) return { day: 'N/A', cal: 0 };
    return { day: format(new Date(sorted[0][0]), 'EEE'), cal: sorted[0][1] };
  }, [entries]);

  const streak = useMemo(() => {
    let count = 0;
    for (let i = 0; i < 365; i++) {
      if (entries.some((e) => e.date === format(subDays(new Date(), i), 'yyyy-MM-dd'))) count++;
      else break;
    }
    return count;
  }, [entries]);

  const totalCalThisWeek = weekData.reduce((s, d) => s + d.calories, 0);

  return (
    <div className="px-5 pt-12 fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold" style={{ fontFamily: 'Sora, sans-serif' }}>Dashboard</h1>
        <div className="flex items-center gap-1.5 glass rounded-full px-3 py-1.5">
          <ChevronLeft size={14} className="text-[var(--text-muted)]" />
          <span className="text-[11px] font-semibold text-[var(--text-secondary)]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            This Week
          </span>
          <ChevronRight size={14} className="text-[var(--text-muted)]" />
        </div>
      </div>

      {/* Summary cards */}
      <div className="flex gap-2 mb-5">
        <div className="flex-1 glass-card rounded-2xl p-3.5 text-center">
          <p className="text-2xl font-extrabold text-[var(--accent)]" style={{ fontFamily: 'Sora, sans-serif' }}>
            {totalCalThisWeek.toLocaleString()}
          </p>
          <p className="text-[10px] text-[var(--text-muted)] mt-0.5" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            TOTAL KCAL
          </p>
        </div>
        <div className="flex-1 glass-card rounded-2xl p-3.5 text-center">
          <p className="text-2xl font-extrabold text-[var(--text-primary)]" style={{ fontFamily: 'Sora, sans-serif' }}>
            {avgCalories.toLocaleString()}
          </p>
          <p className="text-[10px] text-[var(--text-muted)] mt-0.5" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            DAILY AVG
          </p>
        </div>
      </div>

      {/* Weekly Chart */}
      <div className="glass-card rounded-2xl p-4 mb-4">
        <h3 className="text-sm font-bold mb-3" style={{ fontFamily: 'Sora, sans-serif' }}>Calories This Week</h3>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={weekData} barCategoryGap="18%">
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#52525b', fontSize: 10, fontFamily: 'Space Grotesk' }} />
            <ReferenceLine y={goals.calories} stroke="#f9731633" strokeDasharray="6 4" />
            <Bar dataKey="calories" radius={[6, 6, 0, 0]}>
              {weekData.map((entry, i) => (
                <Cell key={i} fill={entry.isToday ? '#f97316' : '#f9731644'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="flex items-center justify-center gap-4 mt-2">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-[var(--accent)]" />
            <span className="text-[10px] text-[var(--text-muted)]">Today</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-px border-t border-dashed border-[var(--accent)]" />
            <span className="text-[10px] text-[var(--text-muted)]">Goal ({goals.calories})</span>
          </div>
        </div>
      </div>

      {/* Macro Breakdown */}
      <div className="glass-card rounded-2xl p-4 mb-4">
        <h3 className="text-sm font-bold mb-3" style={{ fontFamily: 'Sora, sans-serif' }}>Macros Split</h3>
        <div className="flex items-center gap-5">
          <div className="w-28 h-28 flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={30} outerRadius={48} paddingAngle={4} dataKey="value" strokeWidth={0}>
                  {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1 flex flex-col gap-3">
            {[
              { label: 'Protein', pct: macroTotals.protein.pct, g: macroTotals.protein.grams, color: '#6366f1' },
              { label: 'Carbs', pct: macroTotals.carbs.pct, g: macroTotals.carbs.grams, color: '#eab308' },
              { label: 'Fat', pct: macroTotals.fat.pct, g: macroTotals.fat.grams, color: '#f43f5e' },
            ].map((m) => (
              <div key={m.label} className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: m.color }} />
                <span className="text-xs text-[var(--text-secondary)] flex-1">{m.label}</span>
                <span className="text-xs font-bold" style={{ color: m.color }}>{m.pct}%</span>
                <span className="text-[10px] text-[var(--text-muted)] w-10 text-right">{m.g}g</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-2.5 mb-8">
        {[
          { icon: TrendingUp, color: 'var(--amber)', label: 'Most Eaten', value: foodCounts[0] as string, sub: `${foodCounts[1]} times` },
          { icon: Flame, color: 'var(--rose)', label: 'Peak Day', value: highestCalDay.day, sub: `${highestCalDay.cal.toLocaleString()} kcal` },
          { icon: Trophy, color: 'var(--accent)', label: 'Streak', value: `${streak}`, sub: 'days logging' },
          { icon: Droplets, color: 'var(--blue)', label: 'Hydration', value: '2.1L', sub: 'avg / day' },
        ].map((s) => (
          <div key={s.label} className="glass-card rounded-2xl p-3.5">
            <s.icon size={16} style={{ color: s.color }} className="mb-2" />
            <p className="text-[10px] text-[var(--text-muted)] mb-0.5 uppercase tracking-wide" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              {s.label}
            </p>
            <p className="text-sm font-bold truncate" style={{ fontFamily: 'Sora, sans-serif' }}>{s.value}</p>
            <p className="text-[10px] text-[var(--text-muted)]">{s.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
