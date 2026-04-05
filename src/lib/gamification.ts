'use client';

import { getEntries, getProfile } from './store';
import { format, subDays } from 'date-fns';

const ACHIEVEMENTS_KEY = 'nourishlog_achievements';

// ─── Streak ───
export function getStreak(): number {
  const entries = getEntries();
  let count = 0;
  for (let i = 0; i < 365; i++) {
    if (entries.some((e) => e.date === format(subDays(new Date(), i), 'yyyy-MM-dd'))) count++;
    else break;
  }
  return count;
}

// ─── Achievements (simple, fun badges) ───
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

const achievementDefs: Omit<Achievement, 'unlocked'>[] = [
  { id: 'first_meal', title: 'First Bite', description: 'Log your first meal', icon: '🍽️' },
  { id: 'ten_meals', title: 'Getting Started', description: 'Log 10 meals', icon: '🔟' },
  { id: 'fifty_meals', title: 'Committed', description: 'Log 50 meals', icon: '💪' },
  { id: 'hundred_meals', title: 'Centurion', description: 'Log 100 meals', icon: '💯' },
  { id: 'streak_3', title: 'On a Roll', description: '3-day streak', icon: '🔥' },
  { id: 'streak_7', title: 'Week Warrior', description: '7-day streak', icon: '⚡' },
  { id: 'streak_14', title: 'Two Weeks Strong', description: '14-day streak', icon: '🏅' },
  { id: 'streak_30', title: 'Monthly Master', description: '30-day streak', icon: '👑' },
  { id: 'protein_goal', title: 'Protein Loaded', description: 'Hit protein goal in a day', icon: '🥩' },
  { id: 'under_goal', title: 'On Budget', description: 'Stay under calorie goal', icon: '🎯' },
  { id: 'healthy_day', title: 'Clean Eater', description: 'Avg health score 7+ in a day', icon: '🥗' },
  { id: 'variety_10', title: 'Explorer', description: 'Eat 10 different foods', icon: '🗺️' },
  { id: 'variety_25', title: 'Adventurous', description: 'Eat 25 different foods', icon: '🌍' },
  { id: 'all_meals', title: 'Full Day', description: 'Log breakfast, lunch & dinner', icon: '📋' },
  { id: 'photo_first', title: 'Snap Happy', description: 'Log a meal with a photo', icon: '📸' },
  { id: 'fiber_champ', title: 'Fiber Champ', description: 'Eat 25g+ fiber in a day', icon: '🌿' },
  { id: 'breakfast_5', title: 'Early Bird', description: 'Log breakfast 5 days in a row', icon: '🌅' },
  { id: 'custom_recipe', title: 'Recipe Creator', description: 'Add a custom recipe', icon: '🍳' },
];

function getUnlockedIds(): Record<string, boolean> {
  if (typeof window === 'undefined') return {};
  const stored = localStorage.getItem(ACHIEVEMENTS_KEY);
  return stored ? JSON.parse(stored) : {};
}

function unlock(id: string): boolean {
  const unlocked = getUnlockedIds();
  if (unlocked[id]) return false;
  unlocked[id] = true;
  localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(unlocked));
  return true;
}

export function getAchievements(): Achievement[] {
  const unlocked = getUnlockedIds();
  return achievementDefs.map((a) => ({ ...a, unlocked: !!unlocked[a.id] }));
}

export function checkAchievements(): string[] {
  const entries = getEntries();
  const goals = getProfile().goals;
  const today = format(new Date(), 'yyyy-MM-dd');
  const todayEntries = entries.filter((e) => e.date === today);
  const newlyUnlocked: string[] = [];

  const tryUnlock = (id: string) => { if (unlock(id)) newlyUnlocked.push(id); };

  if (entries.length >= 1) tryUnlock('first_meal');
  if (entries.length >= 10) tryUnlock('ten_meals');
  if (entries.length >= 50) tryUnlock('fifty_meals');
  if (entries.length >= 100) tryUnlock('hundred_meals');

  const streak = getStreak();
  if (streak >= 3) tryUnlock('streak_3');
  if (streak >= 7) tryUnlock('streak_7');
  if (streak >= 14) tryUnlock('streak_14');
  if (streak >= 30) tryUnlock('streak_30');

  const todayCal = todayEntries.reduce((s, e) => s + e.calories, 0);
  const todayProtein = todayEntries.reduce((s, e) => s + e.protein, 0);
  const todayFiber = todayEntries.reduce((s, e) => s + e.fiber, 0);

  if (todayProtein >= goals.protein) tryUnlock('protein_goal');
  if (todayCal > 0 && todayCal <= goals.calories) tryUnlock('under_goal');
  if (todayFiber >= 25) tryUnlock('fiber_champ');

  const scores = todayEntries.filter((e) => e.healthScore).map((e) => e.healthScore!);
  if (scores.length >= 2 && scores.reduce((a, b) => a + b, 0) / scores.length >= 7) tryUnlock('healthy_day');

  const uniqueFoods = new Set(entries.map((e) => e.name)).size;
  if (uniqueFoods >= 10) tryUnlock('variety_10');
  if (uniqueFoods >= 25) tryUnlock('variety_25');

  const mealTypes = new Set(todayEntries.map((e) => e.mealType));
  if (mealTypes.has('breakfast') && mealTypes.has('lunch') && mealTypes.has('dinner')) tryUnlock('all_meals');
  if (entries.some((e) => e.imageUrl)) tryUnlock('photo_first');

  return newlyUnlocked;
}

