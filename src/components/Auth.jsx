import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { Lock, Loader2, Bath } from 'lucide-react'

export function Auth() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  const handleAuth = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-view fade-in">
      {/* Ambient blobs */}
      <div className="auth-blob auth-blob-1" />
      <div className="auth-blob auth-blob-2" />

      <div className="auth-content">
        {/* Logo / Brand */}
        <div className="auth-brand">
          <div className="auth-icon-ring">
            <Bath size={28} strokeWidth={1.8} />
          </div>
          <h1 className="auth-title">Bathroom</h1>
          <p className="auth-subtitle">Shared usage organizer</p>
        </div>

        {/* Card */}
        <form className="auth-card glass-card-hi" onSubmit={handleAuth} noValidate>
          <div className="input-group">
            <label className="input-label" htmlFor="auth-email">Email</label>
            <div className="auth-input-wrap">
              <input
                id="auth-email"
                type="email"
                className="input-field"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="auth-password">Password</label>
            <div className="auth-input-wrap">
              <Lock size={16} className="auth-field-icon" aria-hidden="true" />
              <input
                id="auth-password"
                type="password"
                className="input-field auth-pw-field"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>
          </div>

          {error && (
            <div className="auth-error fade-in" role="alert">
              {error}
            </div>
          )}

          <button
            className="btn btn-primary w-full auth-submit"
            disabled={loading}
            type="submit"
          >
            {loading
              ? <><span className="auth-spinner" aria-hidden="true" /> Signing in…</>
              : 'Sign In'
            }
          </button>
        </form>
      </div>

      <style>{`
                /* ── Layout ────────────────────────────────── */
                .auth-view {
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-height: 100dvh;
                    padding: 24px 20px;
                    padding-top: max(24px, env(safe-area-inset-top) + 24px);
                    padding-bottom: max(24px, env(safe-area-inset-bottom) + 24px);
                    overflow: hidden;
                }

                /* ── Ambient blobs ─────────────────────────── */
                .auth-blob {
                    position: absolute;
                    border-radius: 50%;
                    filter: blur(80px);
                    pointer-events: none;
                    z-index: 0;
                }
                .auth-blob-1 {
                    width: 340px; height: 340px;
                    background: radial-gradient(circle, rgba(56,189,248,0.18) 0%, transparent 70%);
                    top: -80px; right: -80px;
                }
                .auth-blob-2 {
                    width: 280px; height: 280px;
                    background: radial-gradient(circle, rgba(129,140,248,0.14) 0%, transparent 70%);
                    bottom: -60px; left: -60px;
                }

                /* ── Content container ─────────────────────── */
                .auth-content {
                    position: relative;
                    z-index: 1;
                    width: 100%;
                    max-width: 400px;
                }

                /* ── Brand block ───────────────────────────── */
                .auth-brand {
                    text-align: center;
                    margin-bottom: 32px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 12px;
                }
                .auth-icon-ring {
                    width: 72px;
                    height: 72px;
                    border-radius: 24px;
                    background: linear-gradient(135deg, rgba(56,189,248,0.20), rgba(129,140,248,0.20));
                    border: 1px solid rgba(255,255,255,0.12);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--accent-primary);
                    box-shadow: 0 0 32px rgba(56,189,248,0.2);
                }
                .auth-title {
                    font-size: 2.25rem;
                    font-weight: 800;
                    letter-spacing: -1.5px;
                    line-height: 1;
                    background: linear-gradient(135deg, #fff 30%, #94a3b8 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }
                .auth-subtitle {
                    font-size: 0.9375rem;
                    color: var(--text-secondary);
                    margin-top: -4px;
                }

                /* ── Card ──────────────────────────────────── */
                .auth-card {
                    padding: 28px 24px;
                    border-radius: 24px;
                }

                /* ── Inputs ────────────────────────────────── */
                .auth-input-wrap {
                    position: relative;
                }
                .auth-field-icon {
                    position: absolute;
                    left: 14px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: var(--text-muted);
                    pointer-events: none;
                    z-index: 1;
                }
                .auth-pw-field {
                    padding-left: 40px !important;
                }

                /* ── Error ─────────────────────────────────── */
                .auth-error {
                    padding: 12px 14px;
                    background: var(--error-bg);
                    border: 1px solid rgba(248,113,113,0.35);
                    border-radius: 12px;
                    color: var(--error);
                    font-size: 0.875rem;
                    margin-bottom: 16px;
                    line-height: 1.4;
                }

                /* ── Submit button ─────────────────────────── */
                .auth-submit {
                    border-radius: 14px;
                    font-size: 1rem;
                    letter-spacing: 0.01em;
                    margin-top: 4px;
                }

                /* ── Spinner ───────────────────────────────── */
                .auth-spinner {
                    display: inline-block;
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    border: 2px solid rgba(255,255,255,0.35);
                    border-top-color: #fff;
                    animation: spin 0.7s linear infinite;
                }
            `}</style>
    </div>
  )
}
