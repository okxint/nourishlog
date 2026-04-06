'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { isLoggedIn } from '@/lib/store';
import { Home, PlusCircle, MessageCircle, BarChart3, User, Sparkles, Sun, Moon, Trophy } from 'lucide-react';
import { useTheme } from '@/lib/theme';

const tabs = [
  { href: '/home', label: 'Home', icon: Home },
  { href: '/log', label: 'Log', icon: PlusCircle },
  { href: '/chat', label: 'Chat', icon: MessageCircle },
  { href: '/dashboard', label: 'Dashboard', icon: BarChart3 },
  { href: '/achievements', label: 'Achievements', icon: Trophy },
  { href: '/profile', label: 'Profile', icon: User },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const { theme, toggle } = useTheme();

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace('/login');
    } else {
      setReady(true);
    }
  }, [router]);

  if (!ready) return null;

  return (
    <div className="min-h-screen flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-56 fixed top-0 left-0 bottom-0 border-r border-[var(--border)] bg-[var(--bg-secondary)] z-40">
        <div className="flex items-center gap-2.5 px-5 h-16 border-b border-[var(--border)]">
          <div className="w-7 h-7 rounded-lg bg-[var(--accent)] flex items-center justify-center">
            <Sparkles size={14} className="text-white" />
          </div>
          <span className="text-sm font-bold tracking-tight" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>
            nourish<span className="text-[var(--accent)]">log</span>
          </span>
        </div>
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1 justify-between"><div className="flex flex-col gap-1">
          {tabs.map((tab) => {
            const active = pathname === tab.href || (tab.href === '/home' && pathname?.startsWith('/meal'));
            const Icon = tab.icon;
            return (
              <button
                key={tab.href}
                onClick={() => router.push(tab.href)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150
                  ${active
                    ? 'bg-[var(--accent-dim)] text-[var(--accent)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-card)]'
                  }`}
              >
                <Icon size={18} strokeWidth={active ? 2.2 : 1.6} />
                <span className="text-sm font-medium" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
                  {tab.label}
                </span>
              </button>
            );
          })}
          </div>
          <button
            onClick={toggle}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150
              text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-card)]"
          >
            {theme === 'dark' ? <Sun size={18} strokeWidth={1.6} /> : <Moon size={18} strokeWidth={1.6} />}
            <span className="text-sm font-medium" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </span>
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 lg:ml-56 pb-20 lg:pb-6">
        <div className="max-w-3xl mx-auto w-full">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--border)]"
        style={{ background: 'rgba(9, 9, 11, 0.92)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' }}
      >
        <div className="flex items-center justify-around h-[64px] px-1">
          {tabs.map((tab) => {
            const active = pathname === tab.href || (tab.href === '/home' && pathname?.startsWith('/meal'));
            const Icon = tab.icon;
            return (
              <button
                key={tab.href}
                onClick={() => router.push(tab.href)}
                className="flex flex-col items-center gap-0.5 px-3 py-1.5 transition-all duration-200 relative"
              >
                {active && (
                  <div className="absolute -top-px left-1/2 -translate-x-1/2 w-7 h-0.5 rounded-full bg-[var(--accent)]" />
                )}
                <Icon
                  size={20}
                  strokeWidth={active ? 2.5 : 1.6}
                  className={active ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'}
                />
                <span
                  className={`text-[9px] font-medium ${active ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'}`}
                  style={{ fontFamily: 'IBM Plex Mono, monospace' }}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
