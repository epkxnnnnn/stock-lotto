'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import type { User } from '@supabase/supabase-js';

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export default function AdminClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  useEffect(() => {
    const supabase = getSupabase();
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    setError('');

    const supabase = getSupabase();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message === 'Invalid login credentials'
        ? 'อีเมลหรือรหัสผ่านไม่ถูกต้อง'
        : authError.message
      );
    }
    setLoggingIn(false);
  };

  const handleLogout = async () => {
    const supabase = getSupabase();
    await supabase.auth.signOut();
    setUser(null);
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <p className="text-[var(--text-muted)] text-sm">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="py-20 flex justify-center">
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] p-8 w-full max-w-sm">
          <h2 className="font-heading text-2xl tracking-[2px] text-[var(--brand-primary)] mb-6 text-center">
            ADMIN LOGIN
          </h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="อีเมล"
              className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand-primary)] transition-colors"
              autoFocus
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="รหัสผ่าน"
              className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand-primary)] transition-colors"
            />
            {error && (
              <p className="text-[var(--accent-red)] text-xs">{error}</p>
            )}
            <button
              type="submit"
              disabled={loggingIn}
              className="w-full bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-light)] text-[var(--bg-primary)] font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loggingIn ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return <AdminShell user={user} onLogout={handleLogout}>{children}</AdminShell>;
}

function AdminShell({ children, user, onLogout }: { children: React.ReactNode; user: User; onLogout: () => void }) {
  const pathname = usePathname();

  const tabs = [
    { href: '/admin', label: 'Results' },
    { href: '/admin/agents', label: 'API Keys' },
  ];

  return (
    <div>
      <nav className="flex gap-2 mb-4 border-b border-[var(--border)] pb-3 items-center">
        {tabs.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              pathname === tab.href
                ? 'bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] border border-[var(--brand-primary)]/20'
                : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-card)]'
            }`}
          >
            {tab.label}
          </Link>
        ))}
        <Link
          href="/api-docs"
          className="px-4 py-2 rounded-lg text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-card)] transition-all"
        >
          API Docs
        </Link>
        <div className="ml-auto flex items-center gap-3">
          <span className="text-[10px] text-[var(--text-muted)]">{user.email}</span>
          <button
            onClick={onLogout}
            className="px-3 py-1.5 rounded-lg text-[10px] font-medium text-[var(--text-muted)] hover:text-[var(--accent-red)] hover:bg-[var(--bg-card)] border border-[var(--border)] transition-all"
          >
            Logout
          </button>
        </div>
      </nav>
      {children}
    </div>
  );
}
