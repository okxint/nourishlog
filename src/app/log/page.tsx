'use client';

import { useState, useRef } from 'react';
import { Camera, Upload, Search, X, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { addEntry } from '@/lib/store';
import { FoodEntry } from '@/lib/types';
import { format } from 'date-fns';

const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'] as const;
const mealLabels = { breakfast: 'Breakfast', lunch: 'Lunch', dinner: 'Dinner', snack: 'Snack' };

const recentFoods = ['Oatmeal', 'Chicken Breast', 'Rice', 'Banana', 'Coffee', 'Eggs', 'Salad'];

const quickAddItems = [
  { name: 'Water', emoji: '💧', cal: 0, p: 0, c: 0, f: 0, fb: 0 },
  { name: 'Coffee', emoji: '☕', cal: 5, p: 0, c: 1, f: 0, fb: 0 },
  { name: 'Rice', emoji: '🍚', cal: 206, p: 4, c: 45, f: 0, fb: 1 },
  { name: 'Eggs (2)', emoji: '🥚', cal: 155, p: 13, c: 1, f: 11, fb: 0 },
  { name: 'Bread', emoji: '🍞', cal: 79, p: 3, c: 15, f: 1, fb: 1 },
  { name: 'Apple', emoji: '🍎', cal: 95, p: 0, c: 25, f: 0, fb: 4 },
  { name: 'Banana', emoji: '🍌', cal: 105, p: 1, c: 27, f: 0, fb: 3 },
  { name: 'Chicken', emoji: '🍗', cal: 335, p: 38, c: 0, f: 18, fb: 0 },
];

// Nutrition lookup for text-based logging
const nutritionDb: Record<string, { cal: number; p: number; c: number; f: number; fb: number }> = {
  oatmeal: { cal: 320, p: 12, c: 52, f: 8, fb: 6 },
  'chicken breast': { cal: 335, p: 38, c: 0, f: 18, fb: 0 },
  chicken: { cal: 335, p: 38, c: 0, f: 18, fb: 0 },
  rice: { cal: 206, p: 4, c: 45, f: 0, fb: 1 },
  banana: { cal: 105, p: 1, c: 27, f: 0, fb: 3 },
  coffee: { cal: 5, p: 0, c: 1, f: 0, fb: 0 },
  eggs: { cal: 155, p: 13, c: 1, f: 11, fb: 0 },
  salad: { cal: 180, p: 8, c: 14, f: 10, fb: 4 },
  pasta: { cal: 550, p: 18, c: 72, f: 16, fb: 4 },
  sandwich: { cal: 420, p: 22, c: 48, f: 14, fb: 3 },
  pizza: { cal: 680, p: 28, c: 72, f: 30, fb: 3 },
  burger: { cal: 750, p: 35, c: 52, f: 42, fb: 2 },
  steak: { cal: 520, p: 50, c: 0, f: 34, fb: 0 },
  salmon: { cal: 412, p: 40, c: 0, f: 28, fb: 0 },
  yogurt: { cal: 150, p: 12, c: 18, f: 4, fb: 0 },
  apple: { cal: 95, p: 0, c: 25, f: 0, fb: 4 },
  bread: { cal: 79, p: 3, c: 15, f: 1, fb: 1 },
  milk: { cal: 149, p: 8, c: 12, f: 8, fb: 0 },
  orange: { cal: 62, p: 1, c: 15, f: 0, fb: 3 },
  'protein shake': { cal: 280, p: 30, c: 20, f: 8, fb: 2 },
  dosa: { cal: 168, p: 4, c: 28, f: 4, fb: 1 },
  idli: { cal: 58, p: 2, c: 12, f: 0, fb: 1 },
  biryani: { cal: 490, p: 18, c: 62, f: 18, fb: 2 },
  roti: { cal: 120, p: 3, c: 20, f: 3, fb: 2 },
  dal: { cal: 180, p: 12, c: 28, f: 2, fb: 6 },
  paneer: { cal: 265, p: 18, c: 4, f: 20, fb: 0 },
  'butter chicken': { cal: 438, p: 30, c: 12, f: 30, fb: 1 },
  naan: { cal: 262, p: 9, c: 45, f: 5, fb: 2 },
};

export default function LogPage() {
  const router = useRouter();
  const [selectedMeal, setSelectedMeal] = useState<typeof mealTypes[number]>('lunch');
  const [textInput, setTextInput] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLogging, setIsLogging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const logFood = (name: string, cal: number, p: number, c: number, f: number, fb: number, imageUrl?: string) => {
    const entry: FoodEntry = {
      id: Date.now().toString(),
      name,
      calories: cal,
      protein: p,
      carbs: c,
      fat: f,
      fiber: fb,
      mealType: selectedMeal,
      time: format(new Date(), 'HH:mm'),
      date: format(new Date(), 'yyyy-MM-dd'),
      imageUrl,
      servingSize: '1 serving',
      micronutrients: {
        vitaminA: Math.floor(Math.random() * 40 + 5),
        vitaminC: Math.floor(Math.random() * 60 + 5),
        iron: Math.floor(Math.random() * 25 + 5),
        calcium: Math.floor(Math.random() * 30 + 5),
        sodium: Math.floor(Math.random() * 500 + 100),
        sugar: Math.floor(Math.random() * 20 + 2),
      },
    };
    addEntry(entry);
    router.push('/');
  };

  const handleTextLog = () => {
    if (!textInput.trim()) return;
    setIsLogging(true);
    const key = textInput.toLowerCase().trim();
    const match = nutritionDb[key] || { cal: 200 + Math.floor(Math.random() * 300), p: Math.floor(Math.random() * 30 + 5), c: Math.floor(Math.random() * 50 + 10), f: Math.floor(Math.random() * 20 + 3), fb: Math.floor(Math.random() * 6 + 1) };
    setTimeout(() => {
      logFood(textInput.trim(), match.cal, match.p, match.c, match.f, match.fb);
      setIsLogging(false);
    }, 600);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const url = ev.target?.result as string;
      setImagePreview(url);
      // Simulate AI recognition
      setIsLogging(true);
      setTimeout(() => {
        const foods = ['Grilled Chicken Bowl', 'Pasta Carbonara', 'Veggie Wrap', 'Salmon & Rice', 'Caesar Salad'];
        const name = foods[Math.floor(Math.random() * foods.length)];
        logFood(name, 400 + Math.floor(Math.random() * 300), 20 + Math.floor(Math.random() * 30), 30 + Math.floor(Math.random() * 40), 10 + Math.floor(Math.random() * 20), Math.floor(Math.random() * 8 + 2), url);
        setIsLogging(false);
      }, 1500);
    };
    reader.readAsDataURL(file);
  };

  const handleRecentFood = (name: string) => {
    setTextInput(name);
    const key = name.toLowerCase();
    const match = nutritionDb[key];
    if (match) {
      setIsLogging(true);
      setTimeout(() => {
        logFood(name, match.cal, match.p, match.c, match.f, match.fb);
        setIsLogging(false);
      }, 400);
    }
  };

  return (
    <div className="px-5 pt-12 fade-in">
      <h1 className="text-2xl font-bold mb-5" style={{ fontFamily: 'Sora, sans-serif' }}>
        Log Meal
      </h1>

      {/* Meal Type Selector */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {mealTypes.map((type) => (
          <button
            key={type}
            onClick={() => setSelectedMeal(type)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
              selectedMeal === type
                ? 'bg-[var(--green)] text-[var(--bg-primary)]'
                : 'glass-card text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            {mealLabels[type]}
          </button>
        ))}
      </div>

      {/* Loading Overlay */}
      {isLogging && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="glass-card rounded-2xl p-8 flex flex-col items-center gap-3">
            <Loader2 size={40} className="text-[var(--green)] animate-spin" />
            <p className="text-sm text-[var(--text-secondary)]">Analyzing your food...</p>
          </div>
        </div>
      )}

      {/* Photo Upload Area */}
      <div
        className="glass-card rounded-2xl p-6 mb-4 border-2 border-dashed border-[var(--border)]
          hover:border-[var(--green)] transition-colors duration-200 cursor-pointer text-center"
        onClick={() => fileInputRef.current?.click()}
      >
        {imagePreview ? (
          <div className="relative">
            <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-xl" />
            <button
              onClick={(e) => { e.stopPropagation(); setImagePreview(null); }}
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 flex items-center justify-center"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <>
            <Camera size={40} className="mx-auto text-[var(--text-muted)] mb-3" strokeWidth={1.5} />
            <p className="text-sm text-[var(--text-secondary)] mb-1">Snap or upload your meal</p>
            <p className="text-xs text-[var(--text-muted)]">We&apos;ll identify it and get the nutrition info</p>
          </>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>

      <div className="flex gap-2.5 mb-6">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl
            bg-[var(--green)] text-[var(--bg-primary)] font-medium text-sm
            hover:brightness-110 active:scale-[0.98] transition-all"
        >
          <Camera size={18} /> Take Photo
        </button>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl
            glass-card text-[var(--text-secondary)] font-medium text-sm
            hover:text-[var(--text-primary)] active:scale-[0.98] transition-all"
        >
          <Upload size={18} /> Gallery
        </button>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-px bg-[var(--border)]" />
        <span className="text-xs text-[var(--text-muted)] font-medium">OR</span>
        <div className="flex-1 h-px bg-[var(--border)]" />
      </div>

      {/* Text Input */}
      <div className="relative mb-5">
        <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
        <input
          type="text"
          placeholder="Type what you ate..."
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleTextLog()}
          className="w-full pl-10 pr-4 py-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border)]
            text-[var(--text-primary)] placeholder-[var(--text-muted)] text-sm
            focus:outline-none focus:border-[var(--green)] transition-colors"
        />
      </div>

      {/* Recent Foods */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold mb-2.5 text-[var(--text-secondary)]" style={{ fontFamily: 'Sora, sans-serif' }}>
          Recent Foods
        </h3>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {recentFoods.map((food) => (
            <button
              key={food}
              onClick={() => handleRecentFood(food)}
              className="px-3.5 py-1.5 rounded-full glass-card text-xs font-medium
                text-[var(--text-secondary)] hover:text-[var(--green)] hover:border-[var(--green)]
                transition-colors whitespace-nowrap"
            >
              {food}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Add Grid */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold mb-2.5 text-[var(--text-secondary)]" style={{ fontFamily: 'Sora, sans-serif' }}>
          Quick Add
        </h3>
        <div className="grid grid-cols-4 gap-2.5">
          {quickAddItems.map((item) => (
            <button
              key={item.name}
              onClick={() => logFood(item.name, item.cal, item.p, item.c, item.f, item.fb)}
              className="glass-card rounded-xl p-3 flex flex-col items-center gap-1.5
                hover:bg-[var(--bg-card-hover)] active:scale-95 transition-all duration-200"
            >
              <span className="text-2xl">{item.emoji}</span>
              <span className="text-[10px] font-medium text-[var(--text-secondary)]">{item.name}</span>
              <span className="text-[9px] text-[var(--text-muted)]">{item.cal} cal</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
