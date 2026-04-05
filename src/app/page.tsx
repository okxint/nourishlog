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

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      {/* ─── NAV ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-strong">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 h-14">
          <span className="text-base font-bold tracking-tight" style={{ fontFamily: 'Sora, sans-serif' }}>
            nourish<span style={{ color: 'var(--accent)' }}>log</span>
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={toggle}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={14} style={{ color: 'var(--text-secondary)' }} /> : <Moon size={14} style={{ color: 'var(--text-secondary)' }} />}
            </button>
            <button onClick={() => router.push('/login')} className="px-4 py-1.5 rounded-lg text-xs font-semibold transition-all active:scale-95" style={{ background: 'var(--accent)', color: '#fff' }}>
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section className="pt-28 pb-8 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-6" style={{ border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
            <span className="text-[11px] font-medium" style={{ color: 'var(--text-secondary)' }}>500+ Indian dishes</span>
            <span className="text-xs">🇮🇳</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.08] tracking-tight mb-5" style={{ fontFamily: 'Sora, sans-serif' }}>
            Know exactly what<br />you&apos;re <span style={{ color: 'var(--accent)' }}>eating.</span>
          </h1>

          <p className="text-base sm:text-lg max-w-2xl mx-auto mb-8 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Type &ldquo;had biryani for lunch&rdquo;, snap a photo, or add your own recipes.
            Full calorie and macro breakdown for every meal — built for how India eats.
          </p>

          <div className="flex items-center justify-center gap-3 mb-4">
            <button
              onClick={() => router.push('/login')}
              className="group flex items-center gap-2 px-7 py-3 rounded-lg font-semibold text-sm transition-all active:scale-95"
              style={{ background: 'var(--accent)', color: '#fff' }}
            >
              Start Tracking — Free
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
            <button
              onClick={() => document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-sm font-medium transition-colors"
              style={{ color: 'var(--text-muted)' }}
            >
              See how it works ↓
            </button>
          </div>
          <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Free forever · No credit card · Works on any device</p>
        </div>
      </section>

      {/* ─── HERO MOCKUP — Web Dashboard ─── */}
      <section className="px-6 pb-16">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-xl overflow-hidden shadow-2xl" style={{ border: '1px solid var(--border)', background: 'var(--mockup-bg)' }}>
            {/* Browser chrome */}
            <div className="flex items-center gap-2 px-4 py-2.5" style={{ borderBottom: '1px solid var(--border)' }}>
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="px-4 py-1 rounded-md text-[10px] font-medium" style={{ background: 'var(--bg-card)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                  nourishlog.vercel.app/home
                </div>
              </div>
            </div>
            {/* Dashboard content */}
            <div className="flex" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              {/* Sidebar */}
              <div className="hidden md:flex flex-col w-44 p-3 gap-1" style={{ borderRight: '1px solid var(--border)' }}>
                <div className="flex items-center gap-2 px-2 py-1.5 mb-3">
                  <div className="w-5 h-5 rounded-md flex items-center justify-center" style={{ background: 'var(--accent)' }}>
                    <span className="text-[8px] text-white font-bold">N</span>
                  </div>
                  <span className="text-[11px] font-bold" style={{ fontFamily: 'Sora' }}>nourish<span style={{ color: 'var(--accent)' }}>log</span></span>
                </div>
                {['Home', 'Log', 'Chat', 'Dashboard', 'Profile'].map((t, i) => (
                  <div key={t} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px]" style={{
                    background: i === 0 ? 'var(--accent-dim)' : 'transparent',
                    color: i === 0 ? 'var(--accent)' : 'var(--text-muted)',
                    fontWeight: i === 0 ? 600 : 400,
                  }}>
                    {['🏠', '➕', '💬', '📊', '👤'][i]} {t}
                  </div>
                ))}
              </div>
              {/* Main area */}
              <div className="flex-1 p-4 sm:p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm font-bold" style={{ fontFamily: 'Sora', color: 'var(--text-primary)' }}>Good afternoon, Priya</p>
                    <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Sunday, 6 April 2026</p>
                  </div>
                  <div className="px-3 py-1.5 rounded-lg text-[10px] font-medium" style={{ background: 'var(--accent)', color: '#fff' }}>+ Log Meal</div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Ring */}
                  <div className="flex justify-center sm:justify-start flex-shrink-0">
                    <div className="relative" style={{ width: 140, height: 140 }}>
                      <svg width="140" height="140" viewBox="0 0 140 140" className="transform -rotate-90">
                        <circle cx="70" cy="70" r="56" fill="none" stroke="var(--bg-card-hover)" strokeWidth="8" />
                        <circle cx="70" cy="70" r="56" fill="none" stroke="var(--accent)" strokeWidth="8" strokeLinecap="round" strokeDasharray="352" strokeDashoffset="155" />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-extrabold" style={{ fontFamily: 'Sora', color: 'var(--text-primary)' }}>1,245</span>
                        <span className="text-[8px]" style={{ color: 'var(--text-muted)' }}>of 2,000 kcal</span>
                        <span className="text-[8px] font-semibold" style={{ color: 'var(--accent)' }}>755 left</span>
                      </div>
                    </div>
                  </div>

                  {/* Macros + Stats */}
                  <div className="flex-1 flex flex-col gap-2">
                    <div className="flex gap-2">
                      {[
                        { label: 'PROTEIN', val: '48g', goal: '120g', color: 'var(--blue)', pct: '40%' },
                        { label: 'CARBS', val: '156g', goal: '250g', color: 'var(--amber)', pct: '62%' },
                        { label: 'FAT', val: '38g', goal: '65g', color: 'var(--rose)', pct: '58%' },
                      ].map((m) => (
                        <div key={m.label} className="flex-1 rounded-lg p-2" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                          <div className="flex items-center gap-1 mb-1">
                            <div className="w-1.5 h-1.5 rounded-full" style={{ background: m.color }} />
                            <span className="text-[8px] font-semibold" style={{ color: 'var(--text-muted)', fontFamily: 'Space Grotesk' }}>{m.label}</span>
                          </div>
                          <span className="text-xs font-bold" style={{ color: m.color, fontFamily: 'Sora' }}>{m.val}</span>
                          <span className="text-[8px]" style={{ color: 'var(--text-muted)' }}> / {m.goal}</span>
                          <div className="w-full h-1 rounded-full mt-1" style={{ background: 'var(--bg-card-hover)' }}>
                            <div className="h-full rounded-full" style={{ width: m.pct, background: m.color }} />
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Meal cards */}
                    <div className="flex flex-col gap-1.5">
                      <p className="text-[9px] font-semibold" style={{ color: 'var(--text-secondary)', fontFamily: 'Sora' }}>Today&apos;s Meals</p>
                      {[
                        { name: 'Masala Dosa + Chutney', meal: 'Breakfast · 8:30 AM', cal: 280, score: 7, emoji: '🌅' },
                        { name: 'Chicken Biryani', meal: 'Lunch · 1:00 PM', cal: 490, score: 6, emoji: '☀️' },
                        { name: 'Dal Tadka + 2 Roti', meal: 'Dinner · 8:15 PM', cal: 330, score: 8, emoji: '🌙' },
                        { name: 'Chai + Biscuits', meal: 'Snack · 4:00 PM', cal: 145, score: 4, emoji: '🍿' },
                      ].map((m) => (
                        <div key={m.name} className="flex items-center gap-2 p-2 rounded-lg" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                          <div className="w-7 h-7 rounded-md flex items-center justify-center text-sm" style={{ background: 'var(--bg-elevated)' }}>{m.emoji}</div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{m.name}</p>
                            <p className="text-[8px]" style={{ color: 'var(--text-muted)' }}>{m.meal} · 💚 {m.score}/10</p>
                          </div>
                          <div className="text-right">
                            <span className="text-[11px] font-bold" style={{ color: 'var(--accent)', fontFamily: 'Sora' }}>{m.cal}</span>
                            <span className="text-[7px] block" style={{ color: 'var(--text-muted)' }}>kcal</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FEATURES ROW ─── */}
      <section className="py-12 px-6" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { title: 'Chat to log', desc: 'Type naturally — "had 2 rotis with dal for dinner"', icon: '💬' },
            { title: 'Photo scan', desc: 'Snap your plate, we identify and log everything', icon: '📸' },
            { title: 'Custom recipes', desc: 'Add your own dishes with exact macros', icon: '🍳' },
            { title: 'Weekly analytics', desc: 'Trends, macro splits, streaks, suggestions', icon: '📊' },
          ].map((f) => (
            <div key={f.title} className="text-center sm:text-left">
              <span className="text-2xl mb-2 block">{f.icon}</span>
              <h3 className="text-sm font-bold mb-1" style={{ fontFamily: 'Sora', color: 'var(--text-primary)' }}>{f.title}</h3>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── HOW IT WORKS — Web Screenshots ─── */}
      <section id="how" className="py-20 px-6" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[11px] font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--accent)', fontFamily: 'Space Grotesk' }}>How it works</p>
            <h2 className="text-3xl sm:text-4xl font-bold" style={{ fontFamily: 'Sora' }}>Three steps. That&apos;s it.</h2>
          </div>

          {/* Step 1 */}
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-14 mb-16">
            <div className="flex-1 order-2 lg:order-1">
              <span className="text-xs font-bold mb-2 block" style={{ color: 'var(--accent)', fontFamily: 'Space Grotesk' }}>01</span>
              <h3 className="text-xl font-bold mb-3" style={{ fontFamily: 'Sora' }}>Tell us what you ate</h3>
              <p className="leading-relaxed mb-3" style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
                No barcode scanning. No searching databases. Just type naturally — &ldquo;had 2 rotis with dal&rdquo; or &ldquo;chai and samosa at 4pm&rdquo;.
              </p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>Upload a photo from the Log tab, or send one in chat. We handle the rest.</p>
            </div>
            <div className="flex-1 order-1 lg:order-2">
              <WebMockup title="nourishlog.vercel.app/chat">
                <ChatMockupContent />
              </WebMockup>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-14 mb-16">
            <div className="flex-1">
              <WebMockup title="nourishlog.vercel.app/meal/biryani">
                <NutritionMockupContent />
              </WebMockup>
            </div>
            <div className="flex-1">
              <span className="text-xs font-bold mb-2 block" style={{ color: 'var(--accent)', fontFamily: 'Space Grotesk' }}>02</span>
              <h3 className="text-xl font-bold mb-3" style={{ fontFamily: 'Sora' }}>Full nutrition breakdown</h3>
              <p className="leading-relaxed mb-3" style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
                Every meal gets calories, protein, carbs, fat, fiber, micronutrients, and a health score out of 10.
              </p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
                We know a masala dosa is 280 kcal — not some generic &ldquo;pancake&rdquo; estimate.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-14">
            <div className="flex-1 order-2 lg:order-1">
              <span className="text-xs font-bold mb-2 block" style={{ color: 'var(--accent)', fontFamily: 'Space Grotesk' }}>03</span>
              <h3 className="text-xl font-bold mb-3" style={{ fontFamily: 'Sora' }}>Track patterns. Eat better.</h3>
              <p className="leading-relaxed mb-3" style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
                Weekly calorie trends, macro splits, most-eaten foods, streaks. See exactly where you stand.
              </p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
                Ask chat &ldquo;analyze my nutrition&rdquo; or &ldquo;compare dosa vs idli&rdquo; for instant insights.
              </p>
            </div>
            <div className="flex-1 order-1 lg:order-2">
              <WebMockup title="nourishlog.vercel.app/dashboard">
                <DashboardMockupContent />
              </WebMockup>
            </div>
          </div>
        </div>
      </section>

      {/* ─── WHAT YOU GET ─── */}
      <section className="py-16 px-6" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10" style={{ fontFamily: 'Sora' }}>Everything included. Free.</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              '500+ Indian dishes with accurate nutrition',
              'Chat-based food logging — just type what you ate',
              'Photo upload with food identification',
              'Add your own custom recipes and dishes',
              'Weekly calorie and macro trends',
              'Nutrition analysis with improvement tips',
              'Food comparison (dosa vs idli)',
              'Meal suggestions based on remaining macros',
              'Health score for every meal (1-10)',
              'Dark and light mode',
              'Works on desktop, tablet, and mobile',
              'No account needed — data stays in your browser',
            ].map((item) => (
              <div key={item} className="flex items-start gap-2.5 py-2">
                <div className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5" style={{ background: 'var(--green-dim)' }}>
                  <Check size={12} style={{ color: 'var(--green)' }} />
                </div>
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FOODS WE KNOW ─── */}
      <section className="py-16 px-6" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3" style={{ fontFamily: 'Sora' }}>We speak Indian food</h2>
          <p className="text-sm mb-8 max-w-md mx-auto" style={{ color: 'var(--text-muted)' }}>
            500+ dishes. Not a Western database guessing what &ldquo;curry&rdquo; means.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-3xl mx-auto">
            {[
              'Masala Dosa · 280', 'Idli Sambar · 195', 'Poha · 250', 'Biryani · 490',
              'Rajma Chawal · 410', 'Chole Bhature · 520', 'Butter Chicken · 438',
              'Palak Paneer · 290', 'Dal Rice · 380', 'Vada Pav · 290',
              'Pav Bhaji · 380', 'Samosa · 262', 'Tandoori Chicken · 260',
              'Fish Curry · 320', 'Dhokla · 160', 'Momos · 250',
              'Chai · 80', 'Filter Coffee · 90', 'Gulab Jamun · 175',
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

      {/* ─── CTA ─── */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ fontFamily: 'Sora' }}>
            Stop guessing.<br />Start knowing.
          </h2>
          <p className="mb-8 max-w-md mx-auto" style={{ color: 'var(--text-muted)' }}>
            10 seconds to set up. No credit card. No subscriptions.
          </p>
          <button
            onClick={() => router.push('/login')}
            className="group inline-flex items-center gap-2.5 px-8 py-3.5 rounded-lg font-semibold text-base transition-all active:scale-95"
            style={{ background: 'var(--accent)', color: '#fff' }}
          >
            Start Tracking — Free
            <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="py-6 px-6" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs font-semibold" style={{ fontFamily: 'Sora', color: 'var(--text-muted)' }}>
            nourish<span style={{ color: 'var(--accent)' }}>log</span>
          </span>
          <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Made in India, for India.</p>
        </div>
      </footer>
    </div>
  );
}

/* ─── Web Mockup (browser window, not phone) ─── */
function WebMockup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl overflow-hidden shadow-lg" style={{ border: '1px solid var(--border)', background: 'var(--mockup-bg)' }}>
      <div className="flex items-center gap-2 px-3 py-2" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="flex gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[#ff5f57]" />
          <div className="w-2 h-2 rounded-full bg-[#febc2e]" />
          <div className="w-2 h-2 rounded-full bg-[#28c840]" />
        </div>
        <div className="flex-1 flex justify-center">
          <span className="text-[9px] font-medium" style={{ color: 'var(--text-muted)' }}>{title}</span>
        </div>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function ChatMockupContent() {
  return (
    <div className="flex flex-col gap-2 text-[11px]" style={{ fontFamily: 'DM Sans' }}>
      <div className="self-start rounded-xl rounded-bl-sm px-3 py-2 max-w-[80%]" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Hey Priya! Tell me what you ate and I&apos;ll log it.</p>
      </div>
      <div className="self-end rounded-xl rounded-br-sm px-3 py-2 max-w-[75%]" style={{ background: 'var(--accent)', color: '#fff' }}>
        had chicken biryani for lunch
      </div>
      <div className="self-start rounded-xl rounded-bl-sm px-3 py-2 max-w-[85%]" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Logged <strong style={{ color: 'var(--text-primary)' }}>Chicken Biryani</strong> for lunch! ✅</p>
        <p className="mt-1" style={{ color: 'var(--text-muted)', fontSize: '10px' }}>490 kcal · 22g protein · 62g carbs · 18g fat · Score: 6/10</p>
      </div>
      <div className="self-end rounded-xl rounded-br-sm px-3 py-2 max-w-[75%]" style={{ background: 'var(--accent)', color: '#fff' }}>
        also had chai and 2 samosas
      </div>
      <div className="self-start rounded-xl rounded-bl-sm px-3 py-2 max-w-[85%]" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Logged <strong style={{ color: 'var(--text-primary)' }}>Chai</strong> (80 kcal) + <strong style={{ color: 'var(--text-primary)' }}>2x Samosa</strong> (524 kcal) ✅</p>
        <p className="mt-1" style={{ color: 'var(--text-muted)', fontSize: '10px' }}>1,094 kcal today. 906 remaining.</p>
      </div>
      <div className="self-end rounded-xl rounded-br-sm px-3 py-2 max-w-[75%]" style={{ background: 'var(--accent)', color: '#fff' }}>
        analyze my nutrition
      </div>
      <div className="self-start rounded-xl rounded-bl-sm px-3 py-2 max-w-[85%]" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Avg: <strong style={{ color: 'var(--text-primary)' }}>1,834 kcal/day</strong>. 28% protein, 44% carbs, 28% fat.</p>
        <p className="mt-1" style={{ color: 'var(--text-muted)', fontSize: '10px' }}>🥩 Low protein — add more dal, eggs, chicken ✅ Fiber is good</p>
      </div>
    </div>
  );
}

function NutritionMockupContent() {
  return (
    <div style={{ fontFamily: 'DM Sans' }}>
      <p className="text-sm font-bold" style={{ fontFamily: 'Sora', color: 'var(--text-primary)' }}>Chicken Biryani</p>
      <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>Lunch · 1:00 PM · 1 plate (300g)</p>
      <div className="flex items-center gap-2 mt-2 mb-3">
        <span className="text-xl font-extrabold" style={{ fontFamily: 'Sora', color: 'var(--accent)' }}>490</span>
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>kcal</span>
        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold" style={{ background: 'var(--green-dim)', color: 'var(--green)' }}>💚 6/10</span>
      </div>
      <div className="grid grid-cols-4 gap-2 mb-3">
        {[
          { label: 'Protein', val: '22g', color: 'var(--blue)' },
          { label: 'Carbs', val: '62g', color: 'var(--amber)' },
          { label: 'Fat', val: '18g', color: 'var(--rose)' },
          { label: 'Fiber', val: '3g', color: 'var(--green)' },
        ].map((m) => (
          <div key={m.label} className="rounded-lg p-2 text-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <span className="text-xs font-bold" style={{ color: m.color }}>{m.val}</span>
            <p className="text-[8px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{m.label}</p>
          </div>
        ))}
      </div>
      <div className="rounded-lg p-2" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <p className="text-[10px] font-bold mb-1" style={{ fontFamily: 'Sora', color: 'var(--text-primary)' }}>Micronutrients</p>
        {[['Iron', '20% DV'], ['Vitamin C', '8% DV'], ['Sodium', '720mg'], ['Calcium', '6% DV']].map(([l, v]) => (
          <div key={l} className="flex justify-between py-0.5 text-[9px]" style={{ borderBottom: '1px solid var(--border)' }}>
            <span style={{ color: 'var(--text-muted)' }}>{l}</span>
            <span style={{ color: 'var(--text-secondary)' }}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DashboardMockupContent() {
  return (
    <div style={{ fontFamily: 'DM Sans' }}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-bold" style={{ fontFamily: 'Sora', color: 'var(--text-primary)' }}>Dashboard</p>
        <span className="text-[10px] font-medium" style={{ color: 'var(--text-muted)' }}>This Week</span>
      </div>
      <div className="flex gap-2 mb-3">
        <div className="flex-1 rounded-lg p-2 text-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <p className="text-base font-extrabold" style={{ fontFamily: 'Sora', color: 'var(--accent)' }}>12,840</p>
          <p className="text-[8px]" style={{ color: 'var(--text-muted)' }}>TOTAL KCAL</p>
        </div>
        <div className="flex-1 rounded-lg p-2 text-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <p className="text-base font-extrabold" style={{ fontFamily: 'Sora', color: 'var(--text-primary)' }}>1,834</p>
          <p className="text-[8px]" style={{ color: 'var(--text-muted)' }}>DAILY AVG</p>
        </div>
      </div>
      {/* Bar chart */}
      <div className="rounded-lg p-2 mb-2" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <p className="text-[10px] font-bold mb-2" style={{ fontFamily: 'Sora', color: 'var(--text-primary)' }}>Weekly Calories</p>
        <div className="flex items-end justify-between h-14 gap-1">
          {[68, 82, 55, 90, 72, 78, 45].map((h, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
              <div className="w-full rounded-t" style={{ height: `${h}%`, background: i === 5 ? 'var(--accent)' : 'color-mix(in srgb, var(--accent) 35%, transparent)' }} />
              <span className="text-[7px]" style={{ color: i === 5 ? 'var(--accent)' : 'var(--text-muted)' }}>
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
              </span>
            </div>
          ))}
        </div>
      </div>
      {/* Stats */}
      <div className="grid grid-cols-4 gap-1.5">
        {[
          { icon: '🔥', label: 'Streak', val: '7 days' },
          { icon: '🍛', label: 'Top food', val: 'Dal Rice' },
          { icon: '📈', label: 'Peak', val: '2,430' },
          { icon: '💧', label: 'Water', val: '2.1L/d' },
        ].map((s) => (
          <div key={s.label} className="rounded-lg p-1.5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <span className="text-xs">{s.icon}</span>
            <p className="text-[7px]" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
            <p className="text-[9px] font-bold" style={{ color: 'var(--text-primary)' }}>{s.val}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
