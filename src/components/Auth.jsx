import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { Lock, Mail, User, Bath } from 'lucide-react'

export function Auth() {
  const [mode, setMode] = useState('signin')  // 'signin' | 'signup'
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [error, setError] = useState(null)
  const [successMsg, setSuccessMsg] = useState(null)

  const isSignUp = mode === 'signup'

  const switchMode = (newMode) => {
    setMode(newMode)
    setError(null)
    setSuccessMsg(null)
    setEmail('')
    setPassword('')
    setDisplayName('')
  }

  const handleAuth = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccessMsg(null)

    try {
      if (isSignUp) {
        // --- SIGN UP ---
        if (password.length < 6) throw new Error('Password must be at least 6 characters.')

        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              display_name: displayName.trim() || email.split('@')[0],
              username: email.split('@')[0],
            },
          },
        })
        if (error) throw error

        // Show a confirmation message (Supabase may require email verification)
        setSuccessMsg('Account created! Check your inbox for a confirmation email, then sign in.')
        setMode('signin')
        setEmail('')
        setPassword('')
        setDisplayName('')
      } else {
        // --- SIGN IN ---
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
      }
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

        {/* Mode toggle tabs */}
        <div className="auth-tabs" role="tablist" aria-label="Authentication mode">
          <button
            role="tab"
            aria-selected={!isSignUp}
            className={`auth-tab ${!isSignUp ? 'auth-tab--active' : ''}`}
            onClick={() => switchMode('signin')}
            type="button"
          >
            Sign In
          </button>
          <button
            role="tab"
            aria-selected={isSignUp}
            className={`auth-tab ${isSignUp ? 'auth-tab--active' : ''}`}
            onClick={() => switchMode('signup')}
            type="button"
          >
            Sign Up
          </button>
        </div>

        {/* Card */}
        <form className="auth-card glass-card-hi" onSubmit={handleAuth} noValidate>

          {/* Display name – sign-up only */}
          {isSignUp && (
            <div className="input-group auth-field-enter">
              <label className="input-label" htmlFor="auth-display-name">Your name</label>
              <div className="auth-input-wrap">
                <User size={16} className="auth-field-icon" aria-hidden="true" />
                <input
                  id="auth-display-name"
                  type="text"
                  className="input-field auth-icon-field"
                  placeholder="Jane Smith"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  autoComplete="name"
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div className="input-group">
            <label className="input-label" htmlFor="auth-email">Email</label>
            <div className="auth-input-wrap">
              <Mail size={16} className="auth-field-icon" aria-hidden="true" />
              <input
                id="auth-email"
                type="email"
                className="input-field auth-icon-field"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="input-group">
            <label className="input-label" htmlFor="auth-password">
              {isSignUp ? 'Create password' : 'Password'}
            </label>
            <div className="auth-input-wrap">
              <Lock size={16} className="auth-field-icon" aria-hidden="true" />
              <input
                id="auth-password"
                type="password"
                className="input-field auth-icon-field"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                required
              />
            </div>
            {isSignUp && (
              <p className="auth-hint">At least 6 characters.</p>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="auth-error fade-in" role="alert">
              {error}
            </div>
          )}

          {/* Success */}
          {successMsg && (
            <div className="auth-success fade-in" role="status">
              {successMsg}
            </div>
          )}

          {/* Submit */}
          <button
            className="btn btn-primary w-full auth-submit"
            disabled={loading}
            type="submit"
          >
            {loading
              ? <><span className="auth-spinner" aria-hidden="true" /> {isSignUp ? 'Creating account…' : 'Signing in…'}</>
              : isSignUp ? 'Create Account' : 'Sign In'
            }
          </button>

          {/* Footer switch link */}
          <p className="auth-footer-link">
            {isSignUp
              ? <>Already have an account?{' '}<button type="button" className="auth-link" onClick={() => switchMode('signin')}>Sign in</button></>
              : <>New here?{' '}<button type="button" className="auth-link" onClick={() => switchMode('signup')}>Create an account</button></>
            }
          </p>
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
            margin-bottom: 24px;
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

        /* ── Mode tabs ─────────────────────────────── */
        .auth-tabs {
            display: flex;
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: 14px;
            padding: 4px;
            gap: 4px;
            margin-bottom: 16px;
        }
        .auth-tab {
            flex: 1;
            padding: 10px 0;
            border-radius: 10px;
            border: none;
            background: transparent;
            color: var(--text-secondary);
            font-size: 0.9rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
            font-family: inherit;
        }
        .auth-tab:hover:not(.auth-tab--active) {
            background: rgba(255,255,255,0.06);
            color: var(--text-primary);
        }
        .auth-tab--active {
            background: linear-gradient(135deg, rgba(56,189,248,0.25), rgba(129,140,248,0.25));
            color: #fff;
            font-weight: 600;
            box-shadow: 0 2px 12px rgba(56,189,248,0.15);
            border: 1px solid rgba(56,189,248,0.2);
        }

        /* ── Card ──────────────────────────────────── */
        .auth-card {
            padding: 28px 24px;
            border-radius: 24px;
            display: flex;
            flex-direction: column;
            gap: 0;
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
        .auth-icon-field {
            padding-left: 40px !important;
        }

        /* ── Hint ──────────────────────────────────── */
        .auth-hint {
            font-size: 0.78rem;
            color: var(--text-muted);
            margin-top: 5px;
            margin-left: 2px;
        }

        /* ── Slide-in animation for new field ──────── */
        @keyframes fieldEnter {
            from { opacity: 0; transform: translateY(-8px); }
            to   { opacity: 1; transform: translateY(0); }
        }
        .auth-field-enter {
            animation: fieldEnter 0.22s ease forwards;
        }

        /* ── Error ─────────────────────────────────── */
        .auth-error {
            padding: 12px 14px;
            background: var(--error-bg);
            border: 1px solid rgba(248,113,113,0.35);
            border-radius: 12px;
            color: var(--error);
            font-size: 0.875rem;
            margin-bottom: 4px;
            line-height: 1.4;
        }

        /* ── Success ───────────────────────────────── */
        .auth-success {
            padding: 12px 14px;
            background: rgba(52,211,153,0.10);
            border: 1px solid rgba(52,211,153,0.30);
            border-radius: 12px;
            color: #34d399;
            font-size: 0.875rem;
            margin-bottom: 4px;
            line-height: 1.4;
        }

        /* ── Submit button ─────────────────────────── */
        .auth-submit {
            border-radius: 14px;
            font-size: 1rem;
            letter-spacing: 0.01em;
            margin-top: 8px;
        }

        /* ── Footer link ───────────────────────────── */
        .auth-footer-link {
            text-align: center;
            font-size: 0.85rem;
            color: var(--text-secondary);
            margin-top: 16px;
            margin-bottom: 0;
        }
        .auth-link {
            background: none;
            border: none;
            color: var(--accent-primary);
            font-size: inherit;
            font-family: inherit;
            cursor: pointer;
            padding: 0;
            font-weight: 500;
            text-decoration: underline;
            text-underline-offset: 2px;
            transition: opacity 0.15s;
        }
        .auth-link:hover { opacity: 0.8; }

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
