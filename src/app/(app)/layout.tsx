'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { isLoggedIn } from '@/lib/store';
import { Home, MessageCircle, BarChart3, User } from 'lucide-react';

const tabs = [
  { href: '/home', label: 'Home', icon: Home },
  { href: '/chat', label: 'Chat', icon: MessageCircle },
  { href: '/dashboard', label: 'Stats', icon: BarChart3 },
  { href: '/profile', label: 'Profile', icon: User },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace('/login');
    } else {
      setReady(true);
    }
  }, [router]);

  if (!ready) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 max-w-md mx-auto w-full pb-20">
        {children}
      </main>

      {/* Bottom Nav */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--border)]"
        style={{ background: 'rgba(9, 9, 11, 0.92)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' }}
      >
        <div className="max-w-md mx-auto flex items-center justify-around h-[68px] px-2">
          {tabs.map((tab) => {
            const active = pathname === tab.href || (tab.href === '/home' && pathname?.startsWith('/meal'));
            const Icon = tab.icon;
            return (
              <button
                key={tab.href}
                onClick={() => router.push(tab.href)}
                className="flex flex-col items-center gap-1 px-5 py-1.5 rounded-2xl transition-all duration-200 relative"
              >
                {active && (
                  <div className="absolute -top-px left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-[var(--accent)]" />
                )}
                <Icon
                  size={22}
                  strokeWidth={active ? 2.5 : 1.6}
                  className={active ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'}
                />
                <span
                  className={`text-[10px] font-medium ${active ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'}`}
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
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
