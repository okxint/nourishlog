'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isLoggedIn } from '@/lib/store';
import { ArrowRight } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn()) router.replace('/home');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#09090b] text-white overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50" style={{ background: 'rgba(9,9,11,0.85)', backdropFilter: 'blur(20px)' }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 h-14">
          <span className="text-base font-bold tracking-tight" style={{ fontFamily: 'Sora, sans-serif' }}>
            nourish<span className="text-[#f97316]">log</span>
          </span>
          <button
            onClick={() => router.push('/login')}
            className="px-4 py-1.5 rounded-full bg-white text-black text-xs font-semibold
              hover:bg-white/90 transition-all active:scale-95"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section className="relative pt-28 pb-6 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            {/* Left copy */}
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#27272a] mb-6">
                <span className="text-[10px] font-medium text-[#a1a1aa]">Built for Indian food</span>
                <span className="text-xs">🇮🇳</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.08] tracking-tight mb-5" style={{ fontFamily: 'Sora, sans-serif' }}>
                Know exactly<br />
                what you&apos;re<br />
                <span className="text-[#f97316]">eating.</span>
              </h1>

              <p className="text-base sm:text-lg text-[#a1a1aa] leading-relaxed mb-8 max-w-md mx-auto lg:mx-0">
                Snap your plate. Or just type &ldquo;had biryani for lunch&rdquo;.
                We break down every calorie, macro, and nutrient — for dosa, dal, paneer, everything.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-3 justify-center lg:justify-start mb-6">
                <button
                  onClick={() => router.push('/login')}
                  className="group flex items-center gap-2 px-7 py-3 rounded-full bg-[#f97316] text-white
                    font-semibold text-sm hover:brightness-110 transition-all active:scale-95"
                >
                  Start Tracking — Free
                  <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
                <button
                  onClick={() => document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-sm text-[#71717a] hover:text-[#a1a1aa] transition-colors font-medium"
                >
                  See how it works ↓
                </button>
              </div>

              <p className="text-[11px] text-[#52525b]">
                Free forever · No signup wall · Works on any device
              </p>
            </div>

            {/* Right — App mockup */}
            <div className="flex-shrink-0 relative">
              <div className="absolute -inset-10 bg-[#f97316] opacity-[0.06] rounded-full blur-[80px]" />
              <PhoneMockup>
                <AppHomeScreenshot />
              </PhoneMockup>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SOCIAL PROOF BAR ─── */}
      <section className="py-8 px-6 border-y border-[#18181b]">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
          {[
            ['60+', 'Indian dishes'],
            ['Instant', 'nutrition breakdown'],
            ['Chat-first', 'food logging'],
            ['Free', 'no strings attached'],
          ].map(([big, small]) => (
            <div key={big} className="text-center">
              <span className="text-sm font-bold text-white">{big}</span>
              <span className="text-xs text-[#52525b] ml-1.5">{small}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section id="how" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[11px] font-semibold text-[#f97316] uppercase tracking-widest mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              How it works
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold" style={{ fontFamily: 'Sora, sans-serif' }}>
              Three steps. That&apos;s it.
            </h2>
          </div>

          {/* Step 1 — Chat */}
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16 mb-20">
            <div className="flex-1 order-2 lg:order-1">
              <span className="text-xs font-bold text-[#f97316] mb-2 block" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>01</span>
              <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: 'Sora, sans-serif' }}>
                Just type what you ate
              </h3>
              <p className="text-[#a1a1aa] leading-relaxed mb-4">
                No barcode scanning. No searching through endless databases. Just talk to NourishLog like you&apos;d tell a friend —
                &ldquo;had 2 rotis with dal for dinner&rdquo; or &ldquo;chai and samosa at 4pm&rdquo;.
              </p>
              <p className="text-[#a1a1aa] leading-relaxed">
                You can also snap a photo of your plate and we&apos;ll identify everything on it.
              </p>
            </div>
            <div className="flex-shrink-0 order-1 lg:order-2 relative">
              <div className="absolute -inset-8 bg-[#6366f1] opacity-[0.05] rounded-full blur-[60px]" />
              <PhoneMockup>
                <ChatScreenshot />
              </PhoneMockup>
            </div>
          </div>

          {/* Step 2 — Nutrition */}
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16 mb-20">
            <div className="flex-shrink-0 relative">
              <div className="absolute -inset-8 bg-[#f97316] opacity-[0.05] rounded-full blur-[60px]" />
              <PhoneMockup>
                <NutritionScreenshot />
              </PhoneMockup>
            </div>
            <div className="flex-1">
              <span className="text-xs font-bold text-[#f97316] mb-2 block" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>02</span>
              <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: 'Sora, sans-serif' }}>
                Full nutrition breakdown, instantly
              </h3>
              <p className="text-[#a1a1aa] leading-relaxed mb-4">
                Every meal gets a complete breakdown — calories, protein, carbs, fat, fiber, vitamins, sodium, and a health score out of 10.
              </p>
              <p className="text-[#a1a1aa] leading-relaxed">
                We know that a masala dosa is 280 kcal, not some generic &ldquo;pancake&rdquo; estimate. Indian food, done right.
              </p>
            </div>
          </div>

          {/* Step 3 — Dashboard */}
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
            <div className="flex-1 order-2 lg:order-1">
              <span className="text-xs font-bold text-[#f97316] mb-2 block" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>03</span>
              <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: 'Sora, sans-serif' }}>
                See patterns. Eat better.
              </h3>
              <p className="text-[#a1a1aa] leading-relaxed mb-4">
                Your dashboard shows weekly calorie trends, macro splits, your most-eaten foods, and how long your logging streak is.
              </p>
              <p className="text-[#a1a1aa] leading-relaxed">
                Ask the chat &ldquo;how&apos;s my week going?&rdquo; or &ldquo;what should I eat next?&rdquo; and get suggestions based on what you&apos;ve already had.
              </p>
            </div>
            <div className="flex-shrink-0 order-1 lg:order-2 relative">
              <div className="absolute -inset-8 bg-[#22c55e] opacity-[0.05] rounded-full blur-[60px]" />
              <PhoneMockup>
                <DashboardScreenshot />
              </PhoneMockup>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOODS WE KNOW ─── */}
      <section className="py-16 px-6 border-t border-[#18181b]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3" style={{ fontFamily: 'Sora, sans-serif' }}>
            We speak Indian food
          </h2>
          <p className="text-sm text-[#71717a] mb-8 max-w-md mx-auto">
            60+ dishes with accurate nutrition data — not some American database guessing what &ldquo;curry&rdquo; means.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto">
            {[
              'Masala Dosa · 280 kcal', 'Idli Sambar · 195 kcal', 'Poha · 250 kcal',
              'Chicken Biryani · 490 kcal', 'Rajma Chawal · 410 kcal', 'Chole Bhature · 520 kcal',
              'Butter Chicken · 438 kcal', 'Palak Paneer · 290 kcal', 'Dal Rice · 380 kcal',
              'Vada Pav · 290 kcal', 'Pav Bhaji · 380 kcal', 'Samosa · 262 kcal',
              'Tandoori Chicken · 260 kcal', 'Chai · 80 kcal', 'Filter Coffee · 90 kcal',
              'Paratha · 260 kcal', 'Upma · 210 kcal', 'Pani Puri · 180 kcal',
            ].map((item) => {
              const [name, cal] = item.split(' · ');
              return (
                <span key={item} className="px-3 py-1.5 rounded-lg bg-[#18181b] border border-[#27272a] text-xs">
                  <span className="text-[#e4e4e7]">{name}</span>
                  <span className="text-[#52525b] ml-1.5">{cal}</span>
                </span>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ fontFamily: 'Sora, sans-serif' }}>
            Stop guessing.<br />Start knowing.
          </h2>
          <p className="text-[#71717a] mb-8 max-w-md mx-auto">
            Takes 10 seconds to set up. No credit card, no subscriptions, no nonsense.
          </p>
          <button
            onClick={() => router.push('/login')}
            className="group inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-[#f97316] text-white
              font-semibold text-base hover:brightness-110 transition-all active:scale-95"
          >
            Start Tracking — Free
            <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#18181b] py-6 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs font-semibold text-[#52525b]" style={{ fontFamily: 'Sora, sans-serif' }}>
            nourish<span className="text-[#f97316]">log</span>
          </span>
          <p className="text-[11px] text-[#3f3f46]">Made in India, for India.</p>
        </div>
      </footer>
    </div>
  );
}

