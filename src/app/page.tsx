'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isLoggedIn } from '@/lib/store';
import { useTheme } from '@/lib/theme';
import { ArrowRight, Sun, Moon, Check } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const { theme, toggle } = useTheme();

  useEffect(() => {
    if (isLoggedIn()) router.replace('/home');
  }, [router]);

  const cta = () => router.push('/login');

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-strong">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 h-14">
          <span className="text-base font-bold tracking-tight" style={{ fontFamily: 'Plus Jakarta Sans' }}>
            nourish<span style={{ color: 'var(--accent)' }}>log</span>
          </span>
          <div className="flex items-center gap-3">
            <button onClick={toggle} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }} aria-label="Toggle theme">
              {theme === 'dark' ? <Sun size={14} style={{ color: 'var(--text-secondary)' }} /> : <Moon size={14} style={{ color: 'var(--text-secondary)' }} />}
            </button>
            <button onClick={cta} className="px-4 py-1.5 rounded-lg text-xs font-semibold active:scale-95 transition-all" style={{ background: 'var(--accent)', color: '#fff' }}>
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <section className="pt-28 pb-8 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-6" style={{ border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
            <span className="text-[11px] font-medium" style={{ color: 'var(--text-secondary)' }}>500+ Indian dishes</span>
            <span className="text-xs">🇮🇳</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.08] tracking-tight mb-5" style={{ fontFamily: 'Plus Jakarta Sans' }}>
            Your food diary that<br />actually <span style={{ color: 'var(--accent)' }}>gets</span> Indian food.
          </h1>

          <p className="text-base sm:text-lg max-w-xl mx-auto mb-8 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Tell us you had &ldquo;chole bhature for lunch&rdquo; and we pull the nutrition from IFCT data — 450 kcal, 12g protein, health score 4/10. Edit any value if it&apos;s off. No other tracker does that.
          </p>

          <div className="flex items-center justify-center gap-3 mb-4">
            <button onClick={cta} className="group flex items-center gap-2 px-7 py-3 rounded-lg font-semibold text-sm active:scale-95 transition-all" style={{ background: 'var(--accent)', color: '#fff' }}>
              Start for Free <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
            <button onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
              See everything below ↓
            </button>
          </div>
          <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>No credit card · No app to install · Your data stays on your device</p>
        </div>
      </section>

      {/* ═══ HERO SCREENSHOT — Home Dashboard ═══ */}
      <section className="px-6 pb-12">
        <div className="max-w-5xl mx-auto">
          <BrowserFrame url="nourishlog.vercel.app/home">
            <HomeMockup />
          </BrowserFrame>
        </div>
      </section>

      {/* ═══ FEATURE 1 — Chat Logging ═══ */}
      <Feature id="features"
        label="01" title="Log by chatting." subtitle="The fastest way to track food."
        description="Just type what you had. &ldquo;2 rotis with dal for dinner&rdquo;, &ldquo;chai and samosa at 4pm&rdquo;, or even &ldquo;had maggi&rdquo;. We parse quantities, detect the meal type from the time of day, and log it with full nutrition — no forms, no dropdowns, no searching."
        bullets={['Understands natural language and quantities', 'Auto-detects breakfast/lunch/dinner from time', 'Ask "what did I eat today?" or "analyze my nutrition"', 'Compare foods: "dosa vs idli"', 'Get suggestions: "what should I eat?"']}
        mockup={<BrowserFrame url="nourishlog.vercel.app/chat"><ChatMockup /></BrowserFrame>}
        reverse={false}
      />

      {/* ═══ FEATURE 2 — Photo + Text Upload ═══ */}
      <Feature
        label="02" title="Upload or snap." subtitle="For when you're not in a chatty mood."
        description="The Log page gives you a full photo upload area — take a picture with your camera or pick from gallery. We identify the dish and log it. Or just type the food name in the search bar, tap a recent food chip, or quick-add common items like chai, roti, dal, banana."
        bullets={['Camera and gallery upload', 'Text search across 500+ dishes', 'Recent foods chips for one-tap logging', 'Quick-add grid: chai, water, idli, eggs, roti, dal...', 'Meal type selector: breakfast / lunch / dinner / snack']}
        mockup={<BrowserFrame url="nourishlog.vercel.app/log"><LogMockup /></BrowserFrame>}
        reverse={true}
      />

      {/* ═══ FEATURE 3 — Nutrition Breakdown ═══ */}
      <Feature
        label="03" title="Every nutrient. Every meal." subtitle="Not just calories — the full picture."
        description="Tap any logged meal to see the complete nutrition breakdown sourced from IFCT (Indian Food Composition Tables). Calories, protein, carbs, fat, fiber — each with a progress ring. Plus micronutrients and a health score. Think a value is wrong? Edit any field inline."
        bullets={['Nutrition data from IFCT / NIN Hyderabad sources', 'Edit calories, protein, carbs, fat, fiber inline', 'Macro rings with daily value percentages', 'Micronutrient breakdown (6 key nutrients)', 'Health score 1-10 for every food', 'Delete entries anytime']}
        mockup={<BrowserFrame url="nourishlog.vercel.app/meal/biryani"><NutritionMockup /></BrowserFrame>}
        reverse={false}
      />

      {/* ═══ FEATURE 4 — Dashboard & Filters ═══ */}
      <Feature
        label="04" title="Filter everything." subtitle="Your data, sliced any way you want."
        description="The dashboard isn't just charts. Filter by date range (today, this week, last 30 days, or custom dates). Filter by meal type — see only your breakfasts. Search for a specific food across all your history. Click any bar in the chart to drill into that day. Export everything as a CSV."
        bullets={['Date range: today / week / month / custom', 'Navigate weeks with arrows', 'Filter by meal type (breakfast/lunch/dinner/snack)', 'Search by food name across all history', 'Click chart bars to filter by specific date', 'Full meal history table with all columns', 'CSV export: date rows × meal columns with calories']}
        mockup={<BrowserFrame url="nourishlog.vercel.app/dashboard"><DashboardMockup /></BrowserFrame>}
        reverse={true}
      />

      {/* ═══ FEATURE 5 — Achievements & Sharing ═══ */}
      <Feature
        label="05" title="Stay motivated." subtitle="Streaks, challenges, badges — and share them."
        description="Daily challenges give you small goals to hit each day: log 3 meals, hit your protein target, eat clean. Achievement badges unlock as you build habits — 3-day streak, 10 unique foods, your first photo log. When you're proud of your progress, share your stats or weekly recap with friends on WhatsApp."
        bullets={['Daily challenges with progress bars', '18 achievement badges to unlock', 'Streak counter with milestones', 'Share progress as formatted text', 'Weekly recap: days logged, avg calories, streaks', 'Works on WhatsApp, iMessage, or copy to clipboard']}
        mockup={<BrowserFrame url="nourishlog.vercel.app/achievements"><AchievementsMockup /></BrowserFrame>}
        reverse={false}
      />

      {/* ═══ FEATURE 6 — Custom Recipes ═══ */}
      <Feature
        label="06" title="Your recipes, your data." subtitle="Add anything we don't have."
        description="Made a protein shake with specific macros? A family recipe? Just tell the chat: &ldquo;add recipe morning smoothie 250 cal 15g protein 30g carbs 8g fat&rdquo; — saved permanently. Log it by name anytime. Your custom foods sit alongside our 500+ database."
        bullets={['Add via chat with natural language', 'Specify exact calories and macros', 'Saved permanently in your browser', 'Log by name anytime after saving', 'Works alongside the built-in 500+ dish database']}
        mockup={<BrowserFrame url="nourishlog.vercel.app/chat"><RecipeMockup /></BrowserFrame>}
        reverse={true}
      />

      {/* ═══ FOODS ═══ */}
      <section className="py-16 px-6" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2" style={{ fontFamily: 'Plus Jakarta Sans' }}>500+ dishes. Real Indian food.</h2>
          <p className="text-sm mb-8 max-w-md mx-auto" style={{ color: 'var(--text-muted)' }}>
            South Indian, North Indian, street food, Mughlai, Bengali, Gujarati, Maharashtrian, desserts, drinks, Indo-Chinese, and more.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-3xl mx-auto">
            {[
              'Masala Dosa · 280', 'Idli Sambar · 195', 'Poha · 250', 'Biryani · 490',
              'Rajma Chawal · 410', 'Chole Bhature · 520', 'Butter Chicken · 438',
              'Palak Paneer · 290', 'Dal Rice · 380', 'Vada Pav · 290',
              'Pav Bhaji · 380', 'Samosa · 262', 'Tandoori Chicken · 260',
              'Fish Curry · 320', 'Dhokla · 160', 'Momos · 250',
              'Chai · 80', 'Filter Coffee · 90', 'Gulab Jamun · 175',
              'Maggi · 310', 'Shawarma · 400', 'Pani Puri · 180',
            ].map((item) => {
              const [name, cal] = item.split(' · ');
              return (
                <span key={item} className="px-2.5 py-1 rounded-md text-[11px]" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  <span style={{ color: 'var(--text-primary)' }}>{name}</span>
                  <span className="ml-1" style={{ color: 'var(--text-muted)' }}>{cal} kcal</span>
                </span>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ EVERYTHING INCLUDED ═══ */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10" style={{ fontFamily: 'Plus Jakarta Sans' }}>Everything. Free. No catch.</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {[
              '500+ Indian dishes — IFCT-sourced nutrition data',
              'Chat-based logging — just type what you ate',
              'Photo upload — camera or gallery',
              'Custom recipes — add your own dishes',
              'Calorie ring with macro badges',
              'Health score 1-10 for every food',
              'Edit any nutrition value inline',
              'Micronutrient breakdown per meal',
              'Dashboard with bar charts & donut charts',
              'Filter by date range, meal type, food name',
              'Click chart bars to drill into a day',
              'Export meal data as CSV',
              'Daily challenges with progress bars',
              '18 achievement badges to unlock',
              'Streak tracking with milestones',
              'Share progress on WhatsApp',
              'Weekly recap generator',
              'Water tracking on home page',
              'Meal suggestions based on remaining macros',
              'Nutrition analysis with improvement tips',
              'Food comparison (dosa vs idli)',
              'Quantity support (2 rotis, 3 idlis)',
              'Search across 500+ dishes',
              'Quick-add grid for common foods',
              'Dark and light mode',
              'Desktop sidebar + mobile bottom nav',
              'Works on any device — no app install',
              'Data stays in your browser — no account needed',
              'Completely free, no limits',
            ].map((item) => (
              <div key={item} className="flex items-start gap-2 py-1.5">
                <div className="w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5" style={{ background: 'var(--green-dim)' }}>
                  <Check size={10} style={{ color: 'var(--green)' }} />
                </div>
                <span className="text-[13px] leading-snug" style={{ color: 'var(--text-secondary)' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="py-20 px-6" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ fontFamily: 'Plus Jakarta Sans' }}>
            You already know what you ate.<br />Now <span style={{ color: 'var(--accent)' }}>know what&apos;s in it.</span>
          </h2>
          <p className="mb-8" style={{ color: 'var(--text-muted)' }}>10 seconds to set up. No credit card. No app download. No nonsense.</p>
          <button onClick={cta} className="group inline-flex items-center gap-2.5 px-8 py-3.5 rounded-lg font-semibold text-base active:scale-95 transition-all" style={{ background: 'var(--accent)', color: '#fff' }}>
            Start Tracking — Free <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-6 px-6" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs font-semibold" style={{ fontFamily: 'Plus Jakarta Sans', color: 'var(--text-muted)' }}>nourish<span style={{ color: 'var(--accent)' }}>log</span></span>
          <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Made in India, for India.</p>
        </div>
      </footer>
    </div>
  );
}

/* ─── Shared Components ─── */

function BrowserFrame({ url, children }: { url: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl overflow-hidden shadow-lg" style={{ border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
      <div className="flex items-center gap-2 px-3 py-2" style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
        <div className="flex gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" /><div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" /><div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" /></div>
        <div className="flex-1 flex justify-center"><span className="text-[9px] font-medium px-3 py-0.5 rounded-md" style={{ color: 'var(--text-muted)', background: 'var(--bg-card)', border: '1px solid var(--border)' }}>{url}</span></div>
      </div>
      <div className="p-4 sm:p-5">{children}</div>
    </div>
  );
}

function Feature({ id, label, title, subtitle, description, bullets, mockup, reverse }: {
  id?: string; label: string; title: string; subtitle: string; description: string; bullets: string[];
  mockup: React.ReactNode; reverse: boolean;
}) {
  return (
    <section id={id} className="py-14 px-6" style={label === '02' || label === '04' || label === '06' ? { background: 'var(--bg-secondary)' } : {}}>
      <div className={`max-w-5xl mx-auto flex flex-col lg:flex-row items-start gap-8 lg:gap-14 ${reverse ? 'lg:flex-row-reverse' : ''}`}>
        <div className="flex-1 lg:pt-4">
          <span className="text-xs font-bold block mb-1" style={{ color: 'var(--accent)', fontFamily: 'JetBrains Mono' }}>{label}</span>
          <h2 className="text-2xl sm:text-3xl font-bold mb-1" style={{ fontFamily: 'Plus Jakarta Sans' }}>{title}</h2>
          <p className="text-sm font-medium mb-4" style={{ color: 'var(--text-muted)' }}>{subtitle}</p>
          <p className="text-[15px] leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }} dangerouslySetInnerHTML={{ __html: description }} />
          <ul className="flex flex-col gap-1.5">
            {bullets.map((b) => (
              <li key={b} className="flex items-start gap-2 text-[13px]" style={{ color: 'var(--text-secondary)' }}>
                <Check size={14} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--green)' }} />
                {b}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex-1 w-full">{mockup}</div>
      </div>
    </section>
  );
}

/* ─── Mockup Contents ─── */

const H = { fontFamily: 'Plus Jakarta Sans' };
const SG = { fontFamily: 'JetBrains Mono' };
const tp = { color: 'var(--text-primary)' };
const ts = { color: 'var(--text-secondary)' };
const tm = { color: 'var(--text-muted)' };
const ac = { color: 'var(--accent)' };
const card = { background: 'var(--bg-card)', border: '1px solid var(--border)' };
const el = { background: 'var(--bg-elevated)' };

function HomeMockup() {
  return (
    <div className="flex" style={{ fontFamily: 'Inter', fontSize: 11 }}>
      <div className="hidden sm:flex flex-col w-36 p-2.5 gap-0.5" style={{ borderRight: '1px solid var(--border)' }}>
        <div className="flex items-center gap-1.5 px-2 py-1 mb-2"><div className="w-4 h-4 rounded" style={{ background: 'var(--accent)' }} /><span className="text-[10px] font-bold" style={H}>nourish<span style={ac}>log</span></span></div>
        {['🏠 Home', '➕ Log', '💬 Chat', '📊 Dashboard', '🏆 Achievements', '👤 Profile'].map((t, i) => (
          <div key={t} className="px-2 py-1 rounded text-[10px]" style={{ background: i === 0 ? 'var(--accent-dim)' : 'transparent', color: i === 0 ? 'var(--accent)' : 'var(--text-muted)', fontWeight: i === 0 ? 600 : 400 }}>{t}</div>
        ))}
      </div>
      <div className="flex-1 p-3 sm:p-4">
        <div className="flex justify-between items-start mb-3">
          <div><p className="text-xs font-bold" style={{ ...H, ...tp }}>Good afternoon, Priya</p><p className="text-[9px]" style={tm}>Sunday, 6 April 2026</p></div>
          <div className="px-2 py-1 rounded text-[9px] font-semibold" style={{ background: 'var(--accent)', color: '#fff' }}>+ Log Meal</div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-shrink-0 flex justify-center"><div className="relative" style={{ width: 120, height: 120 }}>
            <svg width="120" height="120" viewBox="0 0 120 120" className="-rotate-90"><circle cx="60" cy="60" r="48" fill="none" stroke="var(--bg-card-hover)" strokeWidth="7" /><circle cx="60" cy="60" r="48" fill="none" stroke="var(--accent)" strokeWidth="7" strokeLinecap="round" strokeDasharray="302" strokeDashoffset="130" /></svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center"><span className="text-lg font-extrabold" style={{ ...H, ...tp }}>1,245</span><span className="text-[7px]" style={tm}>of 2,000 kcal</span><span className="text-[7px] font-semibold" style={ac}>755 left</span></div>
          </div></div>
          <div className="flex-1 flex flex-col gap-1.5">
            <div className="flex gap-1.5">
              {[{ l: 'PROTEIN', v: '48g', g: '120g', c: 'var(--blue)', p: '40%' }, { l: 'CARBS', v: '156g', g: '250g', c: 'var(--amber)', p: '62%' }, { l: 'FAT', v: '38g', g: '65g', c: 'var(--rose)', p: '58%' }].map(m => (
                <div key={m.l} className="flex-1 rounded-lg p-1.5" style={card}>
                  <div className="flex items-center gap-0.5 mb-0.5"><div className="w-1 h-1 rounded-full" style={{ background: m.c }} /><span className="text-[7px] font-semibold" style={{ ...SG, ...tm }}>{m.l}</span></div>
                  <span className="text-[10px] font-bold" style={{ color: m.c, ...H }}>{m.v}</span><span className="text-[7px]" style={tm}> / {m.g}</span>
                  <div className="w-full h-0.5 rounded-full mt-0.5" style={{ background: 'var(--bg-card-hover)' }}><div className="h-full rounded-full" style={{ width: m.p, background: m.c }} /></div>
                </div>
              ))}
            </div>
            <div className="flex gap-1.5">
              {[{ l: 'MEALS', v: '4' }, { l: 'HEALTH', v: '6.3', c: 'var(--green)' }, { l: 'WATER', v: '5/12', c: 'var(--blue)' }].map(s => (
                <div key={s.l} className="flex-1 rounded-lg p-1.5" style={card}><p className="text-[7px] font-semibold" style={{ ...SG, ...tm }}>{s.l}</p><p className="text-[10px] font-bold mt-0.5" style={{ ...H, color: s.c || 'var(--text-primary)' }}>{s.v}</p></div>
              ))}
            </div>
            {[{ n: 'Masala Dosa + Chutney', m: 'Breakfast · 8:30 AM · 💚 7/10', c: 280, e: '🌅' }, { n: 'Chicken Biryani', m: 'Lunch · 1:00 PM · 💚 6/10', c: 490, e: '☀️' }, { n: 'Dal Tadka + 2 Roti', m: 'Dinner · 8:15 PM · 💚 8/10', c: 330, e: '🌙' }, { n: 'Chai + Biscuits', m: 'Snack · 4:00 PM · 💚 4/10', c: 145, e: '🍿' }].map(f => (
              <div key={f.n} className="flex items-center gap-2 p-1.5 rounded-lg" style={card}>
                <div className="w-6 h-6 rounded flex items-center justify-center text-xs" style={el}>{f.e}</div>
                <div className="flex-1 min-w-0"><p className="text-[9px] font-semibold truncate" style={tp}>{f.n}</p><p className="text-[7px]" style={tm}>{f.m}</p></div>
                <div className="text-right"><span className="text-[10px] font-bold" style={{ ...H, ...ac }}>{f.c}</span><span className="text-[6px] block" style={tm}>kcal</span></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ChatMockup() {
  const msgs: [string, 'u' | 'a'][] = [
    ['Hey Priya! Tell me what you ate and I\'ll log it with full nutrition.', 'a'],
    ['had chicken biryani for lunch', 'u'],
    ['Logged Chicken Biryani for lunch! ✅\n490 kcal · 22g protein · 62g carbs · 18g fat\nHealth Score: 6/10', 'a'],
    ['also had chai and 2 samosas', 'u'],
    ['Logged Chai (80 kcal) + 2x Samosa (524 kcal) ✅\n1,094 kcal today. 906 remaining.', 'a'],
    ['analyze my nutrition', 'u'],
    ['Avg: 1,834 kcal/day. 28% protein, 44% carbs, 28% fat.\n🥩 Low protein — add more dal, eggs, chicken\n✅ Fiber is on track', 'a'],
  ];
  return (
    <div className="flex flex-col gap-1.5" style={{ fontFamily: 'Inter', fontSize: 11 }}>
      <div className="flex items-center gap-1.5 pb-2 mb-1" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="w-6 h-6 rounded-lg flex items-center justify-center text-[8px]" style={{ background: 'var(--accent-dim)' }}>✦</div>
        <div><p className="text-[10px] font-bold" style={{ ...H, ...tp }}>NourishLog Chat</p><p className="text-[7px]" style={tm}>Log food, ask questions, get suggestions</p></div>
      </div>
      {msgs.map(([text, role], i) => (
        <div key={i} className={`flex ${role === 'u' ? 'justify-end' : 'justify-start'}`}>
          <div className={`max-w-[82%] rounded-xl px-2.5 py-1.5 ${role === 'u' ? 'rounded-br-sm' : 'rounded-bl-sm'}`}
            style={role === 'u' ? { background: 'var(--accent)', color: '#fff' } : { ...card }}>
            {text.split('\n').map((line, j) => (
              <p key={j} className={`text-[9px] leading-relaxed ${j > 0 ? 'mt-0.5' : ''}`} style={role === 'a' ? ts : {}}>{line}</p>
            ))}
          </div>
        </div>
      ))}
      <div className="flex gap-1.5 mt-1 pt-1.5" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="w-6 h-6 rounded flex items-center justify-center text-[8px]" style={card}>📷</div>
        <div className="flex-1 h-6 rounded flex items-center px-2" style={card}><span className="text-[8px]" style={tm}>Type what you ate...</span></div>
        <div className="w-6 h-6 rounded flex items-center justify-center text-[8px]" style={{ background: 'var(--accent)', color: '#fff' }}>→</div>
      </div>
    </div>
  );
}

function LogMockup() {
  return (
    <div style={{ fontFamily: 'Inter', fontSize: 11 }}>
      <p className="text-sm font-bold mb-0.5" style={{ ...H, ...tp }}>Log Meal</p>
      <p className="text-[9px] mb-3" style={tm}>Upload a photo or type what you ate</p>
      <div className="flex gap-1.5 mb-3">{['Breakfast', 'Lunch', 'Dinner', 'Snack'].map((m, i) => (
        <span key={m} className="px-2 py-1 rounded text-[9px] font-medium" style={i === 1 ? { background: 'var(--accent)', color: '#fff' } : { ...card, ...ts }}>{m}</span>
      ))}</div>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <div className="rounded-xl p-4 text-center border-2 border-dashed mb-2" style={{ borderColor: 'var(--border)' }}>
            <span className="text-2xl block mb-1">📸</span><p className="text-[9px]" style={ts}>Snap or upload your meal</p><p className="text-[7px]" style={tm}>We&apos;ll identify the food</p>
          </div>
          <div className="flex gap-1.5"><span className="flex-1 text-center py-1.5 rounded text-[9px] font-semibold" style={{ background: 'var(--accent)', color: '#fff' }}>📷 Take Photo</span><span className="flex-1 text-center py-1.5 rounded text-[9px]" style={{ ...card, ...ts }}>🖼️ Gallery</span></div>
        </div>
        <div className="flex-1">
          <div className="rounded-lg px-2 py-1.5 flex items-center gap-1.5 mb-2" style={card}><span className="text-[8px]" style={tm}>🔍</span><span className="text-[8px]" style={tm}>e.g. &quot;chicken biryani&quot;</span></div>
          <p className="text-[8px] font-semibold mb-1" style={{ ...SG, ...tm }}>RECENT</p>
          <div className="flex flex-wrap gap-1 mb-2">{['Biryani', 'Dosa', 'Paratha', 'Poha', 'Paneer'].map(f => (
            <span key={f} className="px-1.5 py-0.5 rounded text-[8px]" style={{ ...card, ...ts }}>{f}</span>
          ))}</div>
          <p className="text-[8px] font-semibold mb-1" style={{ ...SG, ...tm }}>QUICK ADD</p>
          <div className="grid grid-cols-4 gap-1">{[{ n: 'Chai', e: '☕', c: 80 }, { n: 'Water', e: '💧', c: 0 }, { n: 'Roti', e: '🫓', c: 120 }, { n: 'Dal', e: '🥣', c: 180 }, { n: 'Eggs', e: '🥚', c: 155 }, { n: 'Banana', e: '🍌', c: 105 }, { n: 'Idli', e: '🫓', c: 58 }, { n: 'Rice', e: '🍚', c: 206 }].map(i => (
            <div key={i.n} className="rounded-lg p-1 text-center" style={card}><span className="text-sm block">{i.e}</span><span className="text-[7px]" style={ts}>{i.n}</span><span className="text-[6px] block" style={tm}>{i.c}</span></div>
          ))}</div>
        </div>
      </div>
    </div>
  );
}

function NutritionMockup() {
  return (
    <div style={{ fontFamily: 'Inter', fontSize: 11 }}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-[10px]" style={tm}>← Meal Details</p>
        <span className="text-[8px] px-1.5 py-0.5 rounded" style={{ ...card, ...ts }}>✏️ Edit</span>
      </div>
      <p className="text-sm font-bold" style={{ ...H, ...tp }}>Chicken Biryani</p>
      <p className="text-[9px] mt-0.5" style={tm}>Lunch · 1:00 PM · 1 plate (300g)</p>
      <div className="flex items-center gap-2 mt-2 mb-3">
        <span className="text-xl font-extrabold" style={{ ...H, ...ac }}>490</span><span className="text-xs" style={tm}>kcal</span>
        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold" style={{ background: 'var(--green-dim)', color: 'var(--green)' }}>💚 6/10</span>
      </div>
      <div className="rounded-lg p-2.5 mb-2" style={card}>
        <p className="text-[10px] font-bold mb-2" style={{ ...H, ...tp }}>Nutrition Breakdown</p>
        <div className="grid grid-cols-4 gap-2">
          {[{ l: 'Protein', v: '22g', c: 'var(--blue)', p: 50 }, { l: 'Carbs', v: '62g', c: 'var(--amber)', p: 68 }, { l: 'Fat', v: '18g', c: 'var(--rose)', p: 75 }, { l: 'Fiber', v: '3g', c: 'var(--green)', p: 30 }].map(m => (
            <div key={m.l} className="text-center">
              <div className="relative w-10 h-10 mx-auto mb-0.5"><svg width="40" height="40" viewBox="0 0 40 40" className="-rotate-90"><circle cx="20" cy="20" r="16" fill="none" stroke="var(--bg-card-hover)" strokeWidth="3" /><circle cx="20" cy="20" r="16" fill="none" stroke={m.c} strokeWidth="3" strokeLinecap="round" strokeDasharray="100" strokeDashoffset={100 - m.p} /></svg><div className="absolute inset-0 flex items-center justify-center"><span className="text-[8px] font-bold" style={{ color: m.c }}>{m.v}</span></div></div>
              <p className="text-[7px]" style={tm}>{m.l}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-lg p-2.5" style={card}>
        <p className="text-[10px] font-bold mb-1" style={{ ...H, ...tp }}>Micronutrients</p>
        {[['Vitamin C', '8% DV'], ['Iron', '20% DV'], ['Calcium', '6% DV'], ['Sodium', '720mg']].map(([l, v]) => (
          <div key={l} className="flex justify-between py-0.5 text-[8px]" style={{ borderBottom: '1px solid var(--border)' }}>
            <span style={tm}>{l}</span><span style={ts}>{v}</span>
          </div>
        ))}
      </div>
      <p className="text-[7px] mt-2" style={tm}>Source: IFCT data. <span style={ac}>Edit if incorrect →</span></p>
    </div>
  );
}

function DashboardMockup() {
  return (
    <div style={{ fontFamily: 'Inter', fontSize: 11 }}>
      {/* Header + actions */}
      <div className="flex justify-between items-center mb-2">
        <p className="text-sm font-bold" style={{ ...H, ...tp }}>Dashboard</p>
        <div className="flex gap-1">
          <span className="px-1.5 py-0.5 rounded text-[8px] flex items-center gap-0.5" style={{ background: 'var(--accent-dim)', color: 'var(--accent)' }}>⚙ Filters (active)</span>
          <span className="px-1.5 py-0.5 rounded text-[8px]" style={{ ...card, ...ts }}>📥 Export CSV</span>
        </div>
      </div>

      {/* Date range tabs + week nav */}
      <div className="flex items-center gap-1 mb-1.5">
        {['Today', 'Week', 'Month', 'Custom'].map((r, i) => (
          <span key={r} className="px-1.5 py-0.5 rounded text-[7px] font-semibold" style={i === 1 ? { background: 'var(--accent)', color: '#fff' } : { ...card, ...tm }}>{r}</span>
        ))}
        <span className="text-[7px] mx-1" style={tm}>‹</span>
        <span className="text-[8px] font-semibold" style={ts}>This Week</span>
        <span className="text-[7px] mx-1" style={tm}>›</span>
        <span className="ml-auto px-1.5 py-0.5 rounded text-[7px] flex items-center gap-0.5" style={{ background: 'var(--blue-dim)', color: 'var(--blue)' }}>📅 Sat 5 ✕</span>
      </div>

      {/* Filters panel (open) */}
      <div className="rounded-lg p-2 mb-2 flex gap-3" style={card}>
        <div className="flex-1">
          <p className="text-[7px] font-bold mb-1 uppercase tracking-wider" style={{ ...SG, ...tm }}>Meal Type</p>
          <div className="flex gap-0.5 flex-wrap">
            {['All', 'Breakfast', 'Lunch', 'Dinner', 'Snack'].map((m, i) => (
              <span key={m} className="px-1 py-0.5 rounded text-[7px]" style={i === 2 ? { background: 'var(--accent)', color: '#fff' } : { background: 'var(--bg-elevated)', ...ts }}>{m}</span>
            ))}
          </div>
        </div>
        <div className="flex-1">
          <p className="text-[7px] font-bold mb-1 uppercase tracking-wider" style={{ ...SG, ...tm }}>Search Food</p>
          <div className="rounded px-1.5 py-0.5 flex items-center" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
            <span className="text-[7px]" style={tm}>🔍 biryani</span>
          </div>
        </div>
        <div className="flex items-end"><span className="text-[7px]" style={{ color: 'var(--rose)' }}>Clear all</span></div>
      </div>

      {/* Summary row */}
      <div className="flex gap-1 mb-2">
        {[{ v: '3,920', l: 'TOTAL KCAL', c: ac }, { v: '1,960', l: 'DAILY AVG', c: tp }, { v: '8', l: 'MEALS', c: tp }, { v: '4', l: 'DAYS', c: tp }].map(s => (
          <div key={s.l} className="flex-1 rounded-lg p-1 text-center" style={card}>
            <p className="text-[10px] font-extrabold" style={{ ...H, ...s.c }}>{s.v}</p>
            <p className="text-[6px] uppercase font-semibold" style={{ ...SG, ...tm }}>{s.l}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="flex gap-1.5 mb-2">
        <div className="flex-[2] rounded-lg p-2" style={card}>
          <p className="text-[8px] font-bold mb-1" style={{ ...H, ...tp }}>Calories (lunch) matching &quot;biryani&quot;</p>
          <div className="flex items-end justify-between h-12 gap-0.5">
            {[0, 490, 0, 510, 0, 480, 0].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                <div className="w-full rounded-t" style={{ height: h ? `${(h/510)*100}%` : '3%', background: i === 3 ? 'var(--blue)' : h ? 'color-mix(in srgb, var(--accent) 40%, transparent)' : 'var(--bg-card-hover)' }} />
                <span className="text-[6px]" style={i === 3 ? { color: 'var(--blue)' } : tm}>{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center gap-0.5"><div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--accent)' }} /><span className="text-[6px]" style={tm}>Today</span></div>
            <div className="flex items-center gap-0.5"><div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--blue)' }} /><span className="text-[6px]" style={tm}>Selected</span></div>
            <span className="text-[6px]" style={tm}>Click bar to filter</span>
          </div>
        </div>
        <div className="flex-1 rounded-lg p-2" style={card}>
          <p className="text-[8px] font-bold mb-1" style={{ ...H, ...tp }}>Macro Split</p>
          <div className="flex items-center gap-2">
            <svg width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="14" fill="none" stroke="var(--blue)" strokeWidth="5" strokeDasharray="26 62" strokeDashoffset="0" transform="rotate(-90 20 20)" /><circle cx="20" cy="20" r="14" fill="none" stroke="var(--amber)" strokeWidth="5" strokeDasharray="37 51" strokeDashoffset="-26" transform="rotate(-90 20 20)" /><circle cx="20" cy="20" r="14" fill="none" stroke="var(--rose)" strokeWidth="5" strokeDasharray="25 63" strokeDashoffset="-63" transform="rotate(-90 20 20)" /></svg>
            <div className="flex flex-col gap-0.5">{[{ l: 'Protein', p: '30%', c: 'var(--blue)' }, { l: 'Carbs', p: '42%', c: 'var(--amber)' }, { l: 'Fat', p: '28%', c: 'var(--rose)' }].map(m => (
              <div key={m.l} className="flex items-center gap-1"><div className="w-1 h-1 rounded-full" style={{ background: m.c }} /><span className="text-[7px]" style={ts}>{m.l}</span><span className="text-[7px] font-bold" style={{ color: m.c }}>{m.p}</span></div>
            ))}</div>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="flex gap-1 mb-2">
        {[{ i: '📈', l: 'Most Eaten', v: 'Biryani', s: '4x' }, { i: '🔥', l: 'Peak', v: 'Thu', s: '2,430 kcal' }, { i: '🏆', l: 'Streak', v: '7 days', s: '' }, { i: '🥩', l: 'Avg Protein', v: '64g', s: '/ 120g' }].map(s => (
          <div key={s.l} className="flex-1 rounded-lg p-1" style={card}>
            <span className="text-[10px]">{s.i}</span>
            <p className="text-[6px] uppercase font-semibold" style={{ ...SG, ...tm }}>{s.l}</p>
            <p className="text-[8px] font-bold truncate" style={tp}>{s.v}</p>
            {s.s && <p className="text-[6px]" style={tm}>{s.s}</p>}
          </div>
        ))}
      </div>

      {/* Meal history table (expanded) */}
      <div className="rounded-lg overflow-hidden" style={card}>
        <div className="px-2 py-1" style={{ background: 'var(--bg-elevated)' }}>
          <p className="text-[8px] font-bold" style={{ ...H, ...tp }}>▾ Meal History (8 entries)</p>
        </div>
        {/* Header */}
        <div className="hidden sm:grid grid-cols-12 gap-1 px-2 py-0.5 text-[6px] font-bold uppercase" style={{ ...SG, ...tm, borderBottom: '1px solid var(--border)' }}>
          <span className="col-span-2">Date</span><span className="col-span-3">Food</span><span className="col-span-2">Meal</span><span className="col-span-1">Time</span><span className="col-span-1 text-right">Cal</span><span className="col-span-1 text-right">P</span><span className="col-span-1 text-right">C</span><span className="col-span-1 text-right">Score</span>
        </div>
        {[
          { d: 'Sun 6', n: 'Chicken Biryani', m: 'lunch', t: '13:00', c: 490, p: 22, cb: 62, s: 6 },
          { d: 'Sun 6', n: 'Masala Dosa', m: 'breakfast', t: '08:30', c: 280, p: 6, cb: 42, s: 7 },
          { d: 'Sat 5', n: 'Chicken Biryani', m: 'lunch', t: '13:15', c: 490, p: 22, cb: 62, s: 6 },
          { d: 'Sat 5', n: 'Dal Tadka + Roti', m: 'dinner', t: '20:00', c: 330, p: 15, cb: 48, s: 8 },
          { d: 'Thu 3', n: 'Hyderabadi Biryani', m: 'lunch', t: '12:45', c: 520, p: 24, cb: 60, s: 6 },
        ].map((r, i) => (
          <div key={i} className="grid grid-cols-12 gap-1 px-2 py-1 items-center text-[7px]" style={{ borderBottom: '1px solid var(--border)' }}>
            <span className="col-span-2" style={tm}>{r.d}</span>
            <span className="col-span-3 font-medium truncate" style={tp}>{r.n}</span>
            <span className="col-span-2">
              <span className="px-1 py-0.5 rounded text-[6px] font-medium" style={{
                background: r.m === 'breakfast' ? 'var(--blue-dim)' : r.m === 'lunch' ? 'var(--amber-dim)' : 'var(--rose-dim)',
                color: r.m === 'breakfast' ? 'var(--blue)' : r.m === 'lunch' ? 'var(--amber)' : 'var(--rose)',
              }}>{r.m}</span>
            </span>
            <span className="col-span-1" style={tm}>{r.t}</span>
            <span className="col-span-1 text-right font-bold" style={ac}>{r.c}</span>
            <span className="col-span-1 text-right" style={tm}>{r.p}g</span>
            <span className="col-span-1 text-right" style={tm}>{r.cb}g</span>
            <span className="col-span-1 text-right" style={{ color: 'var(--green)' }}>{r.s}/10</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AchievementsMockup() {
  return (
    <div style={{ fontFamily: 'Inter', fontSize: 11 }}>
      <div className="rounded-xl p-3 mb-3 text-center" style={card}>
        <span className="text-xl block">🔥</span>
        <p className="text-xl font-extrabold" style={{ ...H, ...tp }}>7</p>
        <p className="text-[10px]" style={ts}>day streak</p>
        <p className="text-[8px]" style={tm}>One week down, amazing!</p>
      </div>
      <div className="flex gap-1 mb-2.5">{['Today (3/5)', 'Badges (8/18)', 'Share'].map((t, i) => (
        <span key={t} className="px-2 py-1 rounded text-[8px] font-medium" style={i === 0 ? { background: 'var(--accent)', color: '#fff' } : { ...card, ...ts }}>{t}</span>
      ))}</div>
      {[{ t: 'Log 3 meals', i: '🍽️', p: 3, g: 3, d: true }, { t: 'Hit 120g protein', i: '🥩', p: 82, g: 120, d: false }, { t: 'Stay under 2,000 kcal', i: '🎯', p: 1245, g: 2000, d: false }, { t: '2 healthy meals (7+)', i: '🥗', p: 2, g: 2, d: true }].map(c => (
        <div key={c.t} className="rounded-lg p-2 mb-1.5" style={card}>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm">{c.i}</span>
            <span className="text-[9px] font-semibold flex-1" style={tp}>{c.t}</span>
            {c.d && <span className="text-[7px] font-bold px-1 rounded" style={{ background: 'var(--green-dim)', color: 'var(--green)' }}>DONE</span>}
            <span className="text-[8px] font-medium" style={c.d ? { color: 'var(--green)' } : tm}>{c.d ? '✓' : `${Math.min(c.p, c.g)}/${c.g}`}</span>
          </div>
          <div className="w-full h-1 rounded-full" style={{ background: 'var(--bg-card-hover)' }}><div className="h-full rounded-full" style={{ width: `${Math.min((c.p / c.g) * 100, 100)}%`, background: c.d ? 'var(--green)' : 'var(--accent)' }} /></div>
        </div>
      ))}
    </div>
  );
}

function RecipeMockup() {
  return (
    <div className="flex flex-col gap-1.5" style={{ fontFamily: 'Inter', fontSize: 11 }}>
      <div className="flex items-center gap-1.5 pb-2 mb-1" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="w-6 h-6 rounded-lg flex items-center justify-center text-[8px]" style={{ background: 'var(--accent-dim)' }}>✦</div>
        <div><p className="text-[10px] font-bold" style={{ ...H, ...tp }}>NourishLog Chat</p></div>
      </div>
      {([
        ['add recipe protein bowl 420 cal 35g protein 40g carbs 12g fat', 'u'],
        ['Saved custom recipe Protein Bowl! 🍳\n\n420 kcal · 35g protein · 40g carbs · 12g fat\n\nYou can now log it anytime by name.', 'a'],
        ['had protein bowl for lunch', 'u'],
        ['Logged Protein Bowl for lunch! ✅\n\n420 kcal · 35g protein · 40g carbs · 12g fat\nHealth Score: 7/10', 'a'],
        ['search paneer', 'u'],
        ['Found 6 matches:\n\n• Paneer Butter Masala — 380 kcal, 16g protein\n• Palak Paneer — 290 kcal, 16g protein\n• Paneer Tikka — 280 kcal, 18g protein\n• Kadai Paneer — 330 kcal, 16g protein\n• Shahi Paneer — 360 kcal, 16g protein\n• Matar Paneer — 300 kcal, 14g protein\n\nSay the dish name to log it.', 'a'],
      ] as [string, string][]).map(([text, role], i) => (
        <div key={i} className={`flex ${role === 'u' ? 'justify-end' : 'justify-start'}`}>
          <div className={`max-w-[85%] rounded-xl px-2.5 py-1.5 ${role === 'u' ? 'rounded-br-sm' : 'rounded-bl-sm'}`}
            style={role === 'u' ? { background: 'var(--accent)', color: '#fff' } : { ...card }}>
            {text.split('\n').map((line, j) => (
              <p key={j} className={`text-[9px] leading-relaxed ${j > 0 ? 'mt-0.5' : ''}`} style={role === 'a' ? ts : {}}>{line}</p>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
