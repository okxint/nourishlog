'use client';

import { useEffect, useState, useMemo } from 'react';
import { format, subDays } from 'date-fns';
import { ChevronLeft, ChevronRight, Flame, Droplets, Trophy, UtensilsCrossed } from 'lucide-react';
import { getEntries, getProfile } from '@/lib/store';
import { FoodEntry } from '@/lib/types';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, ReferenceLine, PieChart, Pie } from 'recharts';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function DashboardPage() {
  const [entries, setEntries] = useState<FoodEntry[]>([]);
  const [goals, setGoals] = useState({ calories: 2200, protein: 150, carbs: 250, fat: 70, water: 2.5 });

  useEffect(() => {
    setEntries(getEntries());
    const p = getProfile();
    setGoals(p.goals);
  }, []);

  const weekData = useMemo(() => {
    const data = [];
    const today = new Date();
    const dayOfWeek = today.getDay();
    // Map to Mon=0 ... Sun=6
    const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

    for (let i = 0; i < 7; i++) {
      const date = subDays(today, mondayOffset - i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const dayEntries = entries.filter((e) => e.date === dateStr);
      const totalCal = dayEntries.reduce((sum, e) => sum + e.calories, 0);
      const isToday = dateStr === format(today, 'yyyy-MM-dd');
      data.push({
        day: DAYS[i],
        calories: totalCal,
        isToday,
      });
    }
    return data;
  }, [entries]);

  const avgCalories = useMemo(() => {
    const withData = weekData.filter((d) => d.calories > 0);
    if (withData.length === 0) return 0;
    return Math.round(withData.reduce((s, d) => s + d.calories, 0) / withData.length);
  }, [weekData]);

  const macroTotals = useMemo(() => {
    const thisWeekEntries = entries.filter((e) => {
      const d = new Date(e.date);
      const now = new Date();
      const diff = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
      return diff <= 7;
    });
    const p = thisWeekEntries.reduce((s, e) => s + e.protein, 0);
    const c = thisWeekEntries.reduce((s, e) => s + e.carbs, 0);
    const f = thisWeekEntries.reduce((s, e) => s + e.fat, 0);
    const total = p + c + f || 1;
    return {
      protein: { grams: p, pct: Math.round((p / total) * 100) },
      carbs: { grams: c, pct: Math.round((c / total) * 100) },
      fat: { grams: f, pct: Math.round((f / total) * 100) },
    };
  }, [entries]);

  const pieData = [
    { name: 'Protein', value: macroTotals.protein.pct, color: 'var(--blue)' },
    { name: 'Carbs', value: macroTotals.carbs.pct, color: 'var(--amber)' },
    { name: 'Fat', value: macroTotals.fat.pct, color: 'var(--rose)' },
  ];

  // Stats
  const foodCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    entries.forEach((e) => { counts[e.name] = (counts[e.name] || 0) + 1; });
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    return sorted[0] || ['None', 0];
  }, [entries]);

  const highestCalDay = useMemo(() => {
    const byDate: Record<string, number> = {};
    entries.forEach((e) => { byDate[e.date] = (byDate[e.date] || 0) + e.calories; });
    const sorted = Object.entries(byDate).sort((a, b) => b[1] - a[1]);
    if (sorted.length === 0) return { day: 'N/A', cal: 0 };
    return { day: format(new Date(sorted[0][0]), 'EEEE'), cal: sorted[0][1] };
  }, [entries]);

  const streak = useMemo(() => {
    let count = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const dateStr = format(subDays(today, i), 'yyyy-MM-dd');
      if (entries.some((e) => e.date === dateStr)) {
        count++;
      } else {
        break;
      }
    }
    return count;
  }, [entries]);

  return (
    <div className="px-5 pt-12 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'Sora, sans-serif' }}>Dashboard</h1>
        <div className="flex items-center gap-2 glass-card rounded-full px-3 py-1.5">
          <ChevronLeft size={16} className="text-[var(--text-muted)]" />
          <span className="text-xs font-medium text-[var(--text-secondary)]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>This Week</span>
          <ChevronRight size={16} className="text-[var(--text-muted)]" />
        </div>
      </div>

      {/* Weekly Calorie Chart */}
      <div className="glass-card rounded-2xl p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold" style={{ fontFamily: 'Sora, sans-serif' }}>Weekly Calories</h3>
          <span className="text-xs text-[var(--text-muted)]">Avg: <span className="text-[var(--green)] font-semibold">{avgCalories.toLocaleString()} kcal</span></span>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={weekData} barCategoryGap="20%">
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#6b6b80', fontSize: 11 }} />
            <YAxis hide domain={[0, 3000]} />
            <ReferenceLine y={goals.calories} stroke="#4ADE8066" strokeDasharray="6 4" />
            <Bar dataKey="calories" radius={[6, 6, 0, 0]}>
              {weekData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={entry.isToday ? '#4ADE80' : '#4ADE8066'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Macro Breakdown */}
      <div className="glass-card rounded-2xl p-4 mb-4">
        <h3 className="text-sm font-semibold mb-3" style={{ fontFamily: 'Sora, sans-serif' }}>Macro Breakdown</h3>
        <div className="flex items-center gap-4">
          <div className="w-32 h-32">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%" cy="50%"
                  innerRadius={35} outerRadius={55}
                  paddingAngle={3}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1 flex flex-col gap-2.5">
            {[
              { label: 'Protein', pct: macroTotals.protein.pct, grams: macroTotals.protein.grams, color: 'var(--blue)' },
              { label: 'Carbs', pct: macroTotals.carbs.pct, grams: macroTotals.carbs.grams, color: 'var(--amber)' },
              { label: 'Fat', pct: macroTotals.fat.pct, grams: macroTotals.fat.grams, color: 'var(--rose)' },
            ].map((m) => (
              <div key={m.label} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: m.color }} />
                <span className="text-xs text-[var(--text-secondary)] flex-1">{m.label}</span>
                <span className="text-xs font-semibold" style={{ color: m.color }}>{m.pct}%</span>
                <span className="text-[10px] text-[var(--text-muted)]">{m.grams}g</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-2.5 mb-8">
        <div className="glass-card rounded-xl p-3.5">
          <UtensilsCrossed size={18} className="text-[var(--amber)] mb-2" />
          <p className="text-[10px] text-[var(--text-muted)] mb-0.5" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Most Eaten</p>
          <p className="text-sm font-semibold truncate">{foodCounts[0]}</p>
          <p className="text-[10px] text-[var(--text-muted)]">{foodCounts[1]} times</p>
        </div>
        <div className="glass-card rounded-xl p-3.5">
          <Flame size={18} className="text-[var(--rose)] mb-2" />
          <p className="text-[10px] text-[var(--text-muted)] mb-0.5" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Highest Cal Day</p>
          <p className="text-sm font-semibold">{highestCalDay.day}</p>
          <p className="text-[10px] text-[var(--text-muted)]">{highestCalDay.cal.toLocaleString()} kcal</p>
        </div>
        <div className="glass-card rounded-xl p-3.5">
          <Trophy size={18} className="text-[var(--green)] mb-2" />
          <p className="text-[10px] text-[var(--text-muted)] mb-0.5" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Streak</p>
          <p className="text-sm font-semibold">{streak} days</p>
          <p className="text-[10px] text-[var(--text-muted)]">Keep it going!</p>
        </div>
        <div className="glass-card rounded-xl p-3.5">
          <Droplets size={18} className="text-[var(--blue)] mb-2" />
          <p className="text-[10px] text-[var(--text-muted)] mb-0.5" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Water</p>
          <p className="text-sm font-semibold">2.1L</p>
          <p className="text-[10px] text-[var(--text-muted)]">avg / day</p>
        </div>
      </div>
    </div>
  );
}