/* ─── Phone Mockup Shell ─── */
function PhoneMockup({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-[260px] sm:w-[280px]">
      <div className="rounded-[32px] border-[3px] border-[#27272a] bg-[#09090b] p-1.5 shadow-2xl">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-[#09090b] rounded-b-2xl z-10 border-x-[3px] border-b-[3px] border-[#27272a]" />
        <div className="rounded-[26px] overflow-hidden bg-[#0f0f14]">
          {children}
        </div>
      </div>
    </div>
  );
}

/* ─── Inline App Screenshots (rendered as actual UI, not images) ─── */

function AppHomeScreenshot() {
  return (
    <div className="px-4 pt-8 pb-4 text-[10px]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
      <p className="text-[11px] font-semibold text-white mb-0.5" style={{ fontFamily: 'Sora, sans-serif' }}>Good afternoon, Rahul</p>
      <p className="text-[8px] text-[#52525b] mb-3">Saturday, 5 April 2026</p>

      {/* Calorie Ring */}
      <div className="flex justify-center mb-3">
        <div className="relative w-32 h-32">
          <svg width="128" height="128" viewBox="0 0 128 128" className="transform -rotate-90">
            <circle cx="64" cy="64" r="52" fill="none" stroke="#1c1c22" strokeWidth="7" />
            <circle cx="64" cy="64" r="52" fill="none" stroke="#f97316" strokeWidth="7" strokeLinecap="round"
              strokeDasharray="327" strokeDashoffset="170" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-extrabold text-white" style={{ fontFamily: 'Sora, sans-serif' }}>915</span>
            <span className="text-[7px] text-[#52525b]">kcal consumed</span>
            <span className="text-[7px] text-[#f97316] font-semibold">1,085 left</span>
          </div>
        </div>
      </div>

      {/* Macros */}
      <div className="flex gap-1.5 mb-3">
        {[
          { label: 'Protein', val: '28', goal: '120', color: '#6366f1', pct: '23%' },
          { label: 'Carbs', val: '104', goal: '250', color: '#eab308', pct: '42%' },
          { label: 'Fat', val: '33', goal: '65', color: '#f43f5e', pct: '51%' },
        ].map((m) => (
          <div key={m.label} className="flex-1 bg-[#1c1c22] rounded-xl px-2 py-2 border border-[#27272a]/50">
            <div className="flex items-center gap-1 mb-1">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: m.color }} />
              <span className="text-[7px] text-[#52525b] uppercase font-semibold">{m.label}</span>
            </div>
            <span className="text-[11px] font-bold" style={{ color: m.color, fontFamily: 'Sora' }}>{m.val}</span>
            <span className="text-[7px] text-[#3f3f46]"> / {m.goal}g</span>
            <div className="w-full h-1 rounded-full bg-[#27272a] mt-1">
              <div className="h-full rounded-full" style={{ width: m.pct, background: m.color }} />
            </div>
          </div>
        ))}
      </div>

      {/* Meals */}
      <p className="text-[9px] font-semibold text-[#a1a1aa] mb-1.5" style={{ fontFamily: 'Sora' }}>Breakfast</p>
      <div className="bg-[#1c1c22] rounded-xl p-2 flex items-center gap-2 mb-1.5 border border-[#27272a]/50">
        <div className="w-9 h-9 rounded-lg bg-[#27272a] flex items-center justify-center text-sm">🌅</div>
        <div className="flex-1 min-w-0">
          <p className="text-[9px] font-semibold text-white truncate">Masala Dosa with Chutney</p>
          <p className="text-[7px] text-[#52525b]">8:30 AM · 💚 7/10</p>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-bold text-[#f97316]">280</span>
          <span className="text-[6px] text-[#52525b] block">kcal</span>
        </div>
      </div>

      <p className="text-[9px] font-semibold text-[#a1a1aa] mb-1.5 mt-2.5" style={{ fontFamily: 'Sora' }}>Lunch</p>
      <div className="bg-[#1c1c22] rounded-xl p-2 flex items-center gap-2 mb-1.5 border border-[#27272a]/50">
        <div className="w-9 h-9 rounded-lg bg-[#27272a] flex items-center justify-center text-sm">☀️</div>
        <div className="flex-1 min-w-0">
          <p className="text-[9px] font-semibold text-white truncate">Chicken Biryani</p>
          <p className="text-[7px] text-[#52525b]">1:00 PM · 💚 6/10</p>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-bold text-[#f97316]">490</span>
          <span className="text-[6px] text-[#52525b] block">kcal</span>
        </div>
      </div>

      <div className="bg-[#1c1c22] rounded-xl p-2 flex items-center gap-2 border border-[#27272a]/50">
        <div className="w-9 h-9 rounded-lg bg-[#27272a] flex items-center justify-center text-sm">🍿</div>
        <div className="flex-1 min-w-0">
          <p className="text-[9px] font-semibold text-white truncate">Chai + Biscuits</p>
          <p className="text-[7px] text-[#52525b]">4:00 PM · 💚 4/10</p>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-bold text-[#f97316]">145</span>
          <span className="text-[6px] text-[#52525b] block">kcal</span>
        </div>
      </div>

      {/* Bottom nav */}
      <div className="flex items-center justify-around mt-3 pt-2 border-t border-[#18181b]">
        {['Home', 'Chat', 'Stats', 'Profile'].map((t, i) => (
          <span key={t} className={`text-[7px] font-medium ${i === 0 ? 'text-[#f97316]' : 'text-[#3f3f46]'}`}>{t}</span>
        ))}
      </div>
    </div>
  );
}

function ChatScreenshot() {
  return (
    <div className="px-3 pt-8 pb-3 text-[10px]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#18181b]">
        <div className="w-7 h-7 rounded-lg bg-[#f97316]/15 flex items-center justify-center">
          <span className="text-[10px]">✦</span>
        </div>
        <div>
          <p className="text-[10px] font-bold text-white" style={{ fontFamily: 'Sora' }}>NourishLog</p>
          <p className="text-[6px] text-[#52525b]">Tell me what you ate</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex flex-col gap-2">
        <div className="self-start bg-[#1c1c22] rounded-xl rounded-bl-sm px-3 py-2 max-w-[85%] border border-[#27272a]/50">
          <p className="text-[9px] text-[#d4d4d8] leading-relaxed">
            Hey Rahul! 👋 Tell me what you ate and I&apos;ll log it with full nutrition info.
          </p>
        </div>

        <div className="self-end bg-[#f97316] rounded-xl rounded-br-sm px-3 py-2 max-w-[80%]">
          <p className="text-[9px] text-white">had chicken biryani for lunch</p>
        </div>

        <div className="self-start bg-[#1c1c22] rounded-xl rounded-bl-sm px-3 py-2 max-w-[88%] border border-[#27272a]/50">
          <p className="text-[9px] text-[#d4d4d8] leading-relaxed">
            Logged <strong className="text-white">Chicken Biryani</strong> for lunch! ✅
          </p>
          <p className="text-[8px] text-[#a1a1aa] mt-1.5">
            🔥 490 kcal · 🥩 22g protein · 🍚 62g carbs · 🧈 18g fat
          </p>
          <p className="text-[8px] text-[#22c55e] mt-0.5">
            💚 Health Score: 6/10
          </p>
        </div>

        <div className="self-end bg-[#f97316] rounded-xl rounded-br-sm px-3 py-2 max-w-[80%]">
          <p className="text-[9px] text-white">also had chai and 2 samosas at 4pm</p>
        </div>

        <div className="self-start bg-[#1c1c22] rounded-xl rounded-bl-sm px-3 py-2 max-w-[88%] border border-[#27272a]/50">
          <p className="text-[9px] text-[#d4d4d8] leading-relaxed">
            Logged <strong className="text-white">Chai</strong> (80 kcal) + <strong className="text-white">Samosa x2</strong> (524 kcal) ✅
          </p>
          <p className="text-[8px] text-[#a1a1aa] mt-1.5">
            You&apos;ve had 1,094 kcal today. 906 remaining.
          </p>
        </div>

        <div className="self-end bg-[#f97316] rounded-xl rounded-br-sm px-3 py-2 max-w-[80%]">
          <p className="text-[9px] text-white">what should I eat for dinner?</p>
        </div>

        <div className="self-start bg-[#1c1c22] rounded-xl rounded-bl-sm px-3 py-2 max-w-[88%] border border-[#27272a]/50">
          <p className="text-[9px] text-[#d4d4d8] leading-relaxed">
            You have <strong className="text-white">906 kcal</strong> left and need more protein. Try:
          </p>
          <p className="text-[8px] text-[#a1a1aa] mt-1">
            • <strong className="text-[#d4d4d8]">Dal + Roti</strong> — 310 kcal, 13g protein<br />
            • <strong className="text-[#d4d4d8]">Tandoori Chicken</strong> — 260 kcal, 32g protein
          </p>
        </div>
      </div>

      {/* Input bar */}
      <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-[#18181b]">
        <div className="w-6 h-6 rounded-md bg-[#1c1c22] flex items-center justify-center border border-[#27272a]/50">
          <span className="text-[8px] text-[#52525b]">📷</span>
        </div>
        <div className="flex-1 h-6 rounded-md bg-[#1c1c22] border border-[#27272a]/50 flex items-center px-2">
          <span className="text-[7px] text-[#3f3f46]">Type what you ate...</span>
        </div>
        <div className="w-6 h-6 rounded-md bg-[#f97316] flex items-center justify-center">
          <span className="text-[8px] text-white">→</span>
        </div>
      </div>
    </div>
  );
}

function NutritionScreenshot() {
  return (
    <div className="px-4 pt-8 pb-4 text-[10px]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[10px] text-[#52525b]">←</span>
        <p className="text-[10px] font-bold text-white" style={{ fontFamily: 'Sora' }}>Meal Details</p>
      </div>

      {/* Food image placeholder */}
      <div className="w-full h-28 rounded-xl bg-gradient-to-br from-[#27272a] to-[#1c1c22] mb-3 flex items-center justify-center">
        <span className="text-3xl">🍛</span>
      </div>

      <p className="text-[13px] font-bold text-white" style={{ fontFamily: 'Sora' }}>Chicken Biryani</p>
      <p className="text-[8px] text-[#52525b] mt-0.5">Lunch · 1:00 PM · 1 plate (300g)</p>

      <div className="flex items-center gap-2 mt-2 mb-3">
        <span className="text-xl font-extrabold text-[#f97316]" style={{ fontFamily: 'Sora' }}>490</span>
        <span className="text-[9px] text-[#52525b]">kcal</span>
        <div className="ml-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#22c55e]/15">
          <span className="text-[7px] text-[#22c55e] font-bold">💚 6/10</span>
        </div>
      </div>

      {/* Macro circles */}
      <div className="bg-[#1c1c22] rounded-xl p-3 mb-2 border border-[#27272a]/50">
        <p className="text-[9px] font-bold text-white mb-2" style={{ fontFamily: 'Sora' }}>Nutrition Breakdown</p>
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: 'Protein', val: '22g', color: '#6366f1', pct: 18 },
            { label: 'Carbs', val: '62g', color: '#eab308', pct: 25 },
            { label: 'Fat', val: '18g', color: '#f43f5e', pct: 28 },
            { label: 'Fiber', val: '3g', color: '#22c55e', pct: 12 },
          ].map((m) => (
            <div key={m.label} className="text-center">
              <div className="relative w-10 h-10 mx-auto mb-1">
                <svg width="40" height="40" viewBox="0 0 40 40" className="transform -rotate-90">
                  <circle cx="20" cy="20" r="16" fill="none" stroke="#27272a" strokeWidth="3" />
                  <circle cx="20" cy="20" r="16" fill="none" stroke={m.color} strokeWidth="3" strokeLinecap="round"
                    strokeDasharray="100" strokeDashoffset={100 - m.pct} />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[8px] font-bold" style={{ color: m.color }}>{m.val}</span>
                </div>
              </div>
              <p className="text-[7px] text-[#52525b]">{m.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Micronutrients */}
      <div className="bg-[#1c1c22] rounded-xl p-3 border border-[#27272a]/50">
        <p className="text-[9px] font-bold text-white mb-1.5" style={{ fontFamily: 'Sora' }}>Micronutrients</p>
        {[
          ['Vitamin C', '8% DV'], ['Iron', '20% DV'], ['Calcium', '6% DV'], ['Sodium', '720mg'],
        ].map(([label, val]) => (
          <div key={label} className="flex items-center justify-between py-1 border-b border-[#27272a]/30 last:border-0">
            <span className="text-[8px] text-[#52525b]">{label}</span>
            <span className="text-[8px] font-semibold text-[#a1a1aa]">{val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DashboardScreenshot() {
  return (
    <div className="px-4 pt-8 pb-4 text-[10px]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-[12px] font-bold text-white" style={{ fontFamily: 'Sora' }}>Dashboard</p>
        <div className="flex items-center gap-1 bg-[#1c1c22] rounded-full px-2 py-0.5 border border-[#27272a]/50">
          <span className="text-[7px] text-[#52525b]">‹</span>
          <span className="text-[8px] font-semibold text-[#a1a1aa]">This Week</span>
          <span className="text-[7px] text-[#52525b]">›</span>
        </div>
      </div>

      {/* Summary */}
      <div className="flex gap-1.5 mb-3">
        <div className="flex-1 bg-[#1c1c22] rounded-xl p-2 text-center border border-[#27272a]/50">
          <p className="text-[14px] font-extrabold text-[#f97316]" style={{ fontFamily: 'Sora' }}>12,840</p>
          <p className="text-[7px] text-[#52525b] uppercase font-semibold">Total kcal</p>
        </div>
        <div className="flex-1 bg-[#1c1c22] rounded-xl p-2 text-center border border-[#27272a]/50">
          <p className="text-[14px] font-extrabold text-white" style={{ fontFamily: 'Sora' }}>1,834</p>
          <p className="text-[7px] text-[#52525b] uppercase font-semibold">Daily avg</p>
        </div>
      </div>

      {/* Bar chart */}
      <div className="bg-[#1c1c22] rounded-xl p-3 mb-2 border border-[#27272a]/50">
        <p className="text-[9px] font-bold text-white mb-2" style={{ fontFamily: 'Sora' }}>Calories</p>
        <div className="flex items-end justify-between h-16 gap-1">
          {[
            { d: 'M', h: 68 }, { d: 'T', h: 82 }, { d: 'W', h: 55 },
            { d: 'T', h: 90 }, { d: 'F', h: 72 }, { d: 'S', h: 78, today: true }, { d: 'S', h: 45 },
          ].map((b, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full rounded-t-md"
                style={{
                  height: `${b.h}%`,
                  background: b.today ? '#f97316' : '#f97316' + '44',
                }}
              />
              <span className={`text-[7px] ${b.today ? 'text-[#f97316] font-bold' : 'text-[#3f3f46]'}`}>
                {b.d}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Macro donut + legend */}
      <div className="bg-[#1c1c22] rounded-xl p-3 mb-2 border border-[#27272a]/50">
        <p className="text-[9px] font-bold text-white mb-2" style={{ fontFamily: 'Sora' }}>Macros</p>
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 flex-shrink-0">
            <svg width="64" height="64" viewBox="0 0 64 64">
              <circle cx="32" cy="32" r="24" fill="none" stroke="#6366f1" strokeWidth="7" strokeDasharray="45 106" strokeDashoffset="0" transform="rotate(-90 32 32)" />
              <circle cx="32" cy="32" r="24" fill="none" stroke="#eab308" strokeWidth="7" strokeDasharray="63 88" strokeDashoffset="-45" transform="rotate(-90 32 32)" />
              <circle cx="32" cy="32" r="24" fill="none" stroke="#f43f5e" strokeWidth="7" strokeDasharray="42 109" strokeDashoffset="-108" transform="rotate(-90 32 32)" />
            </svg>
          </div>
          <div className="flex-1 flex flex-col gap-1.5">
            {[
              { label: 'Protein', pct: '30%', g: '218g', color: '#6366f1' },
              { label: 'Carbs', pct: '42%', g: '412g', color: '#eab308' },
              { label: 'Fat', pct: '28%', g: '168g', color: '#f43f5e' },
            ].map((m) => (
              <div key={m.label} className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: m.color }} />
                <span className="text-[8px] text-[#a1a1aa] flex-1">{m.label}</span>
                <span className="text-[8px] font-bold" style={{ color: m.color }}>{m.pct}</span>
                <span className="text-[7px] text-[#3f3f46]">{m.g}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-1.5">
        {[
          { label: 'STREAK', value: '7 days', icon: '🔥' },
          { label: 'MOST EATEN', value: 'Dal Rice', icon: '🍛' },
          { label: 'PEAK DAY', value: 'Thu · 2,430', icon: '📈' },
          { label: 'HYDRATION', value: '2.1L avg', icon: '💧' },
        ].map((s) => (
          <div key={s.label} className="bg-[#1c1c22] rounded-xl p-2 border border-[#27272a]/50">
            <span className="text-sm">{s.icon}</span>
            <p className="text-[7px] text-[#52525b] uppercase font-semibold mt-0.5">{s.label}</p>
            <p className="text-[9px] font-bold text-white">{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
