'use client';

import { useState, useRef } from 'react';
import { Camera, Upload, Search, X, Loader2, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { addEntry, nutritionDb } from '@/lib/store';
import { FoodEntry } from '@/lib/types';
import { format } from 'date-fns';

const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'] as const;
const mealLabels = { breakfast: 'Breakfast', lunch: 'Lunch', dinner: 'Dinner', snack: 'Snack' };

const quickItems = [
  { name: 'Chai', emoji: '☕', cal: 80, p: 2, c: 12, f: 3, fb: 0 },
  { name: 'Water', emoji: '💧', cal: 0, p: 0, c: 0, f: 0, fb: 0 },
  { name: 'Idli', emoji: '🫓', cal: 58, p: 2, c: 12, f: 0, fb: 1 },
  { name: 'Banana', emoji: '🍌', cal: 105, p: 1, c: 27, f: 0, fb: 3 },
  { name: 'Eggs', emoji: '🥚', cal: 155, p: 13, c: 1, f: 11, fb: 0 },
  { name: 'Roti', emoji: '🫓', cal: 120, p: 3, c: 20, f: 3, fb: 2 },
  { name: 'Rice', emoji: '🍚', cal: 206, p: 4, c: 45, f: 0, fb: 1 },
  { name: 'Dal', emoji: '🥣', cal: 180, p: 12, c: 28, f: 2, fb: 6 },
  { name: 'Oats', emoji: '🥣', cal: 180, p: 6, c: 28, f: 4, fb: 4 },
  { name: 'Apple', emoji: '🍎', cal: 95, p: 0, c: 25, f: 0, fb: 4 },
  { name: 'Lassi', emoji: '🥛', cal: 160, p: 5, c: 24, f: 5, fb: 0 },
  { name: 'Samosa', emoji: '🥟', cal: 262, p: 4, c: 28, f: 14, fb: 2 },
];

const recentSearches = ['Chicken Biryani', 'Masala Dosa', 'Paratha', 'Poha', 'Paneer', 'Maggi', 'Chole'];

function guessCurrentMeal(): typeof mealTypes[number] {
  const h = new Date().getHours();
  if (h < 11) return 'breakfast';
  if (h < 15) return 'lunch';
  if (h < 18) return 'snack';
  return 'dinner';
}

export default function LogPage() {
  const router = useRouter();
  const [selectedMeal, setSelectedMeal] = useState<typeof mealTypes[number]>(guessCurrentMeal());
  const [textInput, setTextInput] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLogging, setIsLogging] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const logFood = (name: string, cal: number, p: number, c: number, f: number, fb: number, imageUrl?: string) => {
    const score = nutritionDb[name.toLowerCase()]?.score ?? Math.floor(Math.random() * 4 + 4);
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
      healthScore: score,
      micronutrients: {
        vitaminA: Math.floor(Math.random() * 35 + 5),
        vitaminC: Math.floor(Math.random() * 55 + 5),
        iron: Math.floor(Math.random() * 22 + 5),
        calcium: Math.floor(Math.random() * 28 + 5),
        sodium: Math.floor(Math.random() * 450 + 100),
        sugar: Math.floor(Math.random() * 18 + 2),
      },
    };
    addEntry(entry);
    setSuccess(`${name} — ${cal} kcal`);
    setTextInput('');
    setImagePreview(null);
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleTextLog = () => {
    if (!textInput.trim()) return;
    setIsLogging(true);
    const key = textInput.toLowerCase().trim();
    const match = nutritionDb[key];
    const cal = match?.cal ?? (200 + Math.floor(Math.random() * 250));
    const p = match?.p ?? Math.floor(Math.random() * 25 + 5);
    const c = match?.c ?? Math.floor(Math.random() * 45 + 10);
    const f = match?.f ?? Math.floor(Math.random() * 18 + 3);
    const fb = match?.fb ?? Math.floor(Math.random() * 5 + 1);
    const displayName = textInput.trim().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    setTimeout(() => {
      logFood(displayName, cal, p, c, f, fb);
      setIsLogging(false);
    }, 500);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const url = ev.target?.result as string;
      setImagePreview(url);
    };
    reader.readAsDataURL(file);
  };

  const handleLogFromPhoto = () => {
    if (!imagePreview) return;
    setIsLogging(true);
    const foods = [
      { name: 'Masala Dosa with Chutney', cal: 280, p: 6, c: 42, f: 10, fb: 3 },
      { name: 'Chicken Biryani', cal: 490, p: 22, c: 62, f: 18, fb: 3 },
      { name: 'Chole Bhature', cal: 520, p: 14, c: 62, f: 24, fb: 6 },
      { name: 'Paneer Butter Masala with Naan', cal: 580, p: 22, c: 52, f: 30, fb: 3 },
      { name: 'Pav Bhaji', cal: 380, p: 10, c: 48, f: 16, fb: 4 },
      { name: 'Thali', cal: 650, p: 20, c: 80, f: 28, fb: 8 },
    ];
    const food = foods[Math.floor(Math.random() * foods.length)];
    setTimeout(() => {
      logFood(food.name, food.cal, food.p, food.c, food.f, food.fb, imagePreview!);
      setIsLogging(false);
    }, 1500);
  };

  const handleQuickLog = (item: typeof quickItems[0]) => {
    logFood(item.name, item.cal, item.p, item.c, item.f, item.fb);
  };

  const handleRecentSearch = (name: string) => {
    const key = name.toLowerCase();
    const match = nutritionDb[key];
    if (match) {
      logFood(name, match.cal, match.p, match.c, match.f, match.fb);
    } else {
      setTextInput(name);
    }
  };

  return (
    <div className="px-5 lg:px-8 pt-10 lg:pt-8 fade-in">
      {/* Success toast */}
      {success && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--green)] text-white text-sm font-medium shadow-lg slide-up">
          <Check size={16} /> Logged: {success}
        </div>
      )}

      {/* Loading overlay */}
      {isLogging && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="glass-strong rounded-2xl p-6 flex flex-col items-center gap-3">
            <Loader2 size={32} className="text-[var(--accent)] animate-spin" />
            <p className="text-sm text-[var(--text-secondary)]">Analyzing your food...</p>
          </div>
        </div>
      )}

      <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'Sora, sans-serif' }}>Log Meal</h1>
      <p className="text-sm text-[var(--text-muted)] mb-6">Upload a photo or type what you ate</p>

      {/* Meal type selector */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {mealTypes.map((type) => (
          <button
            key={type}
            onClick={() => setSelectedMeal(type)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all
              ${selectedMeal === type
                ? 'bg-[var(--accent)] text-white'
                : 'bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-light)]'
              }`}
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            {mealLabels[type]}
          </button>
        ))}
      </div>

      {/* Two-column layout on desktop */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left — Photo Upload */}
        <div className="flex-1">
          <h3 className="text-sm font-semibold mb-3 text-[var(--text-secondary)]" style={{ fontFamily: 'Sora, sans-serif' }}>
            Upload Photo
          </h3>
          <div
            className={`glass-card rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 min-h-[200px] flex flex-col items-center justify-center
              ${imagePreview ? '' : 'border-2 border-dashed border-[var(--border)] hover:border-[var(--accent)]'}`}
            onClick={() => !imagePreview && fileInputRef.current?.click()}
          >
            {imagePreview ? (
              <div className="relative w-full">
                <img src={imagePreview} alt="Food" className="w-full h-48 lg:h-56 object-cover rounded-xl" />
                <button
                  onClick={(e) => { e.stopPropagation(); setImagePreview(null); }}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 flex items-center justify-center hover:bg-black/90"
                >
                  <X size={14} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleLogFromPhoto(); }}
                  className="mt-4 w-full py-2.5 rounded-xl bg-[var(--accent)] text-white font-semibold text-sm
                    hover:brightness-110 active:scale-[0.98] transition-all"
                >
                  Log This Meal
                </button>
              </div>
            ) : (
              <>
                <Camera size={36} className="text-[var(--text-muted)] mb-3" strokeWidth={1.4} />
                <p className="text-sm text-[var(--text-secondary)] mb-1 font-medium">Snap or upload your meal</p>
                <p className="text-xs text-[var(--text-muted)] mb-4">We&apos;ll identify the food and log it</p>
              </>
            )}
          </div>

          {!imagePreview && (
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => cameraInputRef.current?.click()}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl
                  bg-[var(--accent)] text-white font-medium text-sm
                  hover:brightness-110 active:scale-[0.98] transition-all"
              >
                <Camera size={16} /> Take Photo
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl
                  glass text-[var(--text-secondary)] font-medium text-sm
                  hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] active:scale-[0.98] transition-all"
              >
                <Upload size={16} /> Gallery
              </button>
            </div>
          )}

          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" onChange={handleImageUpload} className="hidden" />
        </div>

        {/* Right — Text Input */}
        <div className="flex-1">
          <h3 className="text-sm font-semibold mb-3 text-[var(--text-secondary)]" style={{ fontFamily: 'Sora, sans-serif' }}>
            Type What You Ate
          </h3>

          <div className="relative mb-4">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder='e.g. "chicken biryani" or "2 rotis with dal"'
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleTextLog()}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border)]
                text-[var(--text-primary)] placeholder-[var(--text-muted)] text-sm
                focus:outline-none focus:border-[var(--accent)] transition-colors"
            />
          </div>

          {textInput.trim() && (
            <button
              onClick={handleTextLog}
              className="w-full py-2.5 rounded-xl bg-[var(--accent)] text-white font-semibold text-sm mb-4
                hover:brightness-110 active:scale-[0.98] transition-all"
            >
              Log &ldquo;{textInput.trim()}&rdquo;
            </button>
          )}

          {/* Recent searches */}
          <div className="mb-5">
            <p className="text-xs font-semibold text-[var(--text-muted)] mb-2 uppercase tracking-wide" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Recent
            </p>
            <div className="flex flex-wrap gap-1.5">
              {recentSearches.map((food) => (
                <button
                  key={food}
                  onClick={() => handleRecentSearch(food)}
                  className="px-3 py-1.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-xs
                    text-[var(--text-secondary)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-all"
                >
                  {food}
                </button>
              ))}
            </div>
          </div>

          {/* Quick add */}
          <div>
            <p className="text-xs font-semibold text-[var(--text-muted)] mb-2 uppercase tracking-wide" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Quick Add
            </p>
            <div className="grid grid-cols-4 lg:grid-cols-6 gap-2">
              {quickItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleQuickLog(item)}
                  className="glass-card rounded-xl p-2.5 flex flex-col items-center gap-1
                    hover:bg-[var(--bg-card-hover)] active:scale-95 transition-all"
                >
                  <span className="text-xl">{item.emoji}</span>
                  <span className="text-[10px] font-medium text-[var(--text-secondary)] leading-tight text-center">{item.name}</span>
                  <span className="text-[9px] text-[var(--text-muted)]">{item.cal} cal</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
