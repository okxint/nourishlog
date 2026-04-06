'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { format, subDays, addDays, startOfWeek, endOfWeek, isWithinInterval, parseISO } from 'date-fns';
import { ChevronLeft, ChevronRight, Download, Search, X, Flame, Droplets, Trophy, TrendingUp, Filter, CalendarDays } from 'lucide-react';
import { getEntries, getProfile } from '@/lib/store';
import { FoodEntry } from '@/lib/types';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, ReferenceLine, PieChart, Pie, Tooltip } from 'recharts';

type DateRange = 'today' | 'week' | 'month' | 'custom';
type MealFilter = 'all' | 'breakfast' | 'lunch' | 'dinner' | 'snack';

const DAYS_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function DashboardPage() {
  const [allEntries, setAllEntries] = useState<FoodEntry[]>([]);
  const [goals, setGoals] = useState({ calories: 2000, protein: 120, carbs: 250, fat: 65, water: 3 });

  // Filters
  const [dateRange, setDateRange] = useState<DateRange>('week');
  const [weekOffset, setWeekOffset] = useState(0);
  const [mealFilter, setMealFilter] = useState<MealFilter>('all');
  const [foodSearch, setFoodSearch] = useState('');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [customFrom, setCustomFrom] = useState(format(subDays(new Date(), 7), 'yyyy-MM-dd'));
  const [customTo, setCustomTo] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    setAllEntries(getEntries());
    setGoals(getProfile().goals);
  }, []);

  // Compute date range bounds
  const dateRangeBounds = useMemo(() => {
    const today = new Date();
    if (dateRange === 'today') {
      const d = format(today, 'yyyy-MM-dd');
      return { from: d, to: d, label: format(today, 'EEEE, d MMM') };
    }
    if (dateRange === 'week') {
      const start = startOfWeek(addDays(today, weekOffset * 7), { weekStartsOn: 1 });
      const end = endOfWeek(addDays(today, weekOffset * 7), { weekStartsOn: 1 });
      return {
        from: format(start, 'yyyy-MM-dd'),
        to: format(end, 'yyyy-MM-dd'),
        label: weekOffset === 0 ? 'This Week' : weekOffset === -1 ? 'Last Week' : `${format(start, 'd MMM')} — ${format(end, 'd MMM')}`,
      };
    }
    if (dateRange === 'month') {
      const start = subDays(today, 30);
      return { from: format(start, 'yyyy-MM-dd'), to: format(today, 'yyyy-MM-dd'), label: 'Last 30 Days' };
    }
    return { from: customFrom, to: customTo, label: `${format(parseISO(customFrom), 'd MMM')} — ${format(parseISO(customTo), 'd MMM')}` };
  }, [dateRange, weekOffset, customFrom, customTo]);

  // Filter entries
  const filteredEntries = useMemo(() => {
    return allEntries.filter((e) => {
      if (e.date < dateRangeBounds.from || e.date > dateRangeBounds.to) return false;
      if (selectedDate && e.date !== selectedDate) return false;
      if (mealFilter !== 'all' && e.mealType !== mealFilter) return false;
      if (foodSearch && !e.name.toLowerCase().includes(foodSearch.toLowerCase())) return false;
      return true;
    });
  }, [allEntries, dateRangeBounds, selectedDate, mealFilter, foodSearch]);

  // Weekly chart data
  const chartData = useMemo(() => {
    if (dateRange === 'today') return [];
    const data = [];
    const start = parseISO(dateRangeBounds.from);
    const end = parseISO(dateRangeBounds.to);
    const days = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const todayStr = format(new Date(), 'yyyy-MM-dd');

    for (let i = 0; i < Math.min(days, 31); i++) {
      const d = addDays(start, i);
      const dateStr = format(d, 'yyyy-MM-dd');
      const dayEntries = allEntries.filter((e) => {
        if (e.date !== dateStr) return false;
        if (mealFilter !== 'all' && e.mealType !== mealFilter) return false;
        if (foodSearch && !e.name.toLowerCase().includes(foodSearch.toLowerCase())) return false;
        return true;
      });
      data.push({
        day: days <= 7 ? DAYS_SHORT[d.getDay() === 0 ? 6 : d.getDay() - 1] : format(d, 'd'),
        date: dateStr,
        calories: dayEntries.reduce((s, e) => s + e.calories, 0),
        isToday: dateStr === todayStr,
        isSelected: dateStr === selectedDate,
      });
    }
    return data;
  }, [allEntries, dateRangeBounds, dateRange, mealFilter, foodSearch, selectedDate]);

  // Summary
  const totals = useMemo(() => {
    return filteredEntries.reduce(
      (acc, e) => ({ cal: acc.cal + e.calories, p: acc.p + e.protein, c: acc.c + e.carbs, f: acc.f + e.fat, fb: acc.fb + e.fiber }),
      { cal: 0, p: 0, c: 0, f: 0, fb: 0 }
    );
  }, [filteredEntries]);

  const uniqueDays = useMemo(() => new Set(filteredEntries.map((e) => e.date)).size, [filteredEntries]);
  const avgCalories = uniqueDays > 0 ? Math.round(totals.cal / uniqueDays) : 0;

  // Macro donut
  const macroTotal = totals.p + totals.c + totals.f || 1;
  const pieData = [
    { name: 'Protein', value: Math.round((totals.p / macroTotal) * 100) || 33, color: '#6366f1' },
    { name: 'Carbs', value: Math.round((totals.c / macroTotal) * 100) || 34, color: '#eab308' },
    { name: 'Fat', value: Math.round((totals.f / macroTotal) * 100) || 33, color: '#f43f5e' },
  ];

  // Stats
  const foodCounts = useMemo(() => {
    const c: Record<string, number> = {};
    filteredEntries.forEach((e) => { c[e.name] = (c[e.name] || 0) + 1; });
    return Object.entries(c).sort((a, b) => b[1] - a[1])[0] || ['None', 0];
  }, [filteredEntries]);

  const highestCalDay = useMemo(() => {
    const byDate: Record<string, number> = {};
    filteredEntries.forEach((e) => { byDate[e.date] = (byDate[e.date] || 0) + e.calories; });
    const sorted = Object.entries(byDate).sort((a, b) => b[1] - a[1]);
    if (sorted.length === 0) return { day: 'N/A', cal: 0 };
    return { day: format(parseISO(sorted[0][0]), 'EEE d'), cal: sorted[0][1] };
  }, [filteredEntries]);

  const streak = useMemo(() => {
    let count = 0;
    for (let i = 0; i < 365; i++) {
      if (allEntries.some((e) => e.date === format(subDays(new Date(), i), 'yyyy-MM-dd'))) count++;
      else break;
    }
    return count;
  }, [allEntries]);

  // CSV Export
  const exportCSV = useCallback(() => {
    // Build a date → { breakfast, lunch, dinner, snack } map
    const dateMap: Record<string, Record<string, string[]>> = {};
    filteredEntries.forEach((e) => {
      if (!dateMap[e.date]) dateMap[e.date] = { breakfast: [], lunch: [], dinner: [], snack: [] };
      dateMap[e.date][e.mealType].push(`${e.name} (${e.calories} kcal)`);
    });

    const dates = Object.keys(dateMap).sort();
    const rows = [
      ['Date', 'Day', 'Breakfast', 'Lunch', 'Dinner', 'Snack', 'Total Calories', 'Protein (g)', 'Carbs (g)', 'Fat (g)'].join(','),
    ];

    dates.forEach((date) => {
      const dayEntries = filteredEntries.filter((e) => e.date === date);
      const dayCal = dayEntries.reduce((s, e) => s + e.calories, 0);
      const dayP = dayEntries.reduce((s, e) => s + e.protein, 0);
      const dayC = dayEntries.reduce((s, e) => s + e.carbs, 0);
      const dayF = dayEntries.reduce((s, e) => s + e.fat, 0);
      const m = dateMap[date];
      rows.push([
        date,
        format(parseISO(date), 'EEEE'),
        `"${m.breakfast.join('; ') || '—'}"`,
        `"${m.lunch.join('; ') || '—'}"`,
        `"${m.dinner.join('; ') || '—'}"`,
        `"${m.snack.join('; ') || '—'}"`,
        dayCal.toString(),
        dayP.toString(),
        dayC.toString(),
        dayF.toString(),
      ].join(','));
    });

    const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nourishlog_${dateRangeBounds.from}_to_${dateRangeBounds.to}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [filteredEntries, dateRangeBounds]);

  // History table entries grouped by date
  const historyByDate = useMemo(() => {
    const map: Record<string, FoodEntry[]> = {};
    filteredEntries.forEach((e) => {
      if (!map[e.date]) map[e.date] = [];
      map[e.date].push(e);
    });
    return Object.entries(map).sort((a, b) => b[0].localeCompare(a[0]));
  }, [filteredEntries]);

  const hasActiveFilters = mealFilter !== 'all' || foodSearch !== '' || selectedDate !== null;

  return (
    <div className="px-5 lg:px-8 pt-10 lg:pt-8 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>Dashboard</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${showFilters || hasActiveFilters ? 'bg-[var(--accent-dim)] text-[var(--accent)]' : 'glass text-[var(--text-secondary)]'}`}
          >
            <Filter size={13} />
            Filters{hasActiveFilters ? ' (active)' : ''}
          </button>
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
          >
            <Download size={13} /> Export CSV
          </button>
        </div>
      </div>

      {/* Date Range Selector */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {(['today', 'week', 'month', 'custom'] as DateRange[]).map((r) => (
          <button
            key={r}
            onClick={() => { setDateRange(r); setWeekOffset(0); setSelectedDate(null); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${dateRange === r ? 'bg-[var(--accent)] text-white' : 'glass text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
            style={{ fontFamily: 'IBM Plex Mono, monospace' }}
          >
            {r}
          </button>
        ))}

        {dateRange === 'week' && (
          <div className="flex items-center gap-1 ml-2">
            <button onClick={() => setWeekOffset(weekOffset - 1)} className="w-7 h-7 rounded-lg glass flex items-center justify-center hover:bg-[var(--bg-card-hover)]">
              <ChevronLeft size={14} className="text-[var(--text-muted)]" />
            </button>
            <span className="text-xs font-semibold min-w-[90px] text-center" style={{ color: 'var(--text-secondary)', fontFamily: 'IBM Plex Mono' }}>
              {dateRangeBounds.label}
            </span>
            <button onClick={() => weekOffset < 0 && setWeekOffset(weekOffset + 1)} className="w-7 h-7 rounded-lg glass flex items-center justify-center hover:bg-[var(--bg-card-hover)]" disabled={weekOffset >= 0}>
              <ChevronRight size={14} className={weekOffset >= 0 ? 'text-[var(--border)]' : 'text-[var(--text-muted)]'} />
            </button>
          </div>
        )}

        {dateRange === 'custom' && (
          <div className="flex items-center gap-2 ml-2">
            <input type="date" value={customFrom} onChange={(e) => setCustomFrom(e.target.value)}
              className="px-2 py-1 rounded-lg text-xs bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]" />
            <span className="text-xs text-[var(--text-muted)]">to</span>
            <input type="date" value={customTo} onChange={(e) => setCustomTo(e.target.value)}
              className="px-2 py-1 rounded-lg text-xs bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]" />
          </div>
        )}

        {selectedDate && (
          <button onClick={() => setSelectedDate(null)} className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium bg-[var(--blue-dim)] text-[var(--blue)]">
            <CalendarDays size={11} /> {format(parseISO(selectedDate), 'd MMM')} <X size={10} />
          </button>
        )}
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="glass-card rounded-xl p-4 mb-4 flex flex-col sm:flex-row gap-3 slide-up">
          <div className="flex-1">
            <label className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-1 block" style={{ fontFamily: 'IBM Plex Mono' }}>Meal Type</label>
            <div className="flex gap-1.5 flex-wrap">
              {(['all', 'breakfast', 'lunch', 'dinner', 'snack'] as MealFilter[]).map((m) => (
                <button key={m} onClick={() => setMealFilter(m)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium capitalize transition-all ${mealFilter === m ? 'bg-[var(--accent)] text-white' : 'bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}>
                  {m}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1">
            <label className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-1 block" style={{ fontFamily: 'IBM Plex Mono' }}>Search Food</label>
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input type="text" placeholder="e.g. biryani, dosa..." value={foodSearch} onChange={(e) => setFoodSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg text-xs bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)]" />
              {foodSearch && (
                <button onClick={() => setFoodSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2"><X size={12} className="text-[var(--text-muted)]" /></button>
              )}
            </div>
          </div>
          {hasActiveFilters && (
            <div className="flex items-end">
              <button onClick={() => { setMealFilter('all'); setFoodSearch(''); setSelectedDate(null); }}
                className="text-[11px] font-medium text-[var(--rose)] hover:underline whitespace-nowrap">
                Clear all filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-5">
        <div className="glass-card rounded-xl p-3 text-center">
          <p className="text-xl font-extrabold text-[var(--accent)]" style={{ fontFamily: 'Bricolage Grotesque' }}>{totals.cal.toLocaleString()}</p>
          <p className="text-[9px] text-[var(--text-muted)] mt-0.5 uppercase font-semibold" style={{ fontFamily: 'IBM Plex Mono' }}>Total kcal</p>
        </div>
        <div className="glass-card rounded-xl p-3 text-center">
          <p className="text-xl font-extrabold" style={{ fontFamily: 'Bricolage Grotesque' }}>{avgCalories.toLocaleString()}</p>
          <p className="text-[9px] text-[var(--text-muted)] mt-0.5 uppercase font-semibold" style={{ fontFamily: 'IBM Plex Mono' }}>Daily Avg</p>
        </div>
        <div className="glass-card rounded-xl p-3 text-center">
          <p className="text-xl font-extrabold" style={{ fontFamily: 'Bricolage Grotesque' }}>{filteredEntries.length}</p>
          <p className="text-[9px] text-[var(--text-muted)] mt-0.5 uppercase font-semibold" style={{ fontFamily: 'IBM Plex Mono' }}>Meals</p>
        </div>
        <div className="glass-card rounded-xl p-3 text-center">
          <p className="text-xl font-extrabold" style={{ fontFamily: 'Bricolage Grotesque' }}>{uniqueDays}</p>
          <p className="text-[9px] text-[var(--text-muted)] mt-0.5 uppercase font-semibold" style={{ fontFamily: 'IBM Plex Mono' }}>Days</p>
        </div>
      </div>

      {/* Charts */}
      {dateRange !== 'today' && chartData.length > 0 && (
        <div className="flex flex-col lg:flex-row gap-4 mb-4">
          <div className="flex-[2] glass-card rounded-xl p-4">
            <h3 className="text-sm font-bold mb-3" style={{ fontFamily: 'Bricolage Grotesque' }}>
              Calories {mealFilter !== 'all' ? `(${mealFilter})` : ''} {foodSearch ? `matching "${foodSearch}"` : ''}
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData} barCategoryGap="15%">
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 10, fontFamily: 'IBM Plex Mono' }} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 11, fontFamily: 'Inter' }}
                  labelStyle={{ color: 'var(--text-primary)', fontWeight: 600 }}
                  itemStyle={{ color: 'var(--text-secondary)' }}
                  formatter={(value) => [`${value} kcal`, 'Calories']}
                  labelFormatter={(_, payload) => payload?.[0]?.payload?.date ? format(parseISO(payload[0].payload.date), 'EEE, d MMM') : ''}
                />
                <ReferenceLine y={goals.calories} stroke="var(--accent)" strokeOpacity={0.2} strokeDasharray="6 4" />
                <Bar dataKey="calories" radius={[4, 4, 0, 0]} cursor="pointer"
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onClick={(data: any) => { const d = data?.date as string; if (d) setSelectedDate(selectedDate === d ? null : d); }}>
                  {chartData.map((entry, i) => (
                    <Cell key={i} fill={entry.isSelected ? 'var(--blue)' : entry.isToday ? 'var(--accent)' : 'color-mix(in srgb, var(--accent) 35%, transparent)'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="flex items-center justify-center gap-4 mt-1">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[var(--accent)]" />
                <span className="text-[9px] text-[var(--text-muted)]">Today</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[var(--blue)]" />
                <span className="text-[9px] text-[var(--text-muted)]">Selected</span>
              </div>
              <span className="text-[9px] text-[var(--text-muted)]">Click a bar to filter by date</span>
            </div>
          </div>

          <div className="flex-1 glass-card rounded-xl p-4">
            <h3 className="text-sm font-bold mb-3" style={{ fontFamily: 'Bricolage Grotesque' }}>Macro Split</h3>
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 flex-shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={28} outerRadius={44} paddingAngle={3} dataKey="value" strokeWidth={0}>
                      {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 flex flex-col gap-2.5">
                {[
                  { label: 'Protein', pct: pieData[0].value, g: totals.p, color: '#6366f1' },
                  { label: 'Carbs', pct: pieData[1].value, g: totals.c, color: '#eab308' },
                  { label: 'Fat', pct: pieData[2].value, g: totals.f, color: '#f43f5e' },
                ].map((m) => (
                  <div key={m.label} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: m.color }} />
                    <span className="text-[11px] text-[var(--text-secondary)] flex-1">{m.label}</span>
                    <span className="text-[11px] font-bold" style={{ color: m.color }}>{m.pct}%</span>
                    <span className="text-[10px] text-[var(--text-muted)] w-10 text-right">{m.g}g</span>
                  </div>
                ))}
                <div className="text-[10px] text-[var(--text-muted)] pt-1 border-t border-[var(--border)]">
                  Fiber: {totals.fb}g total
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-5">
        {[
          { icon: TrendingUp, color: 'var(--amber)', label: 'Most Eaten', value: foodCounts[0] as string, sub: `${foodCounts[1]}x` },
          { icon: Flame, color: 'var(--rose)', label: 'Peak Day', value: highestCalDay.day, sub: `${highestCalDay.cal.toLocaleString()} kcal` },
          { icon: Trophy, color: 'var(--accent)', label: 'Streak', value: `${streak}`, sub: 'days' },
          { icon: Droplets, color: 'var(--blue)', label: 'Avg Protein', value: `${uniqueDays > 0 ? Math.round(totals.p / uniqueDays) : 0}g`, sub: `/ ${goals.protein}g goal` },
        ].map((s) => (
          <div key={s.label} className="glass-card rounded-xl p-3">
            <s.icon size={14} style={{ color: s.color }} className="mb-1.5" />
            <p className="text-[9px] text-[var(--text-muted)] uppercase tracking-wide" style={{ fontFamily: 'IBM Plex Mono' }}>{s.label}</p>
            <p className="text-sm font-bold truncate" style={{ fontFamily: 'Bricolage Grotesque' }}>{s.value}</p>
            <p className="text-[10px] text-[var(--text-muted)]">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Meal History Table */}
      <div className="mb-8">
        <button onClick={() => setShowHistory(!showHistory)}
          className="flex items-center gap-2 mb-3 text-sm font-bold hover:text-[var(--accent)] transition-colors" style={{ fontFamily: 'Bricolage Grotesque' }}>
          {showHistory ? '▾' : '▸'} Meal History ({filteredEntries.length} entries)
        </button>

        {showHistory && (
          <div className="glass-card rounded-xl overflow-hidden">
            {/* Table header */}
            <div className="hidden lg:grid grid-cols-12 gap-2 px-4 py-2 text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wide border-b border-[var(--border)]" style={{ fontFamily: 'IBM Plex Mono' }}>
              <div className="col-span-2">Date</div>
              <div className="col-span-3">Food</div>
              <div className="col-span-1">Meal</div>
              <div className="col-span-1">Time</div>
              <div className="col-span-1 text-right">Calories</div>
              <div className="col-span-1 text-right">Protein</div>
              <div className="col-span-1 text-right">Carbs</div>
              <div className="col-span-1 text-right">Fat</div>
              <div className="col-span-1 text-right">Score</div>
            </div>

            {historyByDate.length === 0 ? (
              <div className="p-6 text-center text-sm text-[var(--text-muted)]">No entries match your filters.</div>
            ) : (
              historyByDate.map(([date, entries]) => (
                <div key={date}>
                  {/* Date header (mobile) */}
                  <div className="lg:hidden px-4 py-2 text-[11px] font-bold border-b border-[var(--border)]" style={{ background: 'var(--bg-elevated)', fontFamily: 'Bricolage Grotesque' }}>
                    {format(parseISO(date), 'EEEE, d MMMM yyyy')}
                    <span className="ml-2 font-normal text-[var(--text-muted)]">
                      ({entries.reduce((s, e) => s + e.calories, 0)} kcal)
                    </span>
                  </div>
                  {entries.sort((a, b) => a.time.localeCompare(b.time)).map((entry) => (
                    <div key={entry.id} className="grid grid-cols-12 gap-2 px-4 py-2 text-xs border-b border-[var(--border)] hover:bg-[var(--bg-card-hover)] transition-colors items-center">
                      <div className="col-span-4 lg:col-span-2 text-[var(--text-secondary)] hidden lg:block">
                        {format(parseISO(entry.date), 'EEE, d MMM')}
                      </div>
                      <div className="col-span-6 lg:col-span-3 font-medium truncate">{entry.name}</div>
                      <div className="col-span-3 lg:col-span-1">
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-medium capitalize ${
                          entry.mealType === 'breakfast' ? 'bg-[var(--blue-dim)] text-[var(--blue)]' :
                          entry.mealType === 'lunch' ? 'bg-[var(--amber-dim)] text-[var(--amber)]' :
                          entry.mealType === 'dinner' ? 'bg-[var(--rose-dim)] text-[var(--rose)]' :
                          'bg-[var(--green-dim)] text-[var(--green)]'
                        }`}>
                          {entry.mealType}
                        </span>
                      </div>
                      <div className="col-span-3 lg:col-span-1 text-[var(--text-muted)] hidden lg:block">{entry.time}</div>
                      <div className="col-span-3 lg:col-span-1 text-right font-bold text-[var(--accent)]">{entry.calories}</div>
                      <div className="col-span-1 text-right text-[var(--text-muted)] hidden lg:block">{entry.protein}g</div>
                      <div className="col-span-1 text-right text-[var(--text-muted)] hidden lg:block">{entry.carbs}g</div>
                      <div className="col-span-1 text-right text-[var(--text-muted)] hidden lg:block">{entry.fat}g</div>
                      <div className="col-span-1 text-right hidden lg:block">
                        {entry.healthScore && <span className="text-[var(--green)]">{entry.healthScore}/10</span>}
                      </div>
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
