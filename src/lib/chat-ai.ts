import { FoodEntry, ChatMessage } from './types';
import { getEntriesByDate, getEntries, nutritionDb, addEntry, getProfile } from './store';
import { format, subDays } from 'date-fns';

function lookupFood(name: string): { cal: number; p: number; c: number; f: number; fb: number; score: number } | null {
  const key = name.toLowerCase().trim();
  if (nutritionDb[key]) return nutritionDb[key];
  // Partial match
  for (const [k, v] of Object.entries(nutritionDb)) {
    if (k.includes(key) || key.includes(k)) return v;
  }
  return null;
}

function getTodaySummary(): string {
  const today = format(new Date(), 'yyyy-MM-dd');
  const entries = getEntriesByDate(today);
  if (entries.length === 0) return "You haven't logged any meals today yet. Want to log something?";

  const totals = entries.reduce(
    (acc, e) => ({
      cal: acc.cal + e.calories,
      p: acc.p + e.protein,
      c: acc.c + e.carbs,
      f: acc.f + e.fat,
    }),
    { cal: 0, p: 0, c: 0, f: 0 }
  );

  const goals = getProfile().goals;
  const remaining = goals.calories - totals.cal;
  const mealList = entries.map((e) => `• ${e.name} — ${e.calories} kcal (${e.mealType})`).join('\n');

  return `Here's your today summary:\n\n${mealList}\n\n**Total: ${totals.cal} kcal** (${remaining > 0 ? remaining + ' remaining' : Math.abs(remaining) + ' over goal'})\nProtein: ${totals.p}g | Carbs: ${totals.c}g | Fat: ${totals.f}g`;
}

function getWeekSummary(): string {
  const entries = getEntries();
  const days: Record<string, { cal: number; count: number }> = {};

  for (let i = 6; i >= 0; i--) {
    const dateStr = format(subDays(new Date(), i), 'yyyy-MM-dd');
    const dayEntries = entries.filter((e) => e.date === dateStr);
    days[dateStr] = {
      cal: dayEntries.reduce((s, e) => s + e.calories, 0),
      count: dayEntries.length,
    };
  }

  const daysList = Object.entries(days)
    .map(([date, d]) => `${format(new Date(date), 'EEE, MMM d')}: ${d.cal} kcal (${d.count} meals)`)
    .join('\n');

  const totalCal = Object.values(days).reduce((s, d) => s + d.cal, 0);
  const daysWithData = Object.values(days).filter((d) => d.cal > 0).length;
  const avg = daysWithData > 0 ? Math.round(totalCal / daysWithData) : 0;

  return `Here's your week at a glance:\n\n${daysList}\n\n**Weekly average: ${avg} kcal/day**`;
}

function getMostEaten(): string {
  const entries = getEntries();
  const counts: Record<string, number> = {};
  entries.forEach((e) => { counts[e.name] = (counts[e.name] || 0) + 1; });
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5);

  if (sorted.length === 0) return "No data yet! Start logging your meals.";

  const list = sorted.map(([name, count], i) => `${i + 1}. ${name} — ${count} times`).join('\n');
  return `Your most eaten foods:\n\n${list}`;
}

