'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Prevent search engines from indexing admin pages
    let robotsMeta = document.querySelector('meta[name="robots"]');
    if (!robotsMeta) {
      robotsMeta = document.createElement('meta');
      robotsMeta.setAttribute('name', 'robots');
      document.head.appendChild(robotsMeta);
    }
    robotsMeta.setAttribute('content', 'noindex, nofollow');
  }, []);

  useEffect(() => {
    const stored = sessionStorage.getItem('admin_auth');
    if (stored === 'true') {
      setAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple password check — in production, use proper auth
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin2026';
    if (password === adminPassword) {
      setAuthenticated(true);
      sessionStorage.setItem('admin_auth', 'true');
      setError('');
    } else {
      setError('รหัสผ่านไม่ถูกต้อง');
    }
  };

  if (!authenticated) {
    return (
      <div className="py-20 flex justify-center">
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] p-8 w-full max-w-sm">
          <h2 className="font-heading text-2xl tracking-[2px] text-[var(--brand-primary)] mb-6 text-center">
            ADMIN LOGIN
          </h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="รหัสผ่าน"
              className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand-primary)] transition-colors"
              autoFocus
            />
            {error && (
              <p className="text-[var(--accent-red)] text-xs">{error}</p>
            )}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-light)] text-[var(--bg-primary)] font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity"
            >
              เข้าสู่ระบบ
            </button>
          </form>
        </div>
      </div>
    );
  }

  return <AdminShell>{children}</AdminShell>;
}

function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const tabs = [
    { href: '/admin', label: 'Results' },
    { href: '/admin/agents', label: 'API Keys' },
  ];

  return (
    <div>
      <nav className="flex gap-2 mb-4 border-b border-[var(--border)] pb-3">
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
          className="ml-auto px-4 py-2 rounded-lg text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-card)] transition-all"
        >
          API Docs
        </Link>
      </nav>
      {children}
    </div>
  );
}
