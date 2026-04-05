'use client';

import { FoodEntry, UserProfile, DailyGoals, ChatMessage } from './types';
import { format, subDays } from 'date-fns';

const ENTRIES_KEY = 'nourishlog_entries';
const PROFILE_KEY = 'nourishlog_profile';
const CHAT_KEY = 'nourishlog_chat';
const AUTH_KEY = 'nourishlog_auth';
const CUSTOM_FOODS_KEY = 'nourishlog_custom_foods';

const defaultGoals: DailyGoals = {
  calories: 2000,
  protein: 120,
  carbs: 250,
  fat: 65,
  water: 3,
};

const sampleEntries: FoodEntry[] = [
  {
    id: '1', name: 'Masala Dosa with Chutney', calories: 280, protein: 6, carbs: 42, fat: 10, fiber: 3,
    mealType: 'breakfast', time: '08:30', date: format(new Date(), 'yyyy-MM-dd'),
    imageUrl: 'https://images.unsplash.com/photo-1668236543090-82eb5eace5fc?w=400&h=300&fit=crop',
    servingSize: '1 dosa + sides', healthScore: 7,
    micronutrients: { vitaminA: 12, vitaminC: 18, iron: 15, calcium: 8, sodium: 380, sugar: 3 },
  },
  {
    id: '2', name: 'Chicken Biryani', calories: 490, protein: 22, carbs: 62, fat: 18, fiber: 3,
    mealType: 'lunch', time: '13:00', date: format(new Date(), 'yyyy-MM-dd'),
    imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=300&fit=crop',
    servingSize: '1 plate (300g)', healthScore: 6,
    micronutrients: { vitaminA: 10, vitaminC: 8, iron: 20, calcium: 6, sodium: 720, sugar: 2 },
  },
  {
    id: '3', name: 'Chai with Biscuits', calories: 145, protein: 3, carbs: 22, fat: 5, fiber: 0,
    mealType: 'snack', time: '16:00', date: format(new Date(), 'yyyy-MM-dd'),
    imageUrl: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400&h=300&fit=crop',
    servingSize: '1 cup + 2 biscuits', healthScore: 4,
    micronutrients: { vitaminA: 4, vitaminC: 2, iron: 5, calcium: 12, sodium: 150, sugar: 16 },
  },
];

const sampleFoodsForHistory = [
  { name: 'Masala Dosa', cal: 280, p: 6, c: 42, f: 10, fb: 3, meal: 'breakfast' as const },
  { name: 'Idli Sambar', cal: 195, p: 6, c: 38, f: 2, fb: 4, meal: 'breakfast' as const },
  { name: 'Poha', cal: 250, p: 5, c: 40, f: 8, fb: 2, meal: 'breakfast' as const },
  { name: 'Aloo Paratha', cal: 320, p: 8, c: 38, f: 16, fb: 2, meal: 'breakfast' as const },
  { name: 'Chicken Biryani', cal: 490, p: 22, c: 62, f: 18, fb: 3, meal: 'lunch' as const },
  { name: 'Dal Rice', cal: 380, p: 14, c: 58, f: 8, fb: 8, meal: 'lunch' as const },
  { name: 'Rajma Chawal', cal: 410, p: 16, c: 64, f: 8, fb: 10, meal: 'lunch' as const },
  { name: 'Chole Bhature', cal: 520, p: 14, c: 62, f: 24, fb: 6, meal: 'lunch' as const },
  { name: 'Roti Sabzi', cal: 310, p: 10, c: 42, f: 12, fb: 5, meal: 'dinner' as const },
  { name: 'Paneer Butter Masala', cal: 380, p: 16, c: 18, f: 28, fb: 2, meal: 'dinner' as const },
  { name: 'Butter Chicken', cal: 438, p: 30, c: 12, f: 30, fb: 1, meal: 'dinner' as const },
  { name: 'Fish Curry', cal: 320, p: 28, c: 14, f: 16, fb: 2, meal: 'dinner' as const },
  { name: 'Samosa', cal: 262, p: 4, c: 28, f: 14, fb: 2, meal: 'snack' as const },
  { name: 'Chai', cal: 80, p: 2, c: 12, f: 3, fb: 0, meal: 'snack' as const },
  { name: 'Vada Pav', cal: 290, p: 5, c: 38, f: 14, fb: 2, meal: 'snack' as const },
];

function generateWeekData(): FoodEntry[] {
  const entries: FoodEntry[] = [];
  for (let i = 6; i >= 1; i--) {
    const date = subDays(new Date(), i);
    const dateStr = format(date, 'yyyy-MM-dd');
    const numMeals = 3 + Math.floor(Math.random() * 2);
    for (let j = 0; j < numMeals; j++) {
      const food = sampleFoodsForHistory[Math.floor(Math.random() * sampleFoodsForHistory.length)];
      entries.push({
        id: `hist-${i}-${j}`,
        name: food.name,
        calories: food.cal + Math.floor(Math.random() * 60 - 30),
        protein: food.p, carbs: food.c, fat: food.f, fiber: food.fb,
        mealType: food.meal,
        time: `${8 + j * 4}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
        date: dateStr,
        healthScore: Math.floor(Math.random() * 4 + 5),
      });
    }
  }
  return entries;
}

// Auth
export function isLoggedIn(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(AUTH_KEY) !== null;
}

export function login(name: string, email: string): void {
  const profile: UserProfile = { name, email, goals: defaultGoals, joinedDate: format(new Date(), 'yyyy-MM-dd') };
  localStorage.setItem(AUTH_KEY, 'true');
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  localStorage.setItem(ENTRIES_KEY, JSON.stringify([...generateWeekData(), ...sampleEntries]));
}

export function logout(): void {
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem(PROFILE_KEY);
  localStorage.removeItem(ENTRIES_KEY);
  localStorage.removeItem(CHAT_KEY);
  localStorage.removeItem(CUSTOM_FOODS_KEY);
}

// Entries
export function getEntries(): FoodEntry[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(ENTRIES_KEY);
  if (!stored) return [];
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

// Profile
export function getProfile(): UserProfile {
  if (typeof window === 'undefined') return { name: '', email: '', goals: defaultGoals, joinedDate: '' };
  const stored = localStorage.getItem(PROFILE_KEY);
  if (!stored) return { name: '', email: '', goals: defaultGoals, joinedDate: '' };
  return JSON.parse(stored);
}

export function updateGoals(goals: DailyGoals): void {
  const profile = getProfile();
  profile.goals = goals;
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

// Chat
export function getChatMessages(): ChatMessage[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(CHAT_KEY);
  if (!stored) return [];
  return JSON.parse(stored);
}

export function saveChatMessages(messages: ChatMessage[]): void {
  localStorage.setItem(CHAT_KEY, JSON.stringify(messages));
}

// Custom foods (user-added recipes)
export type CustomFood = { cal: number; p: number; c: number; f: number; fb: number; score: number };

export function getCustomFoods(): Record<string, CustomFood> {
  if (typeof window === 'undefined') return {};
  const stored = localStorage.getItem(CUSTOM_FOODS_KEY);
  if (!stored) return {};
  return JSON.parse(stored);
}

export function addCustomFood(name: string, data: CustomFood): void {
  const foods = getCustomFoods();
  foods[name.toLowerCase()] = data;
  localStorage.setItem(CUSTOM_FOODS_KEY, JSON.stringify(foods));
}
