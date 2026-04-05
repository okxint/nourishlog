'use client';

import { FoodEntry, UserProfile, DailyGoals } from './types';
import { format } from 'date-fns';

const ENTRIES_KEY = 'nourishlog_entries';
const PROFILE_KEY = 'nourishlog_profile';

const defaultGoals: DailyGoals = {
  calories: 2200,
  protein: 150,
  carbs: 250,
  fat: 70,
  water: 2.5,
};

const defaultProfile: UserProfile = {
  name: 'Ashwin',
  email: 'cashmein.eth@gmail.com',
  goals: defaultGoals,
  joinedDate: '2026-03-01',
};

// Sample data for demo
const sampleEntries: FoodEntry[] = [
  {
    id: '1',
    name: 'Oatmeal with Berries',
    calories: 320,
    protein: 12,
    carbs: 52,
    fat: 8,
    fiber: 6,
    mealType: 'breakfast',
    time: '08:30',
    date: format(new Date(), 'yyyy-MM-dd'),
    imageUrl: 'https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=200&h=200&fit=crop',
    servingSize: '1 bowl (300g)',
    micronutrients: { vitaminA: 15, vitaminC: 22, iron: 20, calcium: 10, sodium: 120, sugar: 12 },
  },
  {
    id: '2',
    name: 'Grilled Chicken Salad',
    calories: 520,
    protein: 42,
    carbs: 28,
    fat: 24,
    fiber: 8,
    mealType: 'lunch',
    time: '12:45',
    date: format(new Date(), 'yyyy-MM-dd'),
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop',
    servingSize: '1 plate (350g)',
    micronutrients: { vitaminA: 45, vitaminC: 62, iron: 18, calcium: 12, sodium: 580, sugar: 4 },
  },
  {
    id: '3',
    name: 'Greek Yogurt & Almonds',
    calories: 400,
    protein: 14,
    carbs: 62,
    fat: 6,
    fiber: 2,
    mealType: 'snack',
    time: '15:00',
    date: format(new Date(), 'yyyy-MM-dd'),
    imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=200&h=200&fit=crop',
    servingSize: '1 cup (200g)',
    micronutrients: { vitaminA: 8, vitaminC: 5, iron: 6, calcium: 25, sodium: 80, sugar: 18 },
  },
];

// Generate past week data for dashboard
function generateWeekData(): FoodEntry[] {
  const entries: FoodEntry[] = [];
  const foods = [
    { name: 'Oatmeal', cal: 320, p: 12, c: 52, f: 8, fb: 6, meal: 'breakfast' as const },
    { name: 'Chicken Breast', cal: 450, p: 45, c: 5, f: 18, fb: 0, meal: 'lunch' as const },
    { name: 'Rice & Curry', cal: 620, p: 22, c: 78, f: 18, fb: 4, meal: 'dinner' as const },
    { name: 'Protein Shake', cal: 280, p: 30, c: 20, f: 8, fb: 2, meal: 'snack' as const },
    { name: 'Salad Bowl', cal: 380, p: 28, c: 32, f: 14, fb: 8, meal: 'lunch' as const },
    { name: 'Eggs & Toast', cal: 350, p: 22, c: 28, f: 16, fb: 2, meal: 'breakfast' as const },
    { name: 'Pasta', cal: 550, p: 18, c: 72, f: 16, fb: 4, meal: 'dinner' as const },
    { name: 'Banana', cal: 105, p: 1, c: 27, f: 0, fb: 3, meal: 'snack' as const },
  ];

  for (let i = 6; i >= 1; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = format(date, 'yyyy-MM-dd');
    const numMeals = 3 + Math.floor(Math.random() * 2);
    for (let j = 0; j < numMeals; j++) {
      const food = foods[Math.floor(Math.random() * foods.length)];
      entries.push({
        id: `hist-${i}-${j}`,
        name: food.name,
        calories: food.cal + Math.floor(Math.random() * 60 - 30),
        protein: food.p,
        carbs: food.c,
        fat: food.f,
        fiber: food.fb,
        mealType: food.meal,
        time: `${8 + j * 4}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
        date: dateStr,
      });
    }
  }
  return entries;
}

export function getEntries(): FoodEntry[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(ENTRIES_KEY);
  if (!stored) {
    const initial = [...generateWeekData(), ...sampleEntries];
    localStorage.setItem(ENTRIES_KEY, JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(stored);
}

export function addEntry(entry: FoodEntry): void {
  const entries = getEntries();
  entries.push(entry);
  localStorage.setItem(ENTRIES_KEY, JSON.stringify(entries));
}

export function deleteEntry(id: string): void {
  const entries = getEntries().filter((e) => e.id !== id);
  localStorage.setItem(ENTRIES_KEY, JSON.stringify(entries));
}

export function getEntriesByDate(date: string): FoodEntry[] {
  return getEntries().filter((e) => e.date === date);
}

export function getProfile(): UserProfile {
  if (typeof window === 'undefined') return defaultProfile;
  const stored = localStorage.getItem(PROFILE_KEY);
  if (!stored) {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(defaultProfile));
    return defaultProfile;
  }
  return JSON.parse(stored);
}

export function updateProfile(profile: UserProfile): void {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function updateGoals(goals: DailyGoals): void {
  const profile = getProfile();
  profile.goals = goals;
  updateProfile(profile);
}
