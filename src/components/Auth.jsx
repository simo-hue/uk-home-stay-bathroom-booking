import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { User, Lock, Loader2 } from 'lucide-react'

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
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })
            if (error) throw error
        } catch (error) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="auth-view fade-in">
            <div className="auth-content">
                <div className="auth-header">
                    <h1>Bathroom</h1>
                    <p>Shared usage organizer</p>
                </div>

                <form className="glass-card auth-card" onSubmit={handleAuth}>
                    <div className="input-group">
                        <label className="input-label">Email</label>
                        <div className="input-wrapper">
                            <User size={18} className="input-icon" />
                            <input
                                type="email"
                                className="input-field"
                                placeholder="email@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Password</label>
                        <div className="input-wrapper">
                            <Lock size={18} className="input-icon" />
                            <input
                                type="password"
                                className="input-field"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {error && <div className="auth-error">{error}</div>}

                    <button className="btn btn-primary w-full" disabled={loading}>
                        {loading ? <Loader2 className="animate-spin" /> : 'Login'}
                    </button>
                </form>
            </div>

            <style>{`
        .auth-view {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100dvh;
          padding: 20px;
        }
        .auth-content {
          width: 100%;
          max-width: 400px;
        }
        .auth-header {
          text-align: center;
          margin-bottom: 32px;
        }
        .auth-header h1 {
          font-size: 2.5rem;
          font-weight: 800;
          letter-spacing: -1px;
          background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .auth-header p {
          color: var(--text-secondary);
        }
        .auth-card {
          padding: 32px;
        }
        .input-wrapper {
          position: relative;
        }
        .input-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-secondary);
        }
        .input-wrapper .input-field {
          padding-left: 40px;
        }
        .auth-error {
          padding: 12px;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid var(--error);
          border-radius: 8px;
          color: var(--error);
          font-size: 0.875rem;
          margin-bottom: 20px;
        }
        .w-full { width: 100%; }
        .mt-4 { margin-top: 16px; }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
        </div>
    )
}
