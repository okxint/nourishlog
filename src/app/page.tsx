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

  const go = () => router.push('/login');

  return (
    <div style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>

      {/* ━━━ NAV ━━━ */}
      <nav className="fixed top-0 left-0 right-0 z-50" style={{ background: 'color-mix(in srgb, var(--bg-primary) 85%, transparent)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-[1120px] mx-auto flex items-center justify-between px-6 h-16">
          <span style={{ fontSize: 18, fontWeight: 700, fontFamily: 'Plus Jakarta Sans', letterSpacing: '-0.02em' }}>
            nourish<span style={{ color: 'var(--accent)' }}>log</span>
          </span>
          <div className="flex items-center gap-3">
            <button onClick={toggle} className="w-9 h-9 rounded-full flex items-center justify-center transition-colors" style={{ border: '1px solid var(--border)' }}>
              {theme === 'dark' ? <Sun size={15} style={{ color: 'var(--text-muted)' }} /> : <Moon size={15} style={{ color: 'var(--text-muted)' }} />}
            </button>
            <button onClick={go} style={{ background: 'var(--accent)', color: '#fff', padding: '8px 20px', borderRadius: 10, fontSize: 14, fontWeight: 600, fontFamily: 'Plus Jakarta Sans' }} className="hover:brightness-110 active:scale-[0.97] transition-all">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* ━━━ HERO ━━━ */}
      <section style={{ paddingTop: 160, paddingBottom: 40 }} className="px-6">
        <div className="max-w-[1120px] mx-auto text-center">
          {/* Pill */}
          <div className="inline-flex items-center gap-2 mb-8" style={{ padding: '6px 16px', borderRadius: 100, border: '1px solid var(--border)', background: 'var(--bg-card)', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }}>
            500+ dishes · IFCT data · Free
          </div>

          {/* Headline — the money shot */}
          <h1 style={{ fontSize: 'clamp(40px, 5.5vw, 72px)', fontWeight: 800, lineHeight: 1.08, letterSpacing: '-0.035em', fontFamily: 'Plus Jakarta Sans', marginBottom: 24 }}>
            Track what you eat.<br />
            <span style={{ color: 'var(--accent)' }}>In a chat.</span>
          </h1>

          {/* Subtext */}
          <p style={{ fontSize: 'clamp(16px, 1.8vw, 20px)', lineHeight: 1.6, color: 'var(--text-secondary)', maxWidth: 540, margin: '0 auto 40px', fontWeight: 400 }}>
            Type &ldquo;had biryani for lunch&rdquo; and get the full breakdown. Upload a plate photo. Add your own recipes. Built for how India eats.
          </p>

          {/* CTAs */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <button onClick={go} className="group hover:brightness-110 active:scale-[0.97] transition-all" style={{ background: 'var(--accent)', color: '#fff', padding: '14px 32px', borderRadius: 12, fontSize: 16, fontWeight: 600, fontFamily: 'Plus Jakarta Sans', display: 'flex', alignItems: 'center', gap: 8 }}>
              Start for Free <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
            <button onClick={() => document.getElementById('f1')?.scrollIntoView({ behavior: 'smooth' })} style={{ fontSize: 15, fontWeight: 500, color: 'var(--text-muted)' }} className="hover:text-[var(--text-secondary)] transition-colors">
              See features ↓
            </button>
          </div>

          <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>No credit card · No app to install · Data stays on your device</p>
        </div>
      </section>

      {/* ━━━ HERO PRODUCT SHOT ━━━ */}
      <section className="px-6" style={{ paddingBottom: 120 }}>
        <div className="max-w-[1000px] mx-auto">
          <div style={{ borderRadius: 16, overflow: 'hidden', boxShadow: '0 25px 80px rgba(0,0,0,0.12), 0 4px 20px rgba(0,0,0,0.06)', border: '1px solid var(--border)' }}>
            {/* Browser chrome */}
            <div className="flex items-center gap-2 px-4" style={{ height: 40, borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
              <div className="flex gap-2"><div className="w-3 h-3 rounded-full" style={{ background: '#FF5F56' }} /><div className="w-3 h-3 rounded-full" style={{ background: '#FFBD2E' }} /><div className="w-3 h-3 rounded-full" style={{ background: '#27C93F' }} /></div>
              <div className="flex-1 flex justify-center"><span style={{ fontSize: 11, color: 'var(--text-muted)', background: 'var(--bg-card)', padding: '3px 14px', borderRadius: 6, border: '1px solid var(--border)' }}>nourishlog.vercel.app</span></div>
            </div>
            {/* App content */}
            <div className="flex" style={{ background: 'var(--bg-primary)', fontFamily: 'Inter, sans-serif' }}>
              {/* Sidebar */}
              <div className="hidden md:flex flex-col" style={{ width: 200, padding: 16, borderRight: '1px solid var(--border)', gap: 2 }}>
                <div className="flex items-center gap-2 mb-4 px-2"><div className="w-6 h-6 rounded-md" style={{ background: 'var(--accent)' }} /><span style={{ fontSize: 13, fontWeight: 700, fontFamily: 'Plus Jakarta Sans' }}>nourish<span style={{ color: 'var(--accent)' }}>log</span></span></div>
                {['🏠 Home', '➕ Log', '💬 Chat', '📊 Dashboard', '🏆 Achievements'].map((t, i) => (
                  <div key={t} style={{ padding: '8px 10px', borderRadius: 8, fontSize: 13, fontWeight: i === 0 ? 600 : 400, background: i === 0 ? 'var(--accent-dim)' : 'transparent', color: i === 0 ? 'var(--accent)' : 'var(--text-muted)' }}>{t}</div>
                ))}
              </div>
              {/* Main */}
              <div className="flex-1" style={{ padding: 24 }}>
                <div className="flex justify-between items-start" style={{ marginBottom: 20 }}>
                  <div><p style={{ fontSize: 16, fontWeight: 700, fontFamily: 'Plus Jakarta Sans' }}>Good afternoon, Priya</p><p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Sunday, 6 April 2026</p></div>
                  <div style={{ background: 'var(--accent)', color: '#fff', padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600 }}>+ Log Meal</div>
                </div>
                <div className="flex flex-col sm:flex-row" style={{ gap: 20 }}>
                  {/* Ring */}
                  <div className="flex-shrink-0 flex justify-center">
                    <div className="relative" style={{ width: 160, height: 160 }}>
                      <svg width="160" height="160" viewBox="0 0 160 160" className="transform -rotate-90">
                        <circle cx="80" cy="80" r="64" fill="none" stroke="var(--bg-card-hover)" strokeWidth="10" />
                        <circle cx="80" cy="80" r="64" fill="none" stroke="var(--accent)" strokeWidth="10" strokeLinecap="round" strokeDasharray="402" strokeDashoffset="175" />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span style={{ fontSize: 28, fontWeight: 800, fontFamily: 'Plus Jakarta Sans' }}>1,245</span>
                        <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>of 2,000 kcal</span>
                        <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--accent)' }}>755 left</span>
                      </div>
                    </div>
                  </div>
                  {/* Right side */}
                  <div className="flex-1 flex flex-col" style={{ gap: 8 }}>
                    <div className="flex" style={{ gap: 8 }}>
                      {[{ l: 'Protein', v: '48g', g: '120g', c: 'var(--blue)', p: '40%' }, { l: 'Carbs', v: '156g', g: '250g', c: 'var(--amber)', p: '62%' }, { l: 'Fat', v: '38g', g: '65g', c: 'var(--rose)', p: '58%' }].map(m => (
                        <div key={m.l} className="flex-1" style={{ padding: 10, borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
                          <div className="flex items-center gap-1" style={{ marginBottom: 4 }}><div className="rounded-full" style={{ width: 6, height: 6, background: m.c }} /><span style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{m.l}</span></div>
                          <span style={{ fontSize: 15, fontWeight: 700, color: m.c, fontFamily: 'Plus Jakarta Sans' }}>{m.v}</span><span style={{ fontSize: 10, color: 'var(--text-muted)' }}> / {m.g}</span>
                          <div style={{ width: '100%', height: 3, borderRadius: 2, background: 'var(--bg-card-hover)', marginTop: 4 }}><div style={{ height: '100%', borderRadius: 2, width: m.p, background: m.c }} /></div>
                        </div>
                      ))}
                    </div>
                    {/* Meal cards */}
                    {[{ n: 'Masala Dosa + Chutney', m: 'Breakfast · 8:30 AM', c: 166, s: 7, e: '🌅' }, { n: 'Chicken Biryani', m: 'Lunch · 1:00 PM', c: 430, s: 6, e: '☀️' }, { n: 'Dal Tadka + 2 Roti', m: 'Dinner · 8:15 PM', c: 358, s: 8, e: '🌙' }, { n: 'Chai + Biscuits', m: 'Snack · 4:00 PM', c: 120, s: 4, e: '🍿' }].map(f => (
                      <div key={f.n} className="flex items-center" style={{ gap: 10, padding: 10, borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
                        <div style={{ width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-elevated)', fontSize: 16 }}>{f.e}</div>
                        <div className="flex-1 min-w-0"><p style={{ fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.n}</p><p style={{ fontSize: 10, color: 'var(--text-muted)' }}>{f.m} · 💚 {f.s}/10</p></div>
                        <div className="text-right"><span style={{ fontSize: 14, fontWeight: 700, color: 'var(--accent)', fontFamily: 'Plus Jakarta Sans' }}>{f.c}</span><span style={{ fontSize: 8, color: 'var(--text-muted)', display: 'block' }}>kcal</span></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ FEATURE SECTIONS ━━━ */}
      {[
        {
          id: 'f1', label: '01', title: 'Log by chatting', desc: 'Type "had 2 rotis with dal for dinner". We parse quantities, detect meal type, and log it with full IFCT nutrition. No forms, no dropdowns.',
          bullets: ['Natural language — "chai and samosa at 4pm"', 'Auto-detects breakfast/lunch/dinner from time', '"Analyze my nutrition" for weekly insights', '"Compare dosa vs idli" side by side', 'Upload photos in chat too'],
          mockup: 'chat',
        },
        {
          label: '02', title: 'Upload or search', desc: 'Snap a photo or pick from gallery — we identify it. Or search across 500+ dishes, tap a recent food, or quick-add chai, roti, eggs.',
          bullets: ['Camera and gallery upload', 'Search 500+ IFCT-sourced dishes', 'Recent foods for one-tap logging', 'Quick-add grid: chai, roti, dal, idli, eggs, rice', 'Meal type selector auto-set by time'],
          mockup: 'log',
        },
        {
          label: '03', title: 'Full nutrition breakdown', desc: 'Every meal gets IFCT-sourced calories, protein, carbs, fat, fiber, micronutrients, and a health score. Think a value is wrong? Edit any field inline.',
          bullets: ['Sourced from IFCT / NIN Hyderabad', 'Macro rings with daily value %', 'Edit calories, protein, carbs, fat, fiber', 'Micronutrients: iron, calcium, vitamin C, sodium', 'Health score 1-10'],
          mockup: 'nutrition',
        },
        {
          label: '04', title: 'Filter everything. Export anything.', desc: 'Filter by date range (today/week/month/custom), meal type, or food name. Click any chart bar to drill into that day. Export as CSV.',
          bullets: ['Date range with week navigation arrows', 'Meal type filter + food search', 'Clickable chart bars to select dates', 'Full meal history table with all columns', 'CSV export: date × meal grid with calories'],
          mockup: 'dashboard',
        },
        {
          label: '05', title: 'Streaks, challenges, badges', desc: 'Daily challenges like "hit protein goal" and "log 3 meals". 18 badges to unlock. Share your stats or weekly recap on WhatsApp.',
          bullets: ['5 daily challenges with progress bars', '18 achievement badges', 'Streak counter with milestones', 'Share formatted stats with friends', 'Weekly recap generator'],
          mockup: 'achievements',
        },
        {
          label: '06', title: 'Your recipes, your macros', desc: 'Say "add recipe protein bowl 420 cal 35g protein 40g carbs 12g fat" — saved permanently. Log it by name anytime after.',
          bullets: ['Add via chat with natural language', 'Exact calorie and macro control', 'Persists permanently', 'Sits alongside the 500+ dish database', 'Search custom foods like any other'],
          mockup: 'recipe',
        },
      ].map((f, fi) => (
        <section key={f.label} id={f.id} style={{ paddingTop: 100, paddingBottom: 100, background: fi % 2 === 1 ? 'var(--bg-secondary)' : 'var(--bg-primary)' }} className="px-6">
          <div className={`max-w-[1120px] mx-auto flex flex-col lg:flex-row items-start gap-16 ${fi % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
            <div className="flex-1 lg:pt-8">
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)', fontFamily: 'JetBrains Mono', letterSpacing: '0.05em' }}>{f.label}</span>
              <h2 style={{ fontSize: 'clamp(28px, 3vw, 40px)', fontWeight: 700, lineHeight: 1.15, letterSpacing: '-0.025em', fontFamily: 'Plus Jakarta Sans', marginTop: 8, marginBottom: 16 }}>{f.title}</h2>
              <p style={{ fontSize: 16, lineHeight: 1.7, color: 'var(--text-secondary)', marginBottom: 24 }}>{f.desc}</p>
              <ul className="flex flex-col gap-3">
                {f.bullets.map(b => (
                  <li key={b} className="flex items-start gap-3" style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
                    <Check size={16} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--green)' }} /> {b}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex-1 w-full">
              <MockupFrame>{getMockup(f.mockup)}</MockupFrame>
            </div>
          </div>
        </section>
      ))}

      {/* ━━━ FOOD DATABASE ━━━ */}
      <section style={{ paddingTop: 100, paddingBottom: 100, background: 'var(--bg-secondary)' }} className="px-6">
        <div className="max-w-[800px] mx-auto text-center">
          <h2 style={{ fontSize: 'clamp(28px, 3vw, 40px)', fontWeight: 700, letterSpacing: '-0.025em', fontFamily: 'Plus Jakarta Sans', marginBottom: 8 }}>500+ dishes. Real Indian food.</h2>
          <p style={{ fontSize: 15, color: 'var(--text-muted)', marginBottom: 32 }}>South Indian, North Indian, street food, Mughlai, Bengali, Gujarati, desserts, drinks — nutrition from IFCT.</p>
          <div className="flex flex-wrap justify-center" style={{ gap: 6 }}>
            {['Masala Dosa · 166', 'Idli · 39', 'Poha · 180', 'Biryani · 430', 'Rajma Chawal · 350', 'Chole Bhature · 450', 'Butter Chicken · 250', 'Palak Paneer · 230', 'Dal Rice · 300', 'Vada Pav · 290', 'Samosa · 155', 'Tandoori Chicken · 220', 'Chai · 60', 'Roti · 104', 'Pav Bhaji · 320', 'Momos · 200', 'Dhokla · 130', 'Gulab Jamun · 150', 'Filter Coffee · 75', 'Naan · 260'].map(item => {
              const [n, c] = item.split(' · ');
              return <span key={item} style={{ padding: '5px 12px', borderRadius: 8, fontSize: 12, background: 'var(--bg-card)', border: '1px solid var(--border)' }}><span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{n}</span> <span style={{ color: 'var(--text-muted)' }}>{c}</span></span>;
            })}
          </div>
        </div>
      </section>

      {/* ━━━ EVERYTHING INCLUDED ━━━ */}
      <section style={{ paddingTop: 100, paddingBottom: 100 }} className="px-6">
        <div className="max-w-[960px] mx-auto">
          <h2 className="text-center" style={{ fontSize: 'clamp(28px, 3vw, 40px)', fontWeight: 700, letterSpacing: '-0.025em', fontFamily: 'Plus Jakarta Sans', marginBottom: 48 }}>Everything included. Free.</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" style={{ gap: 8 }}>
            {[
              '500+ dishes — IFCT nutrition data', 'Chat-based logging', 'Photo upload — camera or gallery',
              'Custom recipes', 'Edit any nutrition value', 'Calorie ring + macro badges',
              'Health score 1-10', 'Micronutrient breakdown', 'Dashboard with filters',
              'Date range / meal type / food search', 'Click chart bars to drill in', 'CSV export',
              'Daily challenges', '18 achievement badges', 'Streak tracking',
              'Share stats on WhatsApp', 'Weekly recap', 'Water tracking',
              'Meal suggestions', 'Food comparison', 'Quantity support (2 rotis)',
              'Search 500+ dishes', 'Quick-add grid', 'Dark and light mode',
              'Desktop + mobile', 'No app install needed', 'Data stays on device', 'Completely free',
            ].map(item => (
              <div key={item} className="flex items-center gap-3" style={{ padding: '8px 0' }}>
                <Check size={15} style={{ color: 'var(--green)', flexShrink: 0 }} />
                <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ CTA ━━━ */}
      <section style={{ paddingTop: 120, paddingBottom: 120, background: 'var(--bg-secondary)' }} className="px-6">
        <div className="max-w-[600px] mx-auto text-center">
          <h2 style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.03em', fontFamily: 'Plus Jakarta Sans', marginBottom: 16 }}>
            You know what you ate.<br /><span style={{ color: 'var(--accent)' }}>Now know what&apos;s in it.</span>
          </h2>
          <p style={{ fontSize: 16, color: 'var(--text-muted)', marginBottom: 32 }}>10 seconds to set up. Free forever.</p>
          <button onClick={go} className="group hover:brightness-110 active:scale-[0.97] transition-all" style={{ background: 'var(--accent)', color: '#fff', padding: '16px 40px', borderRadius: 12, fontSize: 17, fontWeight: 700, fontFamily: 'Plus Jakarta Sans', display: 'inline-flex', alignItems: 'center', gap: 10 }}>
            Start Tracking <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* ━━━ FOOTER ━━━ */}
      <footer className="px-6" style={{ padding: '24px 0', borderTop: '1px solid var(--border)' }}>
        <div className="max-w-[1120px] mx-auto flex items-center justify-between px-6">
          <span style={{ fontSize: 13, fontWeight: 700, fontFamily: 'Plus Jakarta Sans', color: 'var(--text-muted)' }}>nourish<span style={{ color: 'var(--accent)' }}>log</span></span>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Made in India.</span>
        </div>
      </footer>
    </div>
  );
}

/* ━━━ Mockup Frame ━━━ */
function MockupFrame({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ borderRadius: 14, overflow: 'hidden', border: '1px solid var(--border)', boxShadow: '0 20px 60px rgba(0,0,0,0.08)', background: 'var(--bg-card)' }}>
      <div className="flex items-center gap-2 px-4" style={{ height: 36, borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
        <div className="flex gap-1.5"><div className="w-2.5 h-2.5 rounded-full" style={{ background: '#FF5F56' }} /><div className="w-2.5 h-2.5 rounded-full" style={{ background: '#FFBD2E' }} /><div className="w-2.5 h-2.5 rounded-full" style={{ background: '#27C93F' }} /></div>
      </div>
      <div style={{ padding: 20, background: 'var(--bg-primary)' }}>{children}</div>
    </div>
  );
}

/* ━━━ Mockup Contents ━━━ */
const h = { fontFamily: 'Plus Jakarta Sans' };
const m = { fontFamily: 'JetBrains Mono' };
const tp = { color: 'var(--text-primary)' };
const ts = { color: 'var(--text-secondary)' };
const tm = { color: 'var(--text-muted)' };
const ac = { color: 'var(--accent)' };
const cd = { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10 };

function getMockup(type: string) {
  switch (type) {
    case 'chat': return <ChatM />;
    case 'log': return <LogM />;
    case 'nutrition': return <NutritionM />;
    case 'dashboard': return <DashboardM />;
    case 'achievements': return <AchievementsM />;
    case 'recipe': return <RecipeM />;
    default: return null;
  }
}

function Msg({ text, isUser }: { text: string; isUser?: boolean }) {
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div style={{ maxWidth: '82%', padding: '8px 12px', borderRadius: 14, ...(isUser ? { background: 'var(--accent)', color: '#fff', borderBottomRightRadius: 4 } : { ...cd, borderBottomLeftRadius: 4 }) }}>
        {text.split('\n').map((l, i) => <p key={i} style={{ fontSize: 12, lineHeight: 1.5, ...(!isUser ? ts : {}), marginTop: i > 0 ? 4 : 0 }}>{l}</p>)}
      </div>
    </div>
  );
}

function ChatM() {
  return (
    <div className="flex flex-col" style={{ gap: 8, fontSize: 12 }}>
      <Msg text="Hey Priya! Tell me what you ate." />
      <Msg text="had chicken biryani for lunch" isUser />
      <Msg text={'Logged Chicken Biryani for lunch! ✅\n430 kcal · 25g protein · 52g carbs · 14g fat\nHealth Score: 6/10'} />
      <Msg text="also had chai and 2 samosas" isUser />
      <Msg text={'Logged Chai (60 kcal) + 2x Samosa (310 kcal) ✅\n800 kcal today. 1,200 remaining.'} />
      <Msg text="analyze my nutrition" isUser />
      <Msg text={'Avg: 1,680 kcal/day. 30% protein, 42% carbs, 28% fat.\n🥩 Protein on track ✅\n🌿 Low fiber — add more dal, veggies'} />
    </div>
  );
}

function LogM() {
  return (
    <div style={{ fontSize: 12 }}>
      <p style={{ fontSize: 15, fontWeight: 700, ...h, marginBottom: 4 }}>Log Meal</p>
      <div className="flex" style={{ gap: 6, marginBottom: 12 }}>{['Breakfast', 'Lunch', 'Dinner', 'Snack'].map((t, i) => (
        <span key={t} style={{ padding: '5px 12px', borderRadius: 8, fontSize: 11, fontWeight: 600, ...(i === 1 ? { background: 'var(--accent)', color: '#fff' } : { ...cd, ...ts }) }}>{t}</span>
      ))}</div>
      <div className="flex flex-col sm:flex-row" style={{ gap: 12 }}>
        <div className="flex-1">
          <div style={{ padding: 24, borderRadius: 12, border: '2px dashed var(--border)', textAlign: 'center' }}>
            <span style={{ fontSize: 28 }}>📸</span>
            <p style={{ fontSize: 11, ...ts, marginTop: 4 }}>Snap or upload</p>
          </div>
          <div className="flex" style={{ gap: 6, marginTop: 8 }}>
            <span className="flex-1 text-center" style={{ padding: '7px 0', borderRadius: 8, fontSize: 11, fontWeight: 600, background: 'var(--accent)', color: '#fff' }}>📷 Take Photo</span>
            <span className="flex-1 text-center" style={{ padding: '7px 0', borderRadius: 8, fontSize: 11, background: 'var(--bg-card)', border: '1px solid var(--border)', ...ts }}>🖼 Gallery</span>
          </div>
        </div>
        <div className="flex-1">
          <div style={{ ...cd, padding: '7px 10px', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}><span style={tm}>🔍</span><span style={{ ...tm, fontSize: 11 }}>e.g. &quot;chicken biryani&quot;</span></div>
          <p style={{ fontSize: 9, fontWeight: 700, ...m, ...tm, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Quick Add</p>
          <div className="grid grid-cols-4" style={{ gap: 6 }}>
            {[{ n: 'Chai', e: '☕', c: 60 }, { n: 'Roti', e: '🫓', c: 104 }, { n: 'Dal', e: '🥣', c: 150 }, { n: 'Rice', e: '🍚', c: 130 }, { n: 'Eggs', e: '🥚', c: 155 }, { n: 'Idli', e: '🫓', c: 39 }, { n: 'Banana', e: '🍌', c: 105 }, { n: 'Water', e: '💧', c: 0 }].map(i => (
              <div key={i.n} style={{ ...cd, padding: 6, textAlign: 'center' }}><span style={{ fontSize: 18 }}>{i.e}</span><p style={{ fontSize: 9, ...ts }}>{i.n}</p><p style={{ fontSize: 8, ...tm }}>{i.c}</p></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function NutritionM() {
  return (
    <div style={{ fontSize: 12 }}>
      <div className="flex justify-between" style={{ marginBottom: 8 }}><span style={{ ...tm, fontSize: 11 }}>← Meal Details</span><span style={{ ...cd, padding: '3px 10px', fontSize: 10, ...ts }}>✏️ Edit</span></div>
      <p style={{ fontSize: 16, fontWeight: 700, ...h }}>Chicken Biryani</p>
      <p style={{ fontSize: 11, ...tm, marginTop: 2 }}>Lunch · 1:00 PM · 1 plate</p>
      <div className="flex items-center" style={{ gap: 10, marginTop: 10, marginBottom: 14 }}>
        <span style={{ fontSize: 28, fontWeight: 800, ...h, ...ac }}>430</span><span style={{ ...tm }}>kcal</span>
        <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 10, fontWeight: 700, background: 'var(--green-dim)', color: 'var(--green)' }}>💚 6/10</span>
      </div>
      <div style={{ ...cd, padding: 12, marginBottom: 8 }}>
        <p style={{ fontSize: 12, fontWeight: 700, ...h, marginBottom: 10 }}>Nutrition</p>
        <div className="grid grid-cols-4" style={{ gap: 8 }}>
          {[{ l: 'Protein', v: '25g', c: 'var(--blue)', p: 56 }, { l: 'Carbs', v: '52g', c: 'var(--amber)', p: 62 }, { l: 'Fat', v: '14g', c: 'var(--rose)', p: 72 }, { l: 'Fiber', v: '3g', c: 'var(--green)', p: 28 }].map(n => (
            <div key={n.l} className="text-center">
              <div className="relative mx-auto" style={{ width: 44, height: 44, marginBottom: 4 }}><svg width="44" height="44" viewBox="0 0 44 44" className="-rotate-90"><circle cx="22" cy="22" r="18" fill="none" stroke="var(--bg-card-hover)" strokeWidth="3.5" /><circle cx="22" cy="22" r="18" fill="none" stroke={n.c} strokeWidth="3.5" strokeLinecap="round" strokeDasharray="113" strokeDashoffset={113 * (1 - n.p / 100)} /></svg><div className="absolute inset-0 flex items-center justify-center"><span style={{ fontSize: 10, fontWeight: 700, color: n.c }}>{n.v}</span></div></div>
              <p style={{ fontSize: 9, ...tm, ...m }}>{n.l}</p>
            </div>
          ))}
        </div>
      </div>
      <div style={{ ...cd, padding: 12 }}>
        <p style={{ fontSize: 12, fontWeight: 700, ...h, marginBottom: 6 }}>Micronutrients</p>
        {[['Iron', '20% DV'], ['Vitamin C', '8% DV'], ['Calcium', '6% DV'], ['Sodium', '680mg']].map(([l, v]) => (
          <div key={l} className="flex justify-between" style={{ padding: '4px 0', borderBottom: '1px solid var(--border)', fontSize: 11 }}><span style={tm}>{l}</span><span style={ts}>{v}</span></div>
        ))}
        <p style={{ fontSize: 9, ...tm, marginTop: 6 }}>Source: IFCT. <span style={ac}>Edit if incorrect →</span></p>
      </div>
    </div>
  );
}

function DashboardM() {
  return (
    <div style={{ fontSize: 12 }}>
      <div className="flex justify-between items-center" style={{ marginBottom: 8 }}>
        <p style={{ fontSize: 15, fontWeight: 700, ...h }}>Dashboard</p>
        <div className="flex" style={{ gap: 4 }}><span style={{ padding: '3px 8px', borderRadius: 6, fontSize: 9, background: 'var(--accent-dim)', ...ac, fontWeight: 600 }}>⚙ Filters</span><span style={{ ...cd, padding: '3px 8px', fontSize: 9, ...ts }}>📥 CSV</span></div>
      </div>
      <div className="flex items-center" style={{ gap: 4, marginBottom: 6 }}>
        {['Today', 'Week', 'Month', 'Custom'].map((r, i) => <span key={r} style={{ padding: '3px 8px', borderRadius: 6, fontSize: 9, fontWeight: 600, ...(i === 1 ? { background: 'var(--accent)', color: '#fff' } : { ...tm }) }}>{r}</span>)}
        <span style={{ fontSize: 10, ...tm, marginLeft: 4 }}>‹ This Week ›</span>
      </div>
      {/* Filters open */}
      <div style={{ ...cd, padding: 8, marginBottom: 8, display: 'flex', gap: 12 }}>
        <div className="flex-1"><p style={{ fontSize: 8, fontWeight: 700, ...m, ...tm, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>Meal Type</p><div className="flex" style={{ gap: 3 }}>{['All', 'BF', 'Lunch', 'Dinner', 'Snack'].map((t, i) => <span key={t} style={{ padding: '2px 6px', borderRadius: 4, fontSize: 8, ...(i === 2 ? { background: 'var(--accent)', color: '#fff' } : { background: 'var(--bg-elevated)', ...ts }) }}>{t}</span>)}</div></div>
        <div className="flex-1"><p style={{ fontSize: 8, fontWeight: 700, ...m, ...tm, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>Food Search</p><div style={{ ...cd, padding: '2px 6px', fontSize: 9 }}><span style={tm}>🔍 biryani</span></div></div>
      </div>
      {/* Summary */}
      <div className="flex" style={{ gap: 6, marginBottom: 8 }}>
        {[{ v: '3,920', l: 'TOTAL', isAc: true }, { v: '1,960', l: 'AVG' }, { v: '8', l: 'MEALS' }, { v: '4', l: 'DAYS' }].map(s => (
          <div key={s.l} className="flex-1 text-center" style={{ ...cd, padding: 6 }}><p style={{ fontSize: 13, fontWeight: 800, ...h, ...(s.isAc ? ac : tp) }}>{s.v}</p><p style={{ fontSize: 7, fontWeight: 700, ...m, ...tm, textTransform: 'uppercase' }}>{s.l}</p></div>
        ))}
      </div>
      {/* Chart + donut */}
      <div className="flex" style={{ gap: 8, marginBottom: 8 }}>
        <div className="flex-[2]" style={{ ...cd, padding: 8 }}>
          <p style={{ fontSize: 10, fontWeight: 700, ...h, marginBottom: 6 }}>Calories (lunch)</p>
          <div className="flex items-end justify-between" style={{ height: 48, gap: 3 }}>{[0, 430, 0, 450, 0, 410, 0].map((v, i) => (
            <div key={i} className="flex-1 flex flex-col items-center" style={{ gap: 2 }}><div style={{ width: '100%', borderRadius: '3px 3px 0 0', height: v ? `${(v / 450) * 100}%` : '4%', background: v ? (i === 3 ? 'var(--blue)' : 'color-mix(in srgb, var(--accent) 40%, transparent)') : 'var(--bg-card-hover)' }} /><span style={{ fontSize: 7, ...(i === 3 ? { color: 'var(--blue)' } : tm) }}>{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</span></div>
          ))}</div>
        </div>
        <div className="flex-1" style={{ ...cd, padding: 8 }}>
          <p style={{ fontSize: 10, fontWeight: 700, ...h, marginBottom: 4 }}>Macros</p>
          <div className="flex items-center" style={{ gap: 6 }}>
            <svg width="42" height="42" viewBox="0 0 42 42"><circle cx="21" cy="21" r="15" fill="none" stroke="var(--blue)" strokeWidth="5" strokeDasharray="28 66" transform="rotate(-90 21 21)" /><circle cx="21" cy="21" r="15" fill="none" stroke="var(--amber)" strokeWidth="5" strokeDasharray="40 54" strokeDashoffset="-28" transform="rotate(-90 21 21)" /><circle cx="21" cy="21" r="15" fill="none" stroke="var(--rose)" strokeWidth="5" strokeDasharray="26 68" strokeDashoffset="-68" transform="rotate(-90 21 21)" /></svg>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>{[{ l: 'P', p: '30%', c: 'var(--blue)' }, { l: 'C', p: '42%', c: 'var(--amber)' }, { l: 'F', p: '28%', c: 'var(--rose)' }].map(x => <div key={x.l} className="flex items-center" style={{ gap: 3 }}><div style={{ width: 5, height: 5, borderRadius: '50%', background: x.c }} /><span style={{ fontSize: 8, ...ts }}>{x.l}</span><span style={{ fontSize: 8, fontWeight: 700, color: x.c }}>{x.p}</span></div>)}</div>
          </div>
        </div>
      </div>
      {/* Table */}
      <div style={{ ...cd, overflow: 'hidden' }}>
        <div style={{ padding: '4px 8px', background: 'var(--bg-elevated)', fontSize: 10, fontWeight: 700, ...h }}>▾ Meal History</div>
        {[{ d: 'Sun', n: 'Chicken Biryani', t: 'lunch', c: 430 }, { d: 'Sun', n: 'Masala Dosa', t: 'breakfast', c: 166 }, { d: 'Sat', n: 'Dal + 2 Roti', t: 'dinner', c: 358 }, { d: 'Sat', n: 'Samosa x2', t: 'snack', c: 310 }].map((r, i) => (
          <div key={i} className="flex items-center" style={{ padding: '4px 8px', borderBottom: '1px solid var(--border)', fontSize: 10, gap: 6 }}>
            <span style={{ width: 28, ...tm, fontSize: 9 }}>{r.d}</span>
            <span className="flex-1 truncate" style={{ fontWeight: 500, ...tp }}>{r.n}</span>
            <span style={{ padding: '1px 5px', borderRadius: 4, fontSize: 8, fontWeight: 600, background: r.t === 'breakfast' ? 'var(--blue-dim)' : r.t === 'lunch' ? 'var(--amber-dim)' : r.t === 'dinner' ? 'var(--rose-dim)' : 'var(--green-dim)', color: r.t === 'breakfast' ? 'var(--blue)' : r.t === 'lunch' ? 'var(--amber)' : r.t === 'dinner' ? 'var(--rose)' : 'var(--green)' }}>{r.t}</span>
            <span style={{ fontWeight: 700, ...ac, width: 30, textAlign: 'right' }}>{r.c}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AchievementsM() {
  return (
    <div style={{ fontSize: 12 }}>
      <div style={{ ...cd, padding: 16, textAlign: 'center', marginBottom: 10 }}>
        <span style={{ fontSize: 24 }}>🔥</span>
        <p style={{ fontSize: 24, fontWeight: 800, ...h }}>7</p>
        <p style={{ fontSize: 12, ...ts }}>day streak</p>
      </div>
      <div className="flex" style={{ gap: 4, marginBottom: 10 }}>{['Today (3/5)', 'Badges (8/18)', 'Share'].map((t, i) => <span key={t} style={{ padding: '4px 10px', borderRadius: 8, fontSize: 10, fontWeight: 600, ...(i === 0 ? { background: 'var(--accent)', color: '#fff' } : { ...cd, ...ts }) }}>{t}</span>)}</div>
      {[{ t: 'Log 3 meals', i: '🍽️', p: 3, g: 3, d: true }, { t: 'Hit 120g protein', i: '🥩', p: 82, g: 120, d: false }, { t: 'Stay under budget', i: '🎯', p: 800, g: 2000, d: false }, { t: '2 healthy meals', i: '🥗', p: 2, g: 2, d: true }].map(c => (
        <div key={c.t} style={{ ...cd, padding: 10, marginBottom: 6 }}>
          <div className="flex items-center" style={{ gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: 16 }}>{c.i}</span>
            <span className="flex-1" style={{ fontSize: 11, fontWeight: 600 }}>{c.t}</span>
            {c.d && <span style={{ fontSize: 8, fontWeight: 700, padding: '2px 6px', borderRadius: 4, background: 'var(--green-dim)', color: 'var(--green)' }}>DONE</span>}
          </div>
          <div style={{ width: '100%', height: 4, borderRadius: 2, background: 'var(--bg-card-hover)' }}><div style={{ height: '100%', borderRadius: 2, width: `${Math.min((c.p / c.g) * 100, 100)}%`, background: c.d ? 'var(--green)' : 'var(--accent)' }} /></div>
        </div>
      ))}
    </div>
  );
}

function RecipeM() {
  return (
    <div className="flex flex-col" style={{ gap: 8, fontSize: 12 }}>
      <Msg text="add recipe protein bowl 420 cal 35g protein 40g carbs 12g fat" isUser />
      <Msg text={'Saved custom recipe Protein Bowl! 🍳\n420 kcal · 35g protein · 40g carbs · 12g fat\nLog it anytime by name.'} />
      <Msg text="had protein bowl for lunch" isUser />
      <Msg text={'Logged Protein Bowl for lunch! ✅\n420 kcal · 35g protein · 40g carbs · 12g fat\nHealth Score: 7/10'} />
      <Msg text="search paneer" isUser />
      <Msg text={'Found 6 matches:\n• Paneer Butter Masala — 330 kcal\n• Palak Paneer — 230 kcal\n• Paneer Tikka — 220 kcal\n• Kadai Paneer — 280 kcal\n• Shahi Paneer — 300 kcal\n• Matar Paneer — 250 kcal'} />
    </div>
  );
}
