'use client';

import { useEffect, useState } from 'react';
import { getAchievements, getDailyChallenges, checkAchievements, getStreak, generateShareText, generateWeeklyRecap, type Achievement, type Challenge } from '@/lib/gamification';
import { Share2, Trophy, Flame, Copy, Check } from 'lucide-react';

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [streak, setStreak] = useState(0);
  const [tab, setTab] = useState<'today' | 'badges' | 'share'>('today');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    checkAchievements();
    setAchievements(getAchievements());
    setChallenges(getDailyChallenges());
    setStreak(getStreak());
  }, []);

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const completedToday = challenges.filter((c) => c.completed).length;

  const handleShare = async (text: string) => {
    if (navigator.share) {
      try { await navigator.share({ text }); } catch { /* cancelled */ }
    } else {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="px-5 lg:px-8 pt-10 lg:pt-8 fade-in">
      {/* Streak Banner */}
      <div className="glass-card rounded-2xl p-5 mb-5 text-center">
        <Flame size={28} style={{ color: streak >= 7 ? 'var(--accent)' : 'var(--amber)' }} className="mx-auto mb-2" />
        <p className="text-3xl font-extrabold" style={{ fontFamily: 'Plus Jakarta Sans' }}>{streak}</p>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>day streak</p>
        <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
          {streak === 0 ? 'Log a meal to start your streak!' :
           streak < 7 ? 'Keep going, you\'re building a habit!' :
           streak < 14 ? 'One week down, amazing!' :
           streak < 30 ? 'Incredible consistency!' :
           'Legendary streak! 👑'}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5">
        {[
          { key: 'today' as const, label: `Today (${completedToday}/${challenges.length})` },
          { key: 'badges' as const, label: `Badges (${unlockedCount}/${achievements.length})` },
          { key: 'share' as const, label: 'Share' },
        ].map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${tab === t.key ? 'bg-[var(--accent)] text-white' : 'glass text-[var(--text-secondary)]'}`}
            style={{ fontFamily: 'JetBrains Mono' }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Daily Challenges */}
      {tab === 'today' && (
        <div className="flex flex-col gap-2.5 mb-8">
          <h2 className="text-sm font-bold" style={{ fontFamily: 'Plus Jakarta Sans' }}>Today&apos;s Challenges</h2>
          {challenges.map((c) => (
            <div key={c.id} className="glass-card rounded-xl p-3.5">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xl">{c.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{c.title}</span>
                    {c.completed && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ background: 'var(--green-dim)', color: 'var(--green)' }}>DONE</span>}
                  </div>
                </div>
                <span className="text-xs font-bold" style={{ color: c.completed ? 'var(--green)' : 'var(--text-muted)' }}>
                  {c.id === 'budget' ? (c.completed ? '✓' : `${c.progress}/${c.target}`) : `${Math.min(c.progress, c.target)}/${c.target}`}
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full" style={{ background: 'var(--bg-card-hover)' }}>
                <div className="h-full rounded-full transition-all" style={{
                  width: c.id === 'budget' ? (c.completed ? '100%' : '0%') : `${Math.min((c.progress / c.target) * 100, 100)}%`,
                  background: c.completed ? 'var(--green)' : 'var(--accent)',
                }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Achievements */}
      {tab === 'badges' && (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 mb-8">
          {achievements.map((a) => (
            <div key={a.id} className={`glass-card rounded-xl p-3.5 text-center transition-all ${a.unlocked ? '' : 'opacity-35 grayscale'}`}>
              <span className="text-3xl block mb-1.5">{a.icon}</span>
              <p className="text-xs font-bold" style={{ fontFamily: 'Plus Jakarta Sans' }}>{a.title}</p>
              <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{a.description}</p>
              {a.unlocked && <p className="text-[9px] mt-1 font-semibold" style={{ color: 'var(--green)' }}>Unlocked ✓</p>}
            </div>
          ))}
        </div>
      )}

      {/* Share */}
      {tab === 'share' && (
        <div className="flex flex-col gap-4 mb-8">
          <div className="glass-card rounded-xl p-4">
            <h3 className="text-sm font-bold mb-2 flex items-center gap-2" style={{ fontFamily: 'Plus Jakarta Sans' }}>
              <Share2 size={14} /> Share Your Progress
            </h3>
            <pre className="text-xs p-3 rounded-lg whitespace-pre-wrap leading-relaxed" style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)', fontFamily: 'Inter' }}>
              {generateShareText()}
            </pre>
            <button onClick={() => handleShare(generateShareText())}
              className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all active:scale-[0.98]"
              style={{ background: 'var(--accent)', color: '#fff' }}>
              {copied ? <><Check size={14} /> Copied!</> : <><Share2 size={14} /> Share with Friends</>}
            </button>
          </div>

          <div className="glass-card rounded-xl p-4">
            <h3 className="text-sm font-bold mb-2 flex items-center gap-2" style={{ fontFamily: 'Plus Jakarta Sans' }}>
              <Trophy size={14} /> Weekly Recap
            </h3>
            <pre className="text-xs p-3 rounded-lg whitespace-pre-wrap leading-relaxed" style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)', fontFamily: 'Inter' }}>
              {generateWeeklyRecap()}
            </pre>
            <button onClick={() => handleShare(generateWeeklyRecap())}
              className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold glass transition-all active:scale-[0.98]"
              style={{ color: 'var(--text-secondary)' }}>
              <Copy size={14} /> Copy Weekly Recap
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