// ─── Daily Challenges ───
export interface Challenge {
  id: string;
  title: string;
  icon: string;
  progress: number;
  target: number;
  completed: boolean;
}

export function getDailyChallenges(): Challenge[] {
  const entries = getEntries();
  const today = format(new Date(), 'yyyy-MM-dd');
  const t = entries.filter((e) => e.date === today);
  const goals = getProfile().goals;

  const todayCal = t.reduce((s, e) => s + e.calories, 0);
  const todayProtein = t.reduce((s, e) => s + e.protein, 0);
  const mealTypes = new Set(t.map((e) => e.mealType));
  const healthyMeals = t.filter((e) => (e.healthScore || 0) >= 7).length;

  return [
    { id: 'log3', title: 'Log 3 meals', icon: '🍽️', progress: t.length, target: 3, completed: t.length >= 3 },
    { id: 'protein', title: `Hit ${goals.protein}g protein`, icon: '🥩', progress: todayProtein, target: goals.protein, completed: todayProtein >= goals.protein },
    { id: 'budget', title: 'Stay under calorie budget', icon: '🎯', progress: todayCal, target: goals.calories, completed: todayCal > 0 && todayCal <= goals.calories },
    { id: 'clean', title: '2 healthy meals (score 7+)', icon: '🥗', progress: healthyMeals, target: 2, completed: healthyMeals >= 2 },
    { id: 'full', title: 'Log all 3 main meals', icon: '📋', progress: (['breakfast', 'lunch', 'dinner'] as const).filter(m => mealTypes.has(m)).length, target: 3, completed: mealTypes.has('breakfast') && mealTypes.has('lunch') && mealTypes.has('dinner') },
  ];
}

// ─── Share / Weekly Recap ───
export function generateShareText(): string {
  const entries = getEntries();
  const streak = getStreak();
  const today = format(new Date(), 'yyyy-MM-dd');
  const todayEntries = entries.filter((e) => e.date === today);
  const todayCal = todayEntries.reduce((s, e) => s + e.calories, 0);
  const goals = getProfile().goals;
  const uniqueFoods = new Set(entries.map((e) => e.name)).size;
  const totalMeals = entries.length;

  return `🍽️ My NourishLog Stats\n\n🔥 ${streak}-day streak\n📊 ${todayCal}/${goals.calories} kcal today\n🥗 ${uniqueFoods} unique foods tried\n📝 ${totalMeals} meals logged\n\nTrack your food at nourishlog.vercel.app`;
}

export function generateWeeklyRecap(): string {
  const entries = getEntries();
  const goals = getProfile().goals;
  const days: { date: string; cal: number; meals: number }[] = [];

  for (let i = 6; i >= 0; i--) {
    const dateStr = format(subDays(new Date(), i), 'yyyy-MM-dd');
    const dayEntries = entries.filter((e) => e.date === dateStr);
    days.push({ date: dateStr, cal: dayEntries.reduce((s, e) => s + e.calories, 0), meals: dayEntries.length });
  }

  const totalCal = days.reduce((s, d) => s + d.cal, 0);
  const daysLogged = days.filter((d) => d.cal > 0).length;
  const avg = daysLogged > 0 ? Math.round(totalCal / daysLogged) : 0;
  const underGoalDays = days.filter((d) => d.cal > 0 && d.cal <= goals.calories).length;
  const streak = getStreak();

  return `📊 Weekly Recap\n\n📅 ${daysLogged}/7 days logged\n🔥 ${streak}-day streak\n⚡ Avg: ${avg} kcal/day\n🎯 ${underGoalDays} days under budget\n📝 ${days.reduce((s, d) => s + d.meals, 0)} meals tracked\n\nnourishlog.vercel.app`;
}
