import { FoodEntry, ChatMessage } from './types';
import { getEntriesByDate, getEntries, addEntry, getProfile, getCustomFoods, addCustomFood, CustomFood } from './store';
import { foodDatabase } from './food-db';
import { format, subDays } from 'date-fns';

type NutritionData = { cal: number; p: number; c: number; f: number; fb: number; score: number };

function lookupFood(name: string): NutritionData | null {
  const key = name.toLowerCase().trim();

  // 1. Check custom foods first
  const custom = getCustomFoods();
  if (custom[key]) return custom[key];

  // 2. Check main database (exact)
  if (foodDatabase[key]) {
    const d = foodDatabase[key];
    return { cal: d.cal, p: d.p, c: d.c, f: d.f, fb: d.fb, score: d.score };
  }

  // 3. Check aliases
  for (const [, v] of Object.entries(foodDatabase)) {
    if (v.aliases?.some((a) => a === key)) {
      return { cal: v.cal, p: v.p, c: v.c, f: v.f, fb: v.fb, score: v.score };
    }
  }

  // 4. Partial match
  for (const [k, v] of Object.entries(foodDatabase)) {
    if (k.includes(key) || key.includes(k)) {
      return { cal: v.cal, p: v.p, c: v.c, f: v.f, fb: v.fb, score: v.score };
    }
  }

  // 5. Check custom partial
  for (const [k, v] of Object.entries(custom)) {
    if (k.includes(key) || key.includes(k)) return v;
  }

  return null;
}

function searchFoods(query: string): string[] {
  const key = query.toLowerCase().trim();
  const results: string[] = [];
  for (const k of Object.keys(foodDatabase)) {
    if (k.includes(key)) results.push(k);
    if (results.length >= 8) break;
  }
  return results;
}

function getTodaySummary(): string {
  const today = format(new Date(), 'yyyy-MM-dd');
  const entries = getEntriesByDate(today);
  if (entries.length === 0) return "You haven't logged any meals today. Tell me what you ate or upload a photo!";

  const totals = entries.reduce(
    (acc, e) => ({ cal: acc.cal + e.calories, p: acc.p + e.protein, c: acc.c + e.carbs, f: acc.f + e.fat, fb: acc.fb + e.fiber }),
    { cal: 0, p: 0, c: 0, f: 0, fb: 0 }
  );

  const goals = getProfile().goals;
  const remaining = goals.calories - totals.cal;
  const mealList = entries.map((e) => `• ${e.name} — ${e.calories} kcal (${e.mealType})`).join('\n');

  const proteinPct = Math.round((totals.p / goals.protein) * 100);
  const carbsPct = Math.round((totals.c / goals.carbs) * 100);
  const fatPct = Math.round((totals.f / goals.fat) * 100);

  return `Today so far (${entries.length} meals):\n\n${mealList}\n\n**${totals.cal} kcal** consumed (${remaining > 0 ? remaining + ' left' : Math.abs(remaining) + ' over'})\n\nMacros:\n• Protein: ${totals.p}g (${proteinPct}% of goal)\n• Carbs: ${totals.c}g (${carbsPct}% of goal)\n• Fat: ${totals.f}g (${fatPct}% of goal)\n• Fiber: ${totals.fb}g`;
}

function getWeekSummary(): string {
  const entries = getEntries();
  const days: Record<string, { cal: number; count: number; p: number }> = {};

  for (let i = 6; i >= 0; i--) {
    const dateStr = format(subDays(new Date(), i), 'yyyy-MM-dd');
    const dayEntries = entries.filter((e) => e.date === dateStr);
    days[dateStr] = {
      cal: dayEntries.reduce((s, e) => s + e.calories, 0),
      count: dayEntries.length,
      p: dayEntries.reduce((s, e) => s + e.protein, 0),
    };
  }

  const daysList = Object.entries(days)
    .map(([date, d]) => `${format(new Date(date), 'EEE d')}: ${d.cal || '—'} kcal ${d.count ? `(${d.count} meals)` : '(no data)'}`)
    .join('\n');

  const withData = Object.values(days).filter((d) => d.cal > 0);
  const totalCal = withData.reduce((s, d) => s + d.cal, 0);
  const avgCal = withData.length > 0 ? Math.round(totalCal / withData.length) : 0;
  const avgProtein = withData.length > 0 ? Math.round(withData.reduce((s, d) => s + d.p, 0) / withData.length) : 0;
  const goals = getProfile().goals;

  let insight = '';
  if (avgCal > goals.calories * 1.1) insight = '\n\n⚠️ You\'re averaging above your calorie goal. Consider lighter meals or cutting snacks.';
  else if (avgCal < goals.calories * 0.8) insight = '\n\n⚠️ You\'re eating below your goal. Make sure you\'re getting enough nutrition.';
  else insight = '\n\n✅ You\'re staying close to your goal. Keep it up!';

  return `Your week:\n\n${daysList}\n\n**Avg: ${avgCal} kcal/day** | Avg protein: ${avgProtein}g/day${insight}`;
}