export function processMessage(text: string): { response: string; foodEntry?: FoodEntry } {
  const lower = text.toLowerCase().trim();

  // Greetings
  if (/^(hi|hello|hey|namaste|yo|sup)/.test(lower)) {
    const profile = getProfile();
    return {
      response: `Hey ${profile.name || 'there'}! 🙌 How can I help you today?\n\nYou can:\n• **Log food** — just tell me what you ate\n• **Ask "what did I eat today?"**\n• **Ask "how's my week going?"**\n• **Ask about any food's nutrition**`
    };
  }

  // Today summary
  if (lower.includes('today') && (lower.includes('eat') || lower.includes('ate') || lower.includes('summary') || lower.includes('what'))) {
    return { response: getTodaySummary() };
  }

  // Week summary
  if (lower.includes('week') && (lower.includes('summary') || lower.includes('how') || lower.includes('going') || lower.includes('review'))) {
    return { response: getWeekSummary() };
  }

  // Most eaten
  if (lower.includes('most') && (lower.includes('eaten') || lower.includes('frequent') || lower.includes('common'))) {
    return { response: getMostEaten() };
  }

  // Nutrition query
  if (lower.includes('how many') || lower.includes('calories in') || lower.includes('nutrition') || lower.includes('how much')) {
    const words = lower.replace(/how many calories in |calories in |nutrition of |how much protein in |how much /g, '').trim();
    const food = lookupFood(words);
    if (food) {
      return {
        response: `**${words.charAt(0).toUpperCase() + words.slice(1)}** nutrition:\n\n🔥 ${food.cal} kcal\n🥩 Protein: ${food.p}g\n🍚 Carbs: ${food.c}g\n🧈 Fat: ${food.f}g\n🌿 Fiber: ${food.fb}g\n💚 Health Score: ${food.score}/10\n\nWant me to log this?`
      };
    }
    return { response: `I don't have exact data for "${words}" in my database. Try logging it and I'll estimate the nutrition for you!` };
  }

  // Suggestions
  if (lower.includes('suggest') || lower.includes('recommend') || lower.includes('what should i eat')) {
    const profile = getProfile();
    const todayEntries = getEntriesByDate(format(new Date(), 'yyyy-MM-dd'));
    const todayCal = todayEntries.reduce((s, e) => s + e.calories, 0);
    const remaining = profile.goals.calories - todayCal;
    const todayProtein = todayEntries.reduce((s, e) => s + e.protein, 0);

    if (remaining <= 0) {
      return { response: "You've already hit your calorie goal for today! 🎉 If you're still hungry, try something light like a fruit salad or buttermilk." };
    }

    const suggestions = [];
    if (remaining > 400 && todayProtein < profile.goals.protein * 0.7) {
      suggestions.push('**Tandoori Chicken** (260 kcal, 32g protein) — great for hitting your protein goal');
      suggestions.push('**Dal with Rice** (380 kcal, 14g protein) — balanced and filling');
    } else if (remaining > 200) {
      suggestions.push('**Idli Sambar** (195 kcal) — light and nutritious');
      suggestions.push('**Fruit Salad** (120 kcal) — refreshing and healthy');
    } else {
      suggestions.push('**Buttermilk** (40 kcal) — keeps you hydrated');
      suggestions.push('**Coconut Water** (46 kcal) — natural electrolytes');
    }

    return {
      response: `You have **${remaining} kcal** remaining today. Here are my suggestions:\n\n${suggestions.map((s) => `• ${s}`).join('\n')}`
    };
  }

  // Goal check
  if (lower.includes('goal') || lower.includes('target') || lower.includes('limit')) {
    const profile = getProfile();
    const g = profile.goals;
    return {
      response: `Your daily goals:\n\n🔥 Calories: ${g.calories} kcal\n🥩 Protein: ${g.protein}g\n🍚 Carbs: ${g.carbs}g\n🧈 Fat: ${g.fat}g\n💧 Water: ${g.water}L\n\nYou can update these in your Profile settings.`
    };
  }

  // Help
  if (lower.includes('help') || lower === '?') {
    return {
      response: `Here's what I can help with:\n\n📝 **Log food** — "I had biryani for lunch"\n📊 **Today's summary** — "What did I eat today?"\n📈 **Weekly review** — "How's my week going?"\n🍽️ **Nutrition info** — "Calories in dosa"\n💡 **Suggestions** — "What should I eat?"\n🏆 **Most eaten** — "What do I eat most?"\n🎯 **Goals** — "What are my goals?"`
    };
  }

  // Try to log food — this is the default action
  // Parse "I had/ate [food] for [meal]" or just the food name
  let foodName = lower;
  let mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack' = 'snack';

  // Extract meal type
  if (lower.includes('breakfast')) { mealType = 'breakfast'; foodName = foodName.replace(/for breakfast|breakfast/g, ''); }
  else if (lower.includes('lunch')) { mealType = 'lunch'; foodName = foodName.replace(/for lunch|lunch/g, ''); }
  else if (lower.includes('dinner')) { mealType = 'dinner'; foodName = foodName.replace(/for dinner|dinner/g, ''); }
  else if (lower.includes('snack')) { mealType = 'snack'; foodName = foodName.replace(/for snack|as a snack|snack/g, ''); }
  else {
    const hour = new Date().getHours();
    if (hour < 11) mealType = 'breakfast';
    else if (hour < 15) mealType = 'lunch';
    else if (hour < 18) mealType = 'snack';
    else mealType = 'dinner';
  }

  // Clean up
  foodName = foodName.replace(/^(i |i had |i ate |ate |had |just had |just ate |log |add |eating |eaten )/g, '').trim();
  if (!foodName || foodName.length < 2) {
    return { response: "I didn't quite catch that. Tell me what you ate, or ask me anything about your nutrition! Type **help** for all commands." };
  }

  const nutrition = lookupFood(foodName);
  const cal = nutrition?.cal ?? (200 + Math.floor(Math.random() * 250));
  const p = nutrition?.p ?? Math.floor(Math.random() * 20 + 5);
  const c = nutrition?.c ?? Math.floor(Math.random() * 40 + 10);
  const f = nutrition?.f ?? Math.floor(Math.random() * 15 + 3);
  const fb = nutrition?.fb ?? Math.floor(Math.random() * 5 + 1);
  const score = nutrition?.score ?? Math.floor(Math.random() * 4 + 4);

  const displayName = foodName.split(' ').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  const entry: FoodEntry = {
    id: Date.now().toString(),
    name: displayName,
    calories: cal,
    protein: p,
    carbs: c,
    fat: f,
    fiber: fb,
    mealType,
    time: format(new Date(), 'HH:mm'),
    date: format(new Date(), 'yyyy-MM-dd'),
    healthScore: score,
    servingSize: '1 serving',
    micronutrients: {
      vitaminA: Math.floor(Math.random() * 30 + 5),
      vitaminC: Math.floor(Math.random() * 50 + 5),
      iron: Math.floor(Math.random() * 20 + 5),
      calcium: Math.floor(Math.random() * 25 + 5),
      sodium: Math.floor(Math.random() * 400 + 100),
      sugar: Math.floor(Math.random() * 15 + 2),
    },
  };

  addEntry(entry);

  return {
    response: `Logged **${displayName}** for ${mealType}! ✅\n\n🔥 ${cal} kcal | 🥩 ${p}g protein | 🍚 ${c}g carbs | 🧈 ${f}g fat\n💚 Health Score: ${score}/10${!nutrition ? '\n\n_Estimated nutrition — adjust in meal details if needed_' : ''}`,
    foodEntry: entry,
  };
}
