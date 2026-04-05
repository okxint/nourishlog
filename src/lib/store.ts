'use client';

import { FoodEntry, UserProfile, DailyGoals, ChatMessage } from './types';
import { format, subDays } from 'date-fns';

const ENTRIES_KEY = 'nourishlog_entries';
const PROFILE_KEY = 'nourishlog_profile';
const CHAT_KEY = 'nourishlog_chat';
const AUTH_KEY = 'nourishlog_auth';

const defaultGoals: DailyGoals = {
  calories: 2000,
  protein: 120,
  carbs: 250,
  fat: 65,
  water: 3,
};

// Indian-focused sample data
const sampleEntries: FoodEntry[] = [
  {
    id: '1',
    name: 'Masala Dosa with Chutney',
    calories: 280,
    protein: 6,
    carbs: 42,
    fat: 10,
    fiber: 3,
    mealType: 'breakfast',
    time: '08:30',
    date: format(new Date(), 'yyyy-MM-dd'),
    imageUrl: 'https://images.unsplash.com/photo-1668236543090-82eb5eace5fc?w=400&h=300&fit=crop',
    servingSize: '1 dosa + sides',
    healthScore: 7,
    micronutrients: { vitaminA: 12, vitaminC: 18, iron: 15, calcium: 8, sodium: 380, sugar: 3 },
  },
  {
    id: '2',
    name: 'Chicken Biryani',
    calories: 490,
    protein: 22,
    carbs: 62,
    fat: 18,
    fiber: 3,
    mealType: 'lunch',
    time: '13:00',
    date: format(new Date(), 'yyyy-MM-dd'),
    imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=300&fit=crop',
    servingSize: '1 plate (300g)',
    healthScore: 6,
    micronutrients: { vitaminA: 10, vitaminC: 8, iron: 20, calcium: 6, sodium: 720, sugar: 2 },
  },
  {
    id: '3',
    name: 'Chai with Biscuits',
    calories: 145,
    protein: 3,
    carbs: 22,
    fat: 5,
    fiber: 0,
    mealType: 'snack',
    time: '16:00',
    date: format(new Date(), 'yyyy-MM-dd'),
    imageUrl: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400&h=300&fit=crop',
    servingSize: '1 cup + 2 biscuits',
    healthScore: 4,
    micronutrients: { vitaminA: 4, vitaminC: 2, iron: 5, calcium: 12, sodium: 150, sugar: 16 },
  },
];

const indianFoods = [
  { name: 'Masala Dosa', cal: 280, p: 6, c: 42, f: 10, fb: 3, meal: 'breakfast' as const },
  { name: 'Idli Sambar', cal: 195, p: 6, c: 38, f: 2, fb: 4, meal: 'breakfast' as const },
  { name: 'Poha', cal: 250, p: 5, c: 40, f: 8, fb: 2, meal: 'breakfast' as const },
  { name: 'Upma', cal: 210, p: 5, c: 32, f: 7, fb: 2, meal: 'breakfast' as const },
  { name: 'Paratha with Curd', cal: 320, p: 8, c: 38, f: 16, fb: 2, meal: 'breakfast' as const },
  { name: 'Chicken Biryani', cal: 490, p: 22, c: 62, f: 18, fb: 3, meal: 'lunch' as const },
  { name: 'Dal Rice', cal: 380, p: 14, c: 58, f: 8, fb: 8, meal: 'lunch' as const },
  { name: 'Rajma Chawal', cal: 410, p: 16, c: 64, f: 8, fb: 10, meal: 'lunch' as const },
  { name: 'Chole Bhature', cal: 520, p: 14, c: 62, f: 24, fb: 6, meal: 'lunch' as const },
  { name: 'Roti Sabzi', cal: 310, p: 10, c: 42, f: 12, fb: 5, meal: 'dinner' as const },
  { name: 'Paneer Butter Masala', cal: 380, p: 16, c: 18, f: 28, fb: 2, meal: 'dinner' as const },
  { name: 'Butter Chicken', cal: 438, p: 30, c: 12, f: 30, fb: 1, meal: 'dinner' as const },
  { name: 'Fish Curry', cal: 320, p: 28, c: 14, f: 16, fb: 2, meal: 'dinner' as const },
  { name: 'Samosa', cal: 262, p: 4, c: 28, f: 14, fb: 2, meal: 'snack' as const },
  { name: 'Vada Pav', cal: 290, p: 5, c: 38, f: 14, fb: 2, meal: 'snack' as const },
  { name: 'Chai', cal: 80, p: 2, c: 12, f: 3, fb: 0, meal: 'snack' as const },
  { name: 'Pani Puri', cal: 180, p: 3, c: 28, f: 6, fb: 2, meal: 'snack' as const },
  { name: 'Gulab Jamun', cal: 175, p: 2, c: 30, f: 6, fb: 0, meal: 'snack' as const },
];