function getAnalysis(): string {
  const entries = getEntries();
  if (entries.length < 5) return "Not enough data for analysis yet. Keep logging for a few days!";

  const weekEntries = entries.filter((e) => {
    const diff = (new Date().getTime() - new Date(e.date).getTime()) / (1000 * 60 * 60 * 24);
    return diff <= 7;
  });

  const totalP = weekEntries.reduce((s, e) => s + e.protein, 0);
  const totalC = weekEntries.reduce((s, e) => s + e.carbs, 0);
  const totalF = weekEntries.reduce((s, e) => s + e.fat, 0);
  const totalFb = weekEntries.reduce((s, e) => s + e.fiber, 0);
  const totalCal = weekEntries.reduce((s, e) => s + e.calories, 0);
  const daysCount = new Set(weekEntries.map((e) => e.date)).size || 1;

  const avgP = Math.round(totalP / daysCount);
  const avgC = Math.round(totalC / daysCount);
  const avgF = Math.round(totalF / daysCount);
  const avgFb = Math.round(totalFb / daysCount);
  const avgCal = Math.round(totalCal / daysCount);

  // Macro split
  const totalMacro = totalP + totalC + totalF || 1;
  const pPct = Math.round((totalP / totalMacro) * 100);
  const cPct = Math.round((totalC / totalMacro) * 100);
  const fPct = Math.round((totalF / totalMacro) * 100);

  // Find patterns
  const scores = weekEntries.filter((e) => e.healthScore).map((e) => e.healthScore!);
  const avgScore = scores.length > 0 ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : 'N/A';

  const insights: string[] = [];
  if (avgP < 50) insights.push('🥩 **Low protein** — add more dal, paneer, chicken, or eggs');
  if (avgFb < 15) insights.push('🌿 **Low fiber** — eat more dal, vegetables, fruits, and whole grains');
  if (fPct > 35) insights.push('🧈 **High fat ratio** — try grilled/steamed options over fried');
  if (cPct > 55) insights.push('🍚 **Carb-heavy diet** — balance with more protein sources');
  if (avgCal > 2500) insights.push('🔥 **High calorie intake** — watch portion sizes');

  return `**Weekly Nutrition Analysis**\n\nDaily averages:\n• Calories: ${avgCal} kcal\n• Protein: ${avgP}g | Carbs: ${avgC}g | Fat: ${avgF}g | Fiber: ${avgFb}g\n\nMacro split: ${pPct}% protein, ${cPct}% carbs, ${fPct}% fat\nAvg health score: ${avgScore}/10\n\n${insights.length > 0 ? '**Areas to improve:**\n' + insights.join('\n') : '**Looking good!** Your nutrition balance is solid.'}`;
}

function getMostEaten(): string {
  const entries = getEntries();
  const counts: Record<string, number> = {};
  entries.forEach((e) => { counts[e.name] = (counts[e.name] || 0) + 1; });
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 8);
  if (sorted.length === 0) return "No data yet. Start logging!";
  return `Your top foods:\n\n${sorted.map(([name, count], i) => `${i + 1}. ${name} — ${count}x`).join('\n')}`;
}

