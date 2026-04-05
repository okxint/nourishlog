'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isLoggedIn } from '@/lib/store';
import { Camera, MessageCircle, BarChart3, Zap, ArrowRight, Sparkles } from 'lucide-react';

const features = [
  {
    icon: Camera,
    title: 'Snap & Track',
    desc: 'Take a photo of your meal. AI identifies it and logs the calories, macros, and nutrients instantly.',
    color: 'var(--accent)',
  },
  {
    icon: MessageCircle,
    title: 'Chat to Log',
    desc: 'Just type "I had biryani for lunch" and we handle the rest. It\'s that simple.',
    color: 'var(--blue)',
  },
  {
    icon: BarChart3,
    title: 'Smart Dashboard',
    desc: 'Weekly trends, macro breakdowns, streaks, and personalized insights at a glance.',
    color: 'var(--green)',
  },
  {
    icon: Zap,
    title: 'Made for India',
    desc: 'From dosa to dal, biryani to bhel — we know Indian food inside out. 60+ dishes built in.',
    color: 'var(--amber)',
  },
];

const indianFoods = [
  'Masala Dosa', 'Biryani', 'Butter Chicken', 'Chole Bhature',
  'Idli Sambar', 'Rajma Chawal', 'Paneer Tikka', 'Vada Pav',
  'Pav Bhaji', 'Dal Makhani', 'Poha', 'Upma',
];

export default function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn()) router.replace('/home');
  }, [router]);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-strong">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 h-16">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent)] flex items-center justify-center">
              <Sparkles size={18} className="text-white" />
            </div>
            <span className="text-lg font-bold" style={{ fontFamily: 'Sora, sans-serif' }}>
              NourishLog
            </span>
          </div>
          <button
            onClick={() => router.push('/login')}
            className="px-5 py-2 rounded-full bg-white text-[var(--bg-primary)] text-sm font-semibold
              hover:bg-white/90 transition-all active:scale-95"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 hero-grid opacity-40" />
        <div className="absolute inset-0 radial-fade" />

        {/* Glow orbs */}
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-[var(--accent)] opacity-[0.07] rounded-full blur-[100px]" />
        <div className="absolute bottom-10 right-1/4 w-64 h-64 bg-[var(--blue)] opacity-[0.07] rounded-full blur-[100px]" />

        <div className="relative max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-6 slide-up">
            <span className="w-2 h-2 rounded-full bg-[var(--green)] animate-pulse" />
            <span className="text-xs font-medium text-[var(--text-secondary)]">AI-powered nutrition tracking</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.05] tracking-tight mb-6 slide-up" style={{ fontFamily: 'Sora, sans-serif' }}>
            Track your calories<br />
            <span className="text-gradient">with just a chat</span>
          </h1>

          <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-10 slide-up leading-relaxed">
            Snap a photo, type what you ate, or ask about nutrition — NourishLog&apos;s AI does the rest.
            Built specifically for <span className="text-[var(--text-primary)] font-medium">Indian food</span>.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 slide-up">
            <button
              onClick={() => router.push('/login')}
              className="group flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-[var(--accent)] text-white
                font-semibold text-base shadow-lg shadow-[var(--accent-dim)]
                hover:shadow-xl hover:shadow-[var(--accent-glow)] hover:brightness-110
                transition-all active:scale-95"
            >
              Start Tracking Free
              <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
            <button
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="flex items-center gap-2 px-6 py-3.5 rounded-full glass text-[var(--text-secondary)]
                font-medium text-sm hover:text-[var(--text-primary)] transition-colors"
            >
              See how it works
            </button>
          </div>

          {/* Floating food tags */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto fade-in">
            {indianFoods.map((food) => (
              <span
                key={food}
                className="px-3 py-1.5 rounded-full text-xs font-medium glass
                  text-[var(--text-muted)] hover:text-[var(--accent)] hover:border-[var(--accent)]
                  transition-colors cursor-default"
              >
                {food}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: 'Sora, sans-serif' }}>
              Everything you need to eat better
            </h2>
            <p className="text-[var(--text-secondary)] text-lg max-w-xl mx-auto">
              No more guessing calories. No more manual entries. Just tell us what you ate.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="glass-card rounded-2xl p-6 md:p-8 hover:bg-[var(--bg-card-hover)]
                  transition-all duration-300 group"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `color-mix(in srgb, ${f.color} 15%, transparent)` }}
                >
                  <f.icon size={24} style={{ color: f.color }} />
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'Sora, sans-serif' }}>
                  {f.title}
                </h3>
                <p className="text-[var(--text-secondary)] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-14" style={{ fontFamily: 'Sora, sans-serif' }}>
            How it works
          </h2>

          <div className="flex flex-col gap-6">
            {[
              { step: '01', title: 'Tell us what you ate', desc: 'Snap a photo, type "chicken biryani", or chat naturally — "I just had 2 rotis with dal for dinner"', emoji: '💬' },
              { step: '02', title: 'We break it down', desc: 'AI instantly identifies the food and calculates calories, protein, carbs, fat, fiber, and more', emoji: '🧠' },
              { step: '03', title: 'Track your progress', desc: 'See daily totals, weekly trends, macro splits, streaks, and get smart suggestions', emoji: '📊' },
            ].map((s) => (
              <div key={s.step} className="glass-card rounded-2xl p-6 md:p-8 flex items-start gap-5">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[var(--accent-dim)] flex items-center justify-center">
                  <span className="text-xl">{s.emoji}</span>
                </div>
                <div>
                  <span className="text-xs font-bold text-[var(--accent)] mb-1 block" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    STEP {s.step}
                  </span>
                  <h3 className="text-lg font-bold mb-1" style={{ fontFamily: 'Sora, sans-serif' }}>{s.title}</h3>
                  <p className="text-[var(--text-secondary)] leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="glass-card rounded-3xl p-10 md:p-14 gradient-border glow-accent">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: 'Sora, sans-serif' }}>
              Ready to take control of <br className="hidden sm:block" />your nutrition?
            </h2>
            <p className="text-[var(--text-secondary)] text-lg mb-8 max-w-lg mx-auto">
              Join thousands tracking their meals the smart way. Free to start, no credit card needed.
            </p>
            <button
              onClick={() => router.push('/login')}
              className="group inline-flex items-center gap-2.5 px-10 py-4 rounded-full bg-[var(--accent)] text-white
                font-bold text-lg shadow-lg shadow-[var(--accent-dim)]
                hover:shadow-xl hover:shadow-[var(--accent-glow)] hover:brightness-110
                transition-all active:scale-95"
            >
              Get Started — It&apos;s Free
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[var(--accent)] flex items-center justify-center">
              <Sparkles size={14} className="text-white" />
            </div>
            <span className="text-sm font-semibold" style={{ fontFamily: 'Sora, sans-serif' }}>NourishLog</span>
          </div>
          <p className="text-xs text-[var(--text-muted)]">Built with ❤️ for India</p>
        </div>
      </footer>
    </div>
  );
}
