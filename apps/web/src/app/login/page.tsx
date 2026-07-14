'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { fetchApi } from '@/lib/api';
import LoadingScreen from '@/components/ui/LoadingScreen';
import GoogleSignInButton from '@/components/auth/GoogleSignInButton';

/* Minimal line icons for a professional, legal-grade feel */
const IconScale = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M12 3v18M7 21h10M5 7h14M5 7l-2.5 6a3 3 0 0 0 5 0L5 7Zm14 0-2.5 6a3 3 0 0 0 5 0L19 7ZM12 3l-5 4m5-4 5 4" />
  </svg>
);
const IconDoc = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" /><path d="M14 3v5h5M9 13h6M9 17h4" />
  </svg>
);
const IconPen = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" />
  </svg>
);
const IconShield = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /><path d="m9 12 2 2 4-4" />
  </svg>
);

const FEATURES = [
  { icon: IconScale,  label: 'AI Judgment Engine',    sub: 'Per-charge probability scoring with legal reasoning' },
  { icon: IconDoc,    label: 'RAG Document Analysis', sub: 'Ask questions from case files with page citations' },
  { icon: IconPen,    label: 'Letter Generator',      sub: 'AI-drafted demand letters, motions & notices' },
  { icon: IconShield, label: 'Encrypted & Compliant', sub: 'Attorney-client privilege protected end-to-end' },
];