function parseCustomRecipe(text: string): { name: string; data: CustomFood } | null {
  // Parse patterns like "add recipe paneer wrap 350 cal 20g protein 30g carbs 15g fat"
  // or "my morning smoothie is about 250 calories 15g protein 30g carbs 8g fat"
  const calMatch = text.match(/(\d+)\s*(?:cal|kcal|calories)/i);
  const proteinMatch = text.match(/(\d+)\s*g?\s*protein/i);
  const carbsMatch = text.match(/(\d+)\s*g?\s*carbs?/i);
  const fatMatch = text.match(/(\d+)\s*g?\s*fat/i);
  const fiberMatch = text.match(/(\d+)\s*g?\s*fiber/i);

  if (!calMatch) return null;

  // Extract name — remove the nutrition parts
  let name = text
    .replace(/add recipe |add custom |create recipe |save recipe |my |is about |is /gi, '')
    .replace(/\d+\s*(?:cal|kcal|calories|g?\s*protein|g?\s*carbs?|g?\s*fat|g?\s*fiber)/gi, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (name.length < 2) return null;

  const cal = parseInt(calMatch[1]);
  const p = proteinMatch ? parseInt(proteinMatch[1]) : Math.round(cal * 0.1 / 4);
  const c = carbsMatch ? parseInt(carbsMatch[1]) : Math.round(cal * 0.5 / 4);
  const f = fatMatch ? parseInt(fatMatch[1]) : Math.round(cal * 0.3 / 9);
  const fb = fiberMatch ? parseInt(fiberMatch[1]) : 2;
  const score = cal < 200 ? 8 : cal < 400 ? 6 : cal < 600 ? 5 : 4;

  return { name, data: { cal, p, c, f, fb, score } };
}

export function processMessage(text: string): { response: string; foodEntry?: FoodEntry } {
  const lower = text.toLowerCase().trim();

  // Greetings
  if (/^(hi|hello|hey|namaste|yo|sup)\b/.test(lower)) {
    const profile = getProfile();
    return {
      response: `Hey ${profile.name || 'there'}! How can I help?\n\n• **Log food** — "I had dosa for breakfast"\n• **Upload a photo** — use the camera button\n• **Check your day** — "what did I eat today?"\n• **Get analysis** — "analyze my nutrition"\n• **Add custom recipe** — "add recipe protein bowl 400 cal 30g protein 40g carbs 12g fat"`
    };
  }

  // Custom recipe / add dish
  if (lower.includes('add recipe') || lower.includes('add custom') || lower.includes('create recipe') || lower.includes('save recipe') ||
      (lower.includes('add') && lower.includes('dish')) || (lower.includes('save') && lower.includes('dish'))) {
    const recipe = parseCustomRecipe(lower);
    if (recipe) {
      addCustomFood(recipe.name, recipe.data);
      const d = recipe.data;
      return {
        response: `Saved custom recipe **${recipe.name.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}**! 🍳\n\n🔥 ${d.cal} kcal | 🥩 ${d.p}g protein | 🍚 ${d.c}g carbs | 🧈 ${d.f}g fat\n\nYou can now log it anytime by name.`
      };
    }
    return {
      response: `To add a custom recipe, include at least the calories:\n\n**"add recipe [name] [calories] cal [protein]g protein [carbs]g carbs [fat]g fat"**\n\nExample: "add recipe morning smoothie 250 cal 15g protein 30g carbs 8g fat"`
    };
  }

  // Analysis
  if (lower.includes('analy') || lower.includes('review my') || lower.includes('how am i doing') || lower.includes('nutrition report') || lower.includes('breakdown')) {
    return { response: getAnalysis() };
  }

  // Today summary
  if (lower.includes('today') && (lower.includes('eat') || lower.includes('ate') || lower.includes('summary') || lower.includes('what') || lower.includes('show'))) {
    return { response: getTodaySummary() };
  }

  // Week summary
  if (lower.includes('week') && (lower.includes('summary') || lower.includes('how') || lower.includes('going') || lower.includes('review') || lower.includes('show'))) {
    return { response: getWeekSummary() };
  }

  // Most eaten
  if (lower.includes('most') && (lower.includes('eaten') || lower.includes('frequent') || lower.includes('common') || lower.includes('popular'))) {
    return { response: getMostEaten() };
  }

  // Search foods
  if (lower.startsWith('search ') || lower.startsWith('find ')) {
    const query = lower.replace(/^(search |find )/, '').trim();
    const results = searchFoods(query);
    if (results.length === 0) return { response: `No dishes found for "${query}". You can add it as a custom recipe!` };
    const list = results.map((r) => {
      const d = foodDatabase[r];
      return `• **${r.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}** — ${d.cal} kcal, ${d.p}g protein`;
    }).join('\n');
    return { response: `Found ${results.length} matches:\n\n${list}\n\nSay the dish name to log it.` };
  }

  // Compare foods
  if (lower.includes(' vs ') || lower.includes(' versus ') || lower.includes('compare')) {
    const parts = lower.replace(/compare |which is better |which is healthier /g, '').split(/ vs | versus | or /);
    if (parts.length >= 2) {
      const a = lookupFood(parts[0].trim());
      const b = lookupFood(parts[1].trim());
      const nameA = parts[0].trim().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      const nameB = parts[1].trim().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      if (a && b) {
        const winner = a.score > b.score ? nameA : a.score < b.score ? nameB : 'Both are similar';
        return {
          response: `**${nameA}** vs **${nameB}**:\n\n| | ${nameA} | ${nameB} |\n|---|---|---|\n| Calories | ${a.cal} kcal | ${b.cal} kcal |\n| Protein | ${a.p}g | ${b.p}g |\n| Carbs | ${a.c}g | ${b.c}g |\n| Fat | ${a.f}g | ${b.f}g |\n| Health Score | ${a.score}/10 | ${b.score}/10 |\n\n**Healthier pick: ${winner}** ${a.score > b.score ? '(lower cal, better score)' : ''}`
        };
      }
    }
  }

  // Nutrition query
  if (lower.includes('how many') || lower.includes('calories in') || lower.includes('nutrition') || lower.includes('how much') || lower.includes('whats in') || lower.includes("what's in")) {
    const words = lower.replace(/how many calories in |calories in |nutrition of |nutrition in |how much protein in |how much |whats in |what's in /g, '').trim();
    const food = lookupFood(words);
    if (food) {
      return {
        response: `**${words.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}** per serving:\n\n🔥 ${food.cal} kcal\n🥩 Protein: ${food.p}g\n🍚 Carbs: ${food.c}g\n🧈 Fat: ${food.f}g\n🌿 Fiber: ${food.fb}g\n💚 Health Score: ${food.score}/10\n\nSay "log it" or "had [food name]" to add it to your diary.`
      };
    }
    return { response: `I don't have "${words}" in my database yet. You can add it as a custom recipe:\n\n"add recipe ${words} [calories] cal [protein]g protein [carbs]g carbs [fat]g fat"` };
  }

  // Suggestions
  if (lower.includes('suggest') || lower.includes('recommend') || lower.includes('what should i eat') || lower.includes('what can i eat')) {
    const profile = getProfile();
    const todayEntries = getEntriesByDate(format(new Date(), 'yyyy-MM-dd'));
    const todayCal = todayEntries.reduce((s, e) => s + e.calories, 0);
    const remaining = profile.goals.calories - todayCal;
    const todayProtein = todayEntries.reduce((s, e) => s + e.protein, 0);

    if (remaining <= 0) {
      return { response: "You've hit your calorie goal! If you're hungry, try something light like buttermilk (40 kcal), coconut water (46 kcal), or a small fruit salad (120 kcal)." };
    }

    const suggestions = [];
    if (remaining > 400 && todayProtein < profile.goals.protein * 0.6) {
      suggestions.push('**Tandoori Chicken** — 260 kcal, 32g protein');
      suggestions.push('**Dal Tadka with Rice** — 380 kcal, 14g protein');
      suggestions.push('**Egg Bhurji with Roti** — 340 kcal, 20g protein');
    } else if (remaining > 200) {
      suggestions.push('**Idli Sambar** — 195 kcal, light and balanced');
      suggestions.push('**Sprouts Salad** — 150 kcal, high fiber');
      suggestions.push('**Curd Rice** — 210 kcal, easy on the stomach');
    } else {
      suggestions.push('**Buttermilk** — 40 kcal, great for digestion');
      suggestions.push('**Coconut Water** — 46 kcal, natural electrolytes');
      suggestions.push('**Small Banana** — 105 kcal, quick energy');
    }

    return {
      response: `You have **${remaining} kcal** remaining today (protein: ${todayProtein}g/${profile.goals.protein}g).\n\n${suggestions.map((s) => `• ${s}`).join('\n')}`
    };
  }

  // Goal check
  if (lower.includes('goal') || lower.includes('target') || lower.includes('limit')) {
    const g = getProfile().goals;
    return { response: `Your daily goals:\n\n🔥 Calories: ${g.calories} kcal\n🥩 Protein: ${g.protein}g\n🍚 Carbs: ${g.carbs}g\n🧈 Fat: ${g.fat}g\n💧 Water: ${g.water}L\n\nUpdate these in Profile → Edit Goals.` };
  }

  // Help
  if (lower.includes('help') || lower === '?') {
    return {
      response: `**What I can do:**\n\n📝 **Log food** — "had biryani for lunch"\n📷 **Photo log** — use camera button below\n🔍 **Search** — "search paneer"\n📊 **Today** — "what did I eat today?"\n📈 **Week** — "how's my week?"\n🧪 **Analysis** — "analyze my nutrition"\n⚖️ **Compare** — "dosa vs idli"\n🍽️ **Nutrition** — "calories in samosa"\n💡 **Suggest** — "what should I eat?"\n🍳 **Custom recipe** — "add recipe [name] [cal] cal [protein]g protein [carbs]g carbs [fat]g fat"\n🏆 **Top foods** — "what do I eat most?"`
    };
  }

  // Log food — default action
  let foodName = lower;
  let mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack' = 'snack';

  if (lower.includes('breakfast')) { mealType = 'breakfast'; foodName = foodName.replace(/for breakfast|breakfast/g, ''); }
  else if (lower.includes('lunch')) { mealType = 'lunch'; foodName = foodName.replace(/for lunch|lunch/g, ''); }
  else if (lower.includes('dinner') || lower.includes('supper')) { mealType = 'dinner'; foodName = foodName.replace(/for dinner|for supper|dinner|supper/g, ''); }
  else if (lower.includes('snack')) { mealType = 'snack'; foodName = foodName.replace(/for snack|as a snack|snack/g, ''); }
  else {
    const hour = new Date().getHours();
    if (hour < 11) mealType = 'breakfast';
    else if (hour < 15) mealType = 'lunch';
    else if (hour < 18) mealType = 'snack';
    else mealType = 'dinner';
  }

  foodName = foodName.replace(/^(i |i had |i ate |ate |had |just had |just ate |log |add |eating |eaten |took |drank |made )/g, '').trim();

  // Handle quantities like "2 rotis" or "3 idlis"
  const qtyMatch = foodName.match(/^(\d+)\s+(.+?)s?$/);
  let qty = 1;
  if (qtyMatch) {
    qty = parseInt(qtyMatch[1]);
    foodName = qtyMatch[2];
  }

  if (!foodName || foodName.length < 2) {
    return { response: "Tell me what you ate, or type **help** for all commands." };
  }

  const nutrition = lookupFood(foodName);
  const cal = (nutrition?.cal ?? (200 + Math.floor(Math.random() * 250))) * qty;
  const p = (nutrition?.p ?? Math.floor(Math.random() * 20 + 5)) * qty;
  const c = (nutrition?.c ?? Math.floor(Math.random() * 40 + 10)) * qty;
  const f = (nutrition?.f ?? Math.floor(Math.random() * 15 + 3)) * qty;
  const fb = (nutrition?.fb ?? Math.floor(Math.random() * 5 + 1)) * qty;
  const score = nutrition?.score ?? Math.floor(Math.random() * 4 + 4);

  const displayName = (qty > 1 ? `${qty}x ` : '') + foodName.split(' ').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  const entry: FoodEntry = {
    id: Date.now().toString(),
    name: displayName,
    calories: cal, protein: p, carbs: c, fat: f, fiber: fb,
    mealType,
    time: format(new Date(), 'HH:mm'),
    date: format(new Date(), 'yyyy-MM-dd'),
    healthScore: score,
    servingSize: qty > 1 ? `${qty} servings` : '1 serving',
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
    response: `Logged **${displayName}** for ${mealType}! ✅\n\n🔥 ${cal} kcal | 🥩 ${p}g protein | 🍚 ${c}g carbs | 🧈 ${f}g fat\n💚 Health Score: ${score}/10${!nutrition ? '\n\n_Estimated — add exact nutrition with "add recipe" command_' : ''}`,
    foodEntry: entry,
  };
}