function generateWeekData(): FoodEntry[] {
  const entries: FoodEntry[] = [];
  for (let i = 6; i >= 1; i--) {
    const date = subDays(new Date(), i);
    const dateStr = format(date, 'yyyy-MM-dd');
    const numMeals = 3 + Math.floor(Math.random() * 2);
    for (let j = 0; j < numMeals; j++) {
      const food = indianFoods[Math.floor(Math.random() * indianFoods.length)];
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
  const profile: UserProfile = {
    name,
    email,
    goals: defaultGoals,
    joinedDate: format(new Date(), 'yyyy-MM-dd'),
  };
  localStorage.setItem(AUTH_KEY, 'true');
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  // Initialize sample data
  const initial = [...generateWeekData(), ...sampleEntries];
  localStorage.setItem(ENTRIES_KEY, JSON.stringify(initial));
}

export function logout(): void {
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem(PROFILE_KEY);
  localStorage.removeItem(ENTRIES_KEY);
  localStorage.removeItem(CHAT_KEY);
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
  if (typeof window === 'undefined') {
    return { name: '', email: '', goals: defaultGoals, joinedDate: '' };
  }
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

// Nutrition lookup
export const nutritionDb: Record<string, { cal: number; p: number; c: number; f: number; fb: number; score: number }> = {
  'masala dosa': { cal: 280, p: 6, c: 42, f: 10, fb: 3, score: 7 },
  'dosa': { cal: 280, p: 6, c: 42, f: 10, fb: 3, score: 7 },
  'idli': { cal: 58, p: 2, c: 12, f: 0, fb: 1, score: 8 },
  'idli sambar': { cal: 195, p: 6, c: 38, f: 2, fb: 4, score: 8 },
  'poha': { cal: 250, p: 5, c: 40, f: 8, fb: 2, score: 7 },
  'upma': { cal: 210, p: 5, c: 32, f: 7, fb: 2, score: 7 },
  'paratha': { cal: 260, p: 6, c: 32, f: 12, fb: 2, score: 6 },
  'aloo paratha': { cal: 320, p: 8, c: 38, f: 16, fb: 2, score: 5 },
  'chicken biryani': { cal: 490, p: 22, c: 62, f: 18, fb: 3, score: 6 },
  'biryani': { cal: 490, p: 22, c: 62, f: 18, fb: 3, score: 6 },
  'veg biryani': { cal: 380, p: 10, c: 58, f: 12, fb: 4, score: 7 },
  'dal rice': { cal: 380, p: 14, c: 58, f: 8, fb: 8, score: 8 },
  'dal': { cal: 180, p: 12, c: 28, f: 2, fb: 6, score: 9 },
  'rajma chawal': { cal: 410, p: 16, c: 64, f: 8, fb: 10, score: 7 },
  'rajma': { cal: 225, p: 14, c: 38, f: 2, fb: 8, score: 8 },
  'chole bhature': { cal: 520, p: 14, c: 62, f: 24, fb: 6, score: 4 },
  'chole': { cal: 280, p: 12, c: 40, f: 8, fb: 8, score: 7 },
  'roti': { cal: 120, p: 3, c: 20, f: 3, fb: 2, score: 7 },
  'chapati': { cal: 120, p: 3, c: 20, f: 3, fb: 2, score: 7 },
  'naan': { cal: 262, p: 9, c: 45, f: 5, fb: 2, score: 5 },
  'rice': { cal: 206, p: 4, c: 45, f: 0, fb: 1, score: 6 },
  'paneer butter masala': { cal: 380, p: 16, c: 18, f: 28, fb: 2, score: 5 },
  'paneer': { cal: 265, p: 18, c: 4, f: 20, fb: 0, score: 6 },
  'palak paneer': { cal: 290, p: 16, c: 12, f: 20, fb: 4, score: 7 },
  'butter chicken': { cal: 438, p: 30, c: 12, f: 30, fb: 1, score: 5 },
  'chicken curry': { cal: 350, p: 28, c: 10, f: 22, fb: 2, score: 6 },
  'tandoori chicken': { cal: 260, p: 32, c: 6, f: 12, fb: 1, score: 8 },
  'fish curry': { cal: 320, p: 28, c: 14, f: 16, fb: 2, score: 7 },
  'egg curry': { cal: 280, p: 18, c: 12, f: 18, fb: 2, score: 7 },
  'samosa': { cal: 262, p: 4, c: 28, f: 14, fb: 2, score: 3 },
  'vada pav': { cal: 290, p: 5, c: 38, f: 14, fb: 2, score: 3 },
  'pav bhaji': { cal: 380, p: 10, c: 48, f: 16, fb: 4, score: 5 },
  'pani puri': { cal: 180, p: 3, c: 28, f: 6, fb: 2, score: 4 },
  'bhel puri': { cal: 200, p: 4, c: 30, f: 8, fb: 3, score: 5 },
  'chai': { cal: 80, p: 2, c: 12, f: 3, fb: 0, score: 5 },
  'filter coffee': { cal: 90, p: 2, c: 10, f: 4, fb: 0, score: 5 },
  'lassi': { cal: 160, p: 5, c: 24, f: 5, fb: 0, score: 6 },
  'gulab jamun': { cal: 175, p: 2, c: 30, f: 6, fb: 0, score: 2 },
  'jalebi': { cal: 150, p: 1, c: 28, f: 5, fb: 0, score: 2 },
  'rasgulla': { cal: 125, p: 3, c: 22, f: 2, fb: 0, score: 3 },
  'kheer': { cal: 200, p: 5, c: 32, f: 6, fb: 0, score: 4 },
  'uttapam': { cal: 200, p: 5, c: 30, f: 6, fb: 2, score: 7 },
  'medu vada': { cal: 180, p: 6, c: 20, f: 8, fb: 2, score: 5 },
  'pongal': { cal: 220, p: 6, c: 32, f: 8, fb: 2, score: 7 },
  'thali': { cal: 650, p: 20, c: 80, f: 28, fb: 8, score: 7 },
  'roti sabzi': { cal: 310, p: 10, c: 42, f: 12, fb: 5, score: 7 },
  'oats': { cal: 180, p: 6, c: 28, f: 4, fb: 4, score: 8 },
  'banana': { cal: 105, p: 1, c: 27, f: 0, fb: 3, score: 7 },
  'apple': { cal: 95, p: 0, c: 25, f: 0, fb: 4, score: 8 },
  'mango': { cal: 135, p: 1, c: 35, f: 0, fb: 3, score: 7 },
  'eggs': { cal: 155, p: 13, c: 1, f: 11, fb: 0, score: 8 },
  'omelette': { cal: 180, p: 14, c: 2, f: 13, fb: 0, score: 8 },
  'bread toast': { cal: 140, p: 4, c: 24, f: 3, fb: 1, score: 5 },
  'maggi': { cal: 310, p: 7, c: 42, f: 13, fb: 1, score: 3 },
  'pizza': { cal: 680, p: 28, c: 72, f: 30, fb: 3, score: 3 },
  'burger': { cal: 550, p: 25, c: 45, f: 28, fb: 2, score: 3 },
  'pasta': { cal: 450, p: 15, c: 58, f: 16, fb: 3, score: 5 },
  'sandwich': { cal: 320, p: 14, c: 36, f: 14, fb: 3, score: 6 },
  'salad': { cal: 180, p: 8, c: 14, f: 10, fb: 6, score: 9 },
  'fruit salad': { cal: 120, p: 1, c: 30, f: 0, fb: 4, score: 9 },
  'protein shake': { cal: 280, p: 30, c: 20, f: 8, fb: 2, score: 7 },
  'water': { cal: 0, p: 0, c: 0, f: 0, fb: 0, score: 10 },
  'coconut water': { cal: 46, p: 0, c: 9, f: 0, fb: 0, score: 9 },
  'buttermilk': { cal: 40, p: 3, c: 5, f: 1, fb: 0, score: 8 },
};