export default function Login() {
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [error, setError]         = useState('');
  const [loading, setLoading]     = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [dest, setDest]           = useState('/dashboard');
  const router = useRouter();

  /** Shared post-authentication flow: persist tokens, resolve destination. */
  const afterAuth = async (data: any) => {
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('refresh_token', data.refresh_token);
    const user = await fetchApi('/api/v1/auth/me');
    const target = user.organization_id ? '/dashboard' : '/onboarding';
    if (user.organization_id) localStorage.setItem('organization_id', user.organization_id);
    setDest(target);
    setShowLoader(true);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await fetchApi('/api/v1/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      await afterAuth(data);
    } catch (err: any) {
      setError(err.message || 'Invalid email or password. Please try again.');
      setLoading(false);
    }
  };

  const handleGoogle = async (credential: string) => {
    setError('');
    setLoading(true);
    try {
      const data = await fetchApi('/api/v1/auth/google', {
        method: 'POST',
        body: JSON.stringify({ credential }),
      });
      await afterAuth(data);
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed. Please try again.');
      setLoading(false);
    }
  };

  if (showLoader) return <LoadingScreen onComplete={() => router.push(dest)} />;

  return (
    <div className="relative min-h-screen w-full overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ── Full-bleed hero background ─────────────────────────────── */}
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/intelix-ai.jpeg')" }} />
      {/* Light, directional scrim — darker on the left for text, airy in the middle so the image reads */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(105deg, rgba(7,11,22,0.90) 0%, rgba(7,11,22,0.66) 30%, rgba(7,11,22,0.34) 52%, rgba(7,11,22,0.30) 68%, rgba(7,11,22,0.58) 100%)',
        }}
      />
      {/* Subtle top-to-bottom vignette for polish */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(7,11,22,0.35) 0%, transparent 22%, transparent 78%, rgba(7,11,22,0.45) 100%)' }} />
      {/* Faint grid texture */}
      <div className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: '56px 56px',
        }} />

      {/* ── Content ────────────────────────────────────────────────── */}
      <div className="relative z-10 min-h-screen flex flex-col">

        {/* Top brand bar */}
        <header className="px-6 lg:px-14 pt-7">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center font-black text-sm text-white"
              style={{ background: 'linear-gradient(135deg, #3B82F6, #6366F1)', boxShadow: '0 6px 22px rgba(99,102,241,0.55)' }}>
              CI
            </div>
            <div>
              <div className="text-lg font-black text-white tracking-tight">CaseIntelix</div>
              <div className="text-xs font-medium tracking-wide" style={{ color: '#93C5FD' }}>Legal Intelligence Platform</div>
            </div>
          </div>
        </header>

        {/* Middle: hero copy + glass card */}
        <div className="flex-1 flex items-center">
          <div className="w-full max-w-7xl mx-auto px-6 lg:px-14 py-10 grid lg:grid-cols-2 gap-12 items-center">

            {/* ── Left hero copy ────────────────────────────────── */}
            <div className="hidden lg:block text-white max-w-xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-semibold mb-7 tracking-[0.14em] uppercase"
                style={{ background: 'rgba(255,255,255,0.08)', color: '#C7D2FE', border: '1px solid rgba(255,255,255,0.16)', backdropFilter: 'blur(8px)' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" style={{ animation: 'pulse-dot 2s ease-in-out infinite' }} />
                AI-Powered · SOC 2 Ready
              </div>

              <h1 className="text-5xl xl:text-6xl font-black leading-[1.05] mb-5" style={{ letterSpacing: '-0.03em' }}>
                The AI-Powered
                <br />
                <span style={{
                  background: 'linear-gradient(90deg, #7DD3FC, #818CF8, #C4B5FD)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  Legal Workspace
                </span>
              </h1>

              <p className="text-[15px] leading-relaxed mb-9" style={{ color: '#CBD5E1', maxWidth: 440 }}>
                Analyze case documents, generate AI judgments, track matters, and draft
                legal letters — grounded, cited, and reviewed. All in one secure platform.
              </p>

              <div className="space-y-4 max-w-md">
                {FEATURES.map(f => (
                  <div key={f.label} className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-blue-200"
                      style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.14)', backdropFilter: 'blur(6px)' }}>
                      {f.icon}
                    </div>
                    <div className="pt-0.5">
                      <div className="text-sm font-semibold text-white">{f.label}</div>
                      <div className="text-xs mt-0.5" style={{ color: '#94A3B8' }}>{f.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Right glass sign-in card ──────────────────────── */}
            <div className="w-full flex justify-center lg:justify-end">
              <div className="w-full max-w-[430px]">

                {/* Mobile brand */}
                <div className="flex items-center gap-2.5 mb-6 lg:hidden justify-center">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center font-black text-sm text-white"
                    style={{ background: 'linear-gradient(135deg, #3B82F6, #6366F1)' }}>CI</div>
                  <span className="font-black text-lg text-white">CaseIntelix</span>
                </div>

                <div className="rounded-2xl p-7 sm:p-8 space-y-5"
                  style={{
                    background: 'rgba(255,255,255,0.07)',
                    backdropFilter: 'blur(22px)',
                    WebkitBackdropFilter: 'blur(22px)',
                    border: '1px solid rgba(255,255,255,0.16)',
                    boxShadow: '0 24px 70px rgba(0,0,0,0.45)',
                  }}>

                  <div>
                    <h2 className="text-2xl font-black text-white tracking-tight">Welcome back</h2>
                    <p className="text-sm mt-1" style={{ color: '#CBD5E1' }}>Sign in to your secure workspace</p>
                  </div>

                  {error && (
                    <div className="flex items-start gap-2.5 p-3.5 rounded-xl text-sm font-medium"
                      style={{ background: 'rgba(239,68,68,0.15)', color: '#FECACA', border: '1px solid rgba(248,113,113,0.35)' }}>
                      <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                      </svg>
                      {error}
                    </div>
                  )}

                  <GoogleSignInButton onCredential={handleGoogle} disabled={loading} />

                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.14)' }} />
                    <span className="text-xs" style={{ color: 'rgba(255,255,255,0.55)' }}>or continue with email</span>
                    <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.14)' }} />
                  </div>

                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <label htmlFor="login-email" className="block text-[11px] font-bold uppercase tracking-[0.12em] mb-1.5" style={{ color: 'rgba(255,255,255,0.65)' }}>
                        Email Address
                      </label>
                      <input
                        id="login-email"
                        type="email"
                        required
                        autoComplete="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="lawyer@firm.com"
                        className="glass-input w-full px-4 py-3 rounded-xl text-sm text-white outline-none transition-all duration-150"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label htmlFor="login-password" className="block text-[11px] font-bold uppercase tracking-[0.12em]" style={{ color: 'rgba(255,255,255,0.65)' }}>
                          Password
                        </label>
                        <Link href="/register" className="text-xs font-semibold text-blue-300 hover:text-blue-200 transition-colors">
                          Forgot password?
                        </Link>
                      </div>
                      <input
                        id="login-password"
                        type="password"
                        required
                        autoComplete="current-password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="glass-input w-full px-4 py-3 rounded-xl text-sm text-white outline-none transition-all duration-150"
                      />
                    </div>

                    <button
                      id="login-submit"
                      type="submit"
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl font-bold text-sm text-white
                                 transition-all duration-150 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                      style={{
                        background: loading ? '#3B5FA8' : 'linear-gradient(135deg, #2563EB 0%, #4F46E5 100%)',
                        boxShadow: loading ? 'none' : '0 8px 24px rgba(37,99,235,0.45)',
                      }}
                    >
                      {loading ? (
                        <>
                          <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white" style={{ animation: 'spin 0.8s linear infinite' }} />
                          Verifying credentials…
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                          </svg>
                          Sign In to Workspace
                        </>
                      )}
                    </button>
                  </form>

                  <p className="text-center text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
                    Don&apos;t have an account?{' '}
                    <Link href="/register" className="font-bold text-blue-300 hover:text-blue-200 transition-colors">
                      Create account →
                    </Link>
                  </p>

                  <div className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl"
                    style={{ background: 'rgba(16,185,129,0.14)', border: '1px solid rgba(52,211,153,0.3)' }}>
                    <svg className="w-3.5 h-3.5 shrink-0" style={{ color: '#6EE7B7' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span className="text-xs font-semibold" style={{ color: '#A7F3D0' }}>
                      256-bit encrypted · Attorney-client privilege protected
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-5 mt-6">
                  <Link href="/privacy" className="text-xs transition-colors" style={{ color: 'rgba(255,255,255,0.6)' }}>Privacy Policy</Link>
                  <Link href="/terms" className="text-xs transition-colors" style={{ color: 'rgba(255,255,255,0.6)' }}>Terms of Service</Link>
                  <Link href="/security" className="text-xs transition-colors" style={{ color: 'rgba(255,255,255,0.6)' }}>Security</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin      { to { transform: rotate(360deg); } }
        @keyframes pulse-dot { 0%,100%{ opacity:1; } 50%{ opacity:.3; } }
        .glass-input {
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.16);
        }
        .glass-input::placeholder { color: rgba(255,255,255,0.42); }
        .glass-input:focus {
          background: rgba(255,255,255,0.13);
          border-color: rgba(96,165,250,0.7);
          box-shadow: 0 0 0 3px rgba(59,130,246,0.18);
        }
        /* Keep browser autofill legible on the dark glass card */
        .glass-input:-webkit-autofill,
        .glass-input:-webkit-autofill:hover,
        .glass-input:-webkit-autofill:focus {
          -webkit-text-fill-color: #fff;
          caret-color: #fff;
          transition: background-color 9999s ease-in-out 0s;
          box-shadow: 0 0 0 1000px rgba(30,41,59,0.55) inset;
        }
      `}</style>
    </div>
  );
}
