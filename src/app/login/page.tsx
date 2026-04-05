'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/store';
import { Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');

  const handleContinue = () => {
    if (!name.trim()) { setError('Please enter your name'); return; }
    setError('');
    setStep(2);
  };

  const handleStart = () => {
    if (!email.trim() || !email.includes('@')) { setError('Please enter a valid email'); return; }
    login(name.trim(), email.trim());
    router.replace('/home');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 hero-grid opacity-30" />
      <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-[var(--accent)] opacity-[0.06] rounded-full blur-[120px]" />
      <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-[var(--blue)] opacity-[0.06] rounded-full blur-[100px]" />

      <div className="relative w-full max-w-sm">
        {/* Back button */}
        <button
          onClick={() => step === 1 ? router.push('/') : setStep(1)}
          className="mb-8 flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
        >
          <ArrowLeft size={16} /> Back
        </button>

        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-[var(--accent)] flex items-center justify-center glow-sm">
            <Sparkles size={22} className="text-white" />
          </div>
          <span className="text-xl font-bold" style={{ fontFamily: 'Sora, sans-serif' }}>NourishLog</span>
        </div>

        {step === 1 ? (
          <div className="fade-in">
            <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Sora, sans-serif' }}>
              What&apos;s your name?
            </h1>
            <p className="text-[var(--text-secondary)] mb-8">
              Let&apos;s personalize your experience
            </p>

            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => { setName(e.target.value); setError(''); }}
              onKeyDown={(e) => e.key === 'Enter' && handleContinue()}
              autoFocus
              className="w-full px-4 py-3.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border)]
                text-[var(--text-primary)] placeholder-[var(--text-muted)] text-base
                focus:outline-none focus:border-[var(--accent)] transition-colors"
            />
            {error && <p className="text-[var(--rose)] text-xs mt-2">{error}</p>}

            <button
              onClick={handleContinue}
              className="group w-full mt-6 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl
                bg-[var(--accent)] text-white font-semibold text-base
                hover:brightness-110 transition-all active:scale-[0.98]"
            >
              Continue
              <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        ) : (
          <div className="fade-in">
            <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Sora, sans-serif' }}>
              Hey {name} 👋
            </h1>
            <p className="text-[var(--text-secondary)] mb-8">
              Enter your email to get started
            </p>

            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(''); }}
              onKeyDown={(e) => e.key === 'Enter' && handleStart()}
              autoFocus
              className="w-full px-4 py-3.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border)]
                text-[var(--text-primary)] placeholder-[var(--text-muted)] text-base
                focus:outline-none focus:border-[var(--accent)] transition-colors"
            />
            {error && <p className="text-[var(--rose)] text-xs mt-2">{error}</p>}

            <button
              onClick={handleStart}
              className="group w-full mt-6 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl
                bg-[var(--accent)] text-white font-semibold text-base
                hover:brightness-110 transition-all active:scale-[0.98]"
            >
              Start Tracking
              <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        )}

        <p className="text-center text-xs text-[var(--text-muted)] mt-8">
          By continuing, you agree to our Terms of Service
        </p>
      </div>
    </div>
  );
}
