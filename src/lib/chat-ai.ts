import { FoodEntry } from './types';
import { getEntriesByDate, getEntries, addEntry, getProfile, getCustomFoods, addCustomFood, CustomFood } from './store';
import { foodDatabase } from './food-db';
import { format, subDays, parseISO, isWithinInterval, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

type NutritionData = { cal: number; p: number; c: number; f: number; fb: number; score: number };

function lookupFood(name: string): NutritionData | null {
  const key = name.toLowerCase().trim();
  const custom = getCustomFoods();
  if (custom[key]) return custom[key];
  if (foodDatabase[key]) { const d = foodDatabase[key]; return { cal: d.cal, p: d.p, c: d.c, f: d.f, fb: d.fb, score: d.score }; }
  for (const [, v] of Object.entries(foodDatabase)) { if (v.aliases?.some((a) => a === key)) return { cal: v.cal, p: v.p, c: v.c, f: v.f, fb: v.fb, score: v.score }; }
  for (const [k, v] of Object.entries(foodDatabase)) { if (k.includes(key) || key.includes(k)) return { cal: v.cal, p: v.p, c: v.c, f: v.f, fb: v.fb, score: v.score }; }
  for (const [k, v] of Object.entries(custom)) { if (k.includes(key) || key.includes(k)) return v; }
  return null;
}

// ─── History Query Helpers ───

function getEntriesForRange(text: string): { entries: FoodEntry[]; label: string } {
  const all = getEntries();
  const today = new Date();
  const todayStr = format(today, 'yyyy-MM-dd');

  if (text.includes('yesterday')) {
    const d = format(subDays(today, 1), 'yyyy-MM-dd');
    return { entries: all.filter(e => e.date === d), label: 'yesterday' };
  }
  if (text.includes('today')) {
    return { entries: all.filter(e => e.date === todayStr), label: 'today' };
  }
  if (text.includes('last week') || text.includes('past week')) {
    const start = subDays(today, 7);
    return { entries: all.filter(e => new Date(e.date) >= start), label: 'last 7 days' };
  }
  if (text.includes('this week')) {
    const start = startOfWeek(today, { weekStartsOn: 1 });
    const end = endOfWeek(today, { weekStartsOn: 1 });
    return { entries: all.filter(e => isWithinInterval(parseISO(e.date), { start, end })), label: 'this week' };
  }
  if (text.includes('this month') || text.includes('last month') || text.includes('past month')) {
    const start = text.includes('last month') || text.includes('past month') ? subDays(today, 30) : startOfMonth(today);
    const end = text.includes('last month') || text.includes('past month') ? today : endOfMonth(today);
    return { entries: all.filter(e => isWithinInterval(parseISO(e.date), { start, end })), label: text.includes('last') || text.includes('past') ? 'last 30 days' : 'this month' };
  }

  // Try to parse a specific date like "april 3" or "3rd april" or "march 15"
  const dateMatch = text.match(/(\d{1,2})(?:st|nd|rd|th)?\s*(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i) ||
    text.match(/(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\w*\s*(\d{1,2})/i);
  if (dateMatch) {
    const months: Record<string, string> = { jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06', jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12' };
    let day: string, mon: string;
    if (/^\d/.test(dateMatch[1])) { day = dateMatch[1].padStart(2, '0'); mon = months[dateMatch[2].toLowerCase().slice(0, 3)]; }
    else { mon = months[dateMatch[1].toLowerCase().slice(0, 3)]; day = dateMatch[2].padStart(2, '0'); }
    const dateStr = `2026-${mon}-${day}`;
    return { entries: all.filter(e => e.date === dateStr), label: format(parseISO(dateStr), 'EEEE, d MMMM') };
  }

  // Days of week
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  for (const [i, name] of dayNames.entries()) {
    if (text.includes(name)) {
      // Find the most recent occurrence of this day
      for (let d = 0; d < 14; d++) {
        const date = subDays(today, d);
        if (date.getDay() === i) {
          const dateStr = format(date, 'yyyy-MM-dd');
          return { entries: all.filter(e => e.date === dateStr), label: `last ${name} (${format(date, 'd MMM')})` };
        }
      }
    }
  }

  return { entries: all.filter(e => e.date === todayStr), label: 'today' };
}

function formatMealList(entries: FoodEntry[]): string {
  if (entries.length === 0) return 'Nothing logged.';

  // Group by meal type
  const groups: Record<string, FoodEntry[]> = {};
  entries.forEach(e => {
    if (!groups[e.mealType]) groups[e.mealType] = [];
    groups[e.mealType].push(e);
  });

  const order = ['breakfast', 'lunch', 'dinner', 'snack'];
  const lines: string[] = [];
  for (const type of order) {
    if (!groups[type]) continue;
    lines.push(`**${type.charAt(0).toUpperCase() + type.slice(1)}:**`);
    groups[type].forEach(e => {
      lines.push(`  • ${e.name} — ${e.calories} kcal (${e.time})`);
    });
  }

  const total = entries.reduce((s, e) => s + e.calories, 0);
  lines.push(`\n**Total: ${total} kcal** across ${entries.length} items`);
  return lines.join('\n');
}

function searchHistory(query: string): string {
  const all = getEntries();
  const matches = all.filter(e => e.name.toLowerCase().includes(query));

  if (matches.length === 0) return `You've never logged anything matching "${query}".`;

  // Group by date
  const byDate: Record<string, FoodEntry[]> = {};
  matches.forEach(e => {
    if (!byDate[e.date]) byDate[e.date] = [];
    byDate[e.date].push(e);
  });

  const dates = Object.keys(byDate).sort().reverse().slice(0, 10);
  const totalTimes = matches.length;
  const totalCal = matches.reduce((s, e) => s + e.calories, 0);

  let result = `You've had "${query}" **${totalTimes} times** (${totalCal} kcal total):\n\n`;
  dates.forEach(date => {
    const entries = byDate[date];
    result += `**${format(parseISO(date), 'EEE, d MMM')}:** ${entries.map(e => `${e.name} (${e.calories} kcal, ${e.mealType})`).join(', ')}\n`;
  });

  if (Object.keys(byDate).length > 10) result += `\n...and ${Object.keys(byDate).length - 10} more days`;
  return result;
}

function getLastTimeAte(query: string): string {
  const all = getEntries().filter(e => e.name.toLowerCase().includes(query)).sort((a, b) => b.date.localeCompare(a.date) || b.time.localeCompare(a.time));
  if (all.length === 0) return `I don't see "${query}" in your history.`;
  const last = all[0];
  return `Last time you had **${last.name}**: **${format(parseISO(last.date), 'EEEE, d MMMM')}** at ${last.time} (${last.mealType}, ${last.calories} kcal).\n\nYou've had it ${all.length} time${all.length > 1 ? 's' : ''} total.`;
}

function getBreakdownByMeal(entries: FoodEntry[]): string {
  const groups: Record<string, { count: number; cal: number }> = {};
  entries.forEach(e => {
    if (!groups[e.mealType]) groups[e.mealType] = { count: 0, cal: 0 };
    groups[e.mealType].count++;
    groups[e.mealType].cal += e.calories;
  });
  return Object.entries(groups).map(([type, d]) => `${type}: ${d.count} meals, ${d.cal} kcal`).join('\n');
}

function parseCustomRecipe(text: string): { name: string; data: CustomFood } | null {
  const calMatch = text.match(/(\d+)\s*(?:cal|kcal|calories)/i);
  if (!calMatch) return null;
  const proteinMatch = text.match(/(\d+)\s*g?\s*protein/i);
  const carbsMatch = text.match(/(\d+)\s*g?\s*carbs?/i);
  const fatMatch = text.match(/(\d+)\s*g?\s*fat/i);
  const fiberMatch = text.match(/(\d+)\s*g?\s*fiber/i);
  let name = text.replace(/add recipe |add custom |create recipe |save recipe |my |is about |is /gi, '')
    .replace(/\d+\s*(?:cal|kcal|calories|g?\s*protein|g?\s*carbs?|g?\s*fat|g?\s*fiber)/gi, '').replace(/\s+/g, ' ').trim();
  if (name.length < 2) return null;
  const cal = parseInt(calMatch[1]);
  return { name, data: { cal, p: proteinMatch ? parseInt(proteinMatch[1]) : Math.round(cal * 0.1 / 4), c: carbsMatch ? parseInt(carbsMatch[1]) : Math.round(cal * 0.5 / 4), f: fatMatch ? parseInt(fatMatch[1]) : Math.round(cal * 0.3 / 9), fb: fiberMatch ? parseInt(fiberMatch[1]) : 2, score: cal < 200 ? 8 : cal < 400 ? 6 : 5 } };
}

// ─── Main processor ───

export function processMessage(text: string): { response: string; foodEntry?: FoodEntry } {
  const lower = text.toLowerCase().trim();

  // Greetings
  if (/^(hi|hello|hey|namaste|yo|sup)\b/.test(lower)) {
    const profile = getProfile();
    return { response: `Hey ${profile.name || 'there'}! What did you eat? Or ask me anything:\n\n• **"What did I eat yesterday?"**\n• **"When did I last have biryani?"**\n• **"Show me last week"**\n• **"What did I have for dinner on Monday?"**\n• **"How many times have I had dosa?"**\n• Or just tell me what you ate right now.` };
  }

  // Custom recipe
  if (lower.includes('add recipe') || lower.includes('add custom') || lower.includes('create recipe') || lower.includes('save recipe')) {
    const recipe = parseCustomRecipe(lower);
    if (recipe) {
      addCustomFood(recipe.name, recipe.data);
      return { response: `Saved **${recipe.name.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}** (${recipe.data.cal} kcal). Log it anytime by name.` };
    }
    return { response: 'To save a recipe: **"add recipe [name] [cal] cal [protein]g protein [carbs]g carbs [fat]g fat"**' };
  }

  // ─── HISTORY QUERIES ───

  // "When did I last have X" / "Last time I had X"
  if (lower.includes('last time') || lower.includes('when did i') || lower.includes('when was')) {
    const food = lower.replace(/when did i (last )?(have|eat)|last time i (had|ate)|when was the last time i (had|ate)/g, '').replace(/\?/g, '').trim();
    if (food.length >= 2) return { response: getLastTimeAte(food) };
  }

  // "How many times have I had X" / "How often do I eat X"
  if (lower.includes('how many times') || lower.includes('how often') || lower.includes('how much') && lower.includes('had')) {
    const food = lower.replace(/how many times have i (had|eaten)|how often do i (eat|have)|how much .* (had|eaten)/g, '').replace(/\?/g, '').trim();
    if (food.length >= 2) return { response: searchHistory(food) };
  }

  // "Show me [food] history" / "all my [food]"
  if ((lower.includes('history') || lower.includes('all my') || lower.includes('show me all') || lower.includes('every time')) && !lower.includes('meal history')) {
    const food = lower.replace(/show me |history of |all my |every time i (had|ate) |show |history|\?/g, '').trim();
    if (food.length >= 2) return { response: searchHistory(food) };
  }

  // "What did I eat [date/time]" / "Show me [date]" / "What did I have for [meal] [date]"
  if ((lower.includes('what did i') && (lower.includes('eat') || lower.includes('have'))) ||
      lower.includes('show me') || lower.includes('what was') ||
      (lower.includes('what') && (lower.includes('breakfast') || lower.includes('lunch') || lower.includes('dinner') || lower.includes('snack')))) {

    const { entries, label } = getEntriesForRange(lower);

    // Filter by meal type if mentioned
    let filtered = entries;
    let mealLabel = '';
    if (lower.includes('breakfast')) { filtered = entries.filter(e => e.mealType === 'breakfast'); mealLabel = ' for breakfast'; }
    else if (lower.includes('lunch')) { filtered = entries.filter(e => e.mealType === 'lunch'); mealLabel = ' for lunch'; }
    else if (lower.includes('dinner')) { filtered = entries.filter(e => e.mealType === 'dinner'); mealLabel = ' for dinner'; }
    else if (lower.includes('snack')) { filtered = entries.filter(e => e.mealType === 'snack'); mealLabel = ' as snacks'; }

    if (filtered.length === 0) return { response: `Nothing logged${mealLabel} on ${label}.` };
    return { response: `Here's what you ate${mealLabel} on **${label}**:\n\n${formatMealList(filtered)}` };
  }

  // Week/month summary
  if (lower.includes('week') || lower.includes('month')) {
    const { entries, label } = getEntriesForRange(lower);
    if (entries.length === 0) return { response: `No meals logged for ${label}.` };

    const uniqueDates = [...new Set(entries.map(e => e.date))].sort();
    const totalCal = entries.reduce((s, e) => s + e.calories, 0);
    const avg = Math.round(totalCal / uniqueDates.length);

    let result = `**${label}** — ${entries.length} meals across ${uniqueDates.length} days:\n\n`;
    uniqueDates.forEach(date => {
      const dayEntries = entries.filter(e => e.date === date);
      const dayCal = dayEntries.reduce((s, e) => s + e.calories, 0);
      const names = dayEntries.map(e => e.name).join(', ');
      result += `**${format(parseISO(date), 'EEE d')}:** ${names} — ${dayCal} kcal\n`;
    });
    result += `\n**Avg: ${avg} kcal/day** · ${getBreakdownByMeal(entries)}`;
    return { response: result };
  }

  // Most eaten
  if (lower.includes('most') && (lower.includes('eaten') || lower.includes('frequent') || lower.includes('common') || lower.includes('eat'))) {
    const all = getEntries();
    const counts: Record<string, number> = {};
    all.forEach(e => { counts[e.name] = (counts[e.name] || 0) + 1; });
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 10);
    if (sorted.length === 0) return { response: 'No data yet.' };
    return { response: `Your most eaten foods:\n\n${sorted.map(([name, count], i) => `${i + 1}. **${name}** — ${count} times`).join('\n')}` };
  }

  // Compare
  if (lower.includes(' vs ') || lower.includes(' versus ') || lower.includes('compare')) {
    const parts = lower.replace(/compare |which is better |which is healthier /g, '').split(/ vs | versus | or /);
    if (parts.length >= 2) {
      const a = lookupFood(parts[0].trim()), b = lookupFood(parts[1].trim());
      const nA = parts[0].trim().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      const nB = parts[1].trim().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      if (a && b) return { response: `**${nA}** vs **${nB}**:\n\nCalories: ${a.cal} vs ${b.cal}\nProtein: ${a.p}g vs ${b.p}g\nCarbs: ${a.c}g vs ${b.c}g\nFat: ${a.f}g vs ${b.f}g\nHealth: ${a.score}/10 vs ${b.score}/10\n\n${a.score > b.score ? nA : nB} is the healthier pick.` };
    }
  }

  // Nutrition query
  if (lower.includes('calories in') || lower.includes('nutrition') || lower.includes("what's in")) {
    const words = lower.replace(/how many calories in |calories in |nutrition of |nutrition in |whats in |what's in /g, '').trim();
    const food = lookupFood(words);
    if (food) return { response: `**${words.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}**: ${food.cal} kcal · ${food.p}g protein · ${food.c}g carbs · ${food.f}g fat · ${food.fb}g fiber · Score: ${food.score}/10` };
    return { response: `Don't have "${words}" yet. Add it: "add recipe ${words} [cal] cal [protein]g protein..."` };
  }

  // Suggest
  if (lower.includes('suggest') || lower.includes('recommend') || lower.includes('what should i eat')) {
    const todayEntries = getEntriesByDate(format(new Date(), 'yyyy-MM-dd'));
    const todayCal = todayEntries.reduce((s, e) => s + e.calories, 0);
    const remaining = getProfile().goals.calories - todayCal;
    const suggestions = remaining > 400
      ? ['Tandoori Chicken (220 kcal)', 'Dal + Roti (254 kcal)', 'Egg Bhurji + Roti (284 kcal)']
      : remaining > 150 ? ['Idli Sambar (150 kcal)', 'Fruit Salad (100 kcal)', 'Curd Rice (180 kcal)']
      : ['Buttermilk (35 kcal)', 'Coconut Water (46 kcal)', 'Banana (105 kcal)'];
    return { response: `${remaining > 0 ? remaining : 0} kcal remaining. Try:\n\n${suggestions.map(s => `• ${s}`).join('\n')}` };
  }

  // Goals
  if (lower.includes('goal') || lower.includes('target')) {
    const g = getProfile().goals;
    return { response: `Your goals: ${g.calories} kcal · ${g.protein}g protein · ${g.carbs}g carbs · ${g.fat}g fat · ${g.water}L water\n\nUpdate in Profile → Edit Goals.` };
  }

  // Help
  if (lower.includes('help') || lower === '?') {
    return { response: `**What you can ask:**\n\n📖 **"What did I eat yesterday?"**\n📖 **"What did I have for dinner on Monday?"**\n📖 **"Show me last week"**\n📖 **"When did I last have biryani?"**\n📖 **"How many times have I had dosa?"**\n📖 **"Show me all my biryani"**\n📖 **"What do I eat most?"**\n\n📝 **Log food:** "had biryani for lunch"\n📸 **Photo:** use camera button\n🍳 **Custom recipe:** "add recipe [name] [cal] cal..."\n⚖️ **Compare:** "dosa vs idli"\n🔍 **Nutrition:** "calories in samosa"` };
  }

  // Search
  if (lower.startsWith('search ') || lower.startsWith('find ')) {
    const query = lower.replace(/^(search |find )/, '').trim();
    const results: string[] = [];
    for (const k of Object.keys(foodDatabase)) { if (k.includes(query) && results.length < 8) results.push(k); }
    if (results.length === 0) return { response: `No dishes found for "${query}".` };
    return { response: `Found:\n\n${results.map(r => `• **${r.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}** — ${foodDatabase[r].cal} kcal`).join('\n')}\n\nSay the name to log it.` };
  }

  // ─── DEFAULT: Log food ───
  let foodName = lower;
  let mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack' = 'snack';
  if (lower.includes('breakfast')) { mealType = 'breakfast'; foodName = foodName.replace(/for breakfast|breakfast/g, ''); }
  else if (lower.includes('lunch')) { mealType = 'lunch'; foodName = foodName.replace(/for lunch|lunch/g, ''); }
  else if (lower.includes('dinner') || lower.includes('supper')) { mealType = 'dinner'; foodName = foodName.replace(/for dinner|for supper|dinner|supper/g, ''); }
  else if (lower.includes('snack')) { mealType = 'snack'; foodName = foodName.replace(/for snack|as a snack|snack/g, ''); }
  else { const h = new Date().getHours(); if (h < 11) mealType = 'breakfast'; else if (h < 15) mealType = 'lunch'; else if (h < 18) mealType = 'snack'; else mealType = 'dinner'; }

  foodName = foodName.replace(/^(i |i had |i ate |ate |had |just had |just ate |log |add |eating |eaten |took |drank |made )/g, '').trim();

  let qty = 1;
  const qtyMatch = foodName.match(/^(\d+)\s+(.+?)s?$/);
  if (qtyMatch) { qty = parseInt(qtyMatch[1]); foodName = qtyMatch[2]; }

  if (!foodName || foodName.length < 2) return { response: "Tell me what you ate, or ask about your food history. Type **help** for everything I can do." };

  const nutrition = lookupFood(foodName);
  const cal = (nutrition?.cal ?? (200 + Math.floor(Math.random() * 200))) * qty;
  const p = (nutrition?.p ?? Math.floor(Math.random() * 15 + 5)) * qty;
  const c = (nutrition?.c ?? Math.floor(Math.random() * 35 + 10)) * qty;
  const f = (nutrition?.f ?? Math.floor(Math.random() * 12 + 3)) * qty;
  const fb = (nutrition?.fb ?? Math.floor(Math.random() * 4 + 1)) * qty;
  const score = nutrition?.score ?? Math.floor(Math.random() * 4 + 4);
  const displayName = (qty > 1 ? `${qty}x ` : '') + foodName.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  const entry: FoodEntry = {
    id: Date.now().toString(), name: displayName, calories: cal, protein: p, carbs: c, fat: f, fiber: fb,
    mealType, time: format(new Date(), 'HH:mm'), date: format(new Date(), 'yyyy-MM-dd'),
    healthScore: score, servingSize: qty > 1 ? `${qty} servings` : '1 serving',
    micronutrients: { vitaminA: Math.floor(Math.random() * 30 + 5), vitaminC: Math.floor(Math.random() * 50 + 5), iron: Math.floor(Math.random() * 20 + 5), calcium: Math.floor(Math.random() * 25 + 5), sodium: Math.floor(Math.random() * 400 + 100), sugar: Math.floor(Math.random() * 15 + 2) },
  };
  addEntry(entry);

  return {
    response: `Logged **${displayName}** for ${mealType} ✅\n${cal} kcal · ${p}g protein · ${c}g carbs · ${f}g fat${!nutrition ? '\n\n_Estimated — tap the entry to edit exact values_' : ''}`,
    foodEntry: entry,
  };
}
