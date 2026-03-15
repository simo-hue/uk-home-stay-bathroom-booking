import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import {
    Calendar,
    Clock,
    Plus,
    LogOut,
    Trash2,
    User as UserIcon,
    Sparkles,
    CalendarCheck,
    X,
    AlertCircle,
    CheckCircle2,
    Bath
} from 'lucide-react'

/* ─────────────────────────────────────────────────────────────
   DASHBOARD
───────────────────────────────────────────────────────────── */
export function Dashboard({ session }) {
    const [activeTab, setActiveTab] = useState('today')
    const [reservations, setReservations] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [profile, setProfile] = useState(null)
    const [dialog, setDialog] = useState({ show: false, title: '', message: '', type: 'confirm', onConfirm: null })

    useEffect(() => {
        fetchProfile()
        fetchReservations()
        const channel = supabase
            .channel('schema-db-changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'reservations' }, fetchReservations)
            .subscribe()
        return () => supabase.removeChannel(channel)
    }, [activeTab])

    const fetchProfile = async () => {
        const { data, error } = await supabase
            .from('profiles').select('*').eq('id', session.user.id).maybeSingle()
        if (!error && data) setProfile(data)
    }

    const fetchReservations = async () => {
        setLoading(true)
        const start = new Date()
        if (activeTab === 'tomorrow') start.setDate(start.getDate() + 1)
        start.setHours(0, 0, 0, 0)
        const end = new Date(start)
        end.setHours(23, 59, 59, 999)
        const { data, error } = await supabase
            .from('reservations')
            .select('*, profiles (username, display_name)')
            .gte('start_time', start.toISOString())
            .lte('start_time', end.toISOString())
            .order('start_time', { ascending: true })
        if (!error) setReservations(data || [])
        setLoading(false)
    }

    const handleSignOut = () => supabase.auth.signOut()

    const deleteReservation = (id) => {
        setDialog({
            show: true,
            title: 'Cancel Booking',
            message: 'Are you sure you want to remove this bathroom slot?',
            type: 'confirm',
            onConfirm: async () => {
                const { error } = await supabase.from('reservations').delete().eq('id', id)
                if (!error) fetchReservations()
                setDialog({
                    show: true,
                    title: error ? 'Error' : 'Removed!',
                    message: error ? 'Could not remove booking. Please try again.' : 'Your bathroom slot has been cancelled.',
                    type: error ? 'alert' : 'success'
                })
            }
        })
    }

    const displayName = profile?.display_name || session.user.email?.split('@')[0] || 'User'
    const initials = displayName.slice(0, 2).toUpperCase()

    return (
        <div className="dashboard">
            {/* ── Header ───────────────────────────────────── */}
            <header className="dash-header">
                <div className="dash-user">
                    <div className="dash-avatar" aria-hidden="true">{initials}</div>
                    <div className="dash-welcome">
                        <p className="dash-greeting">Hi, {displayName} 👋</p>
                        <p className="dash-sub">Ready for your slot?</p>
                    </div>
                </div>
                <button className="dash-signout" onClick={handleSignOut} aria-label="Sign out">
                    <LogOut size={18} />
                </button>
            </header>

            {/* ── Tabs ─────────────────────────────────────── */}
            <div className="dash-tabs glass-card" role="tablist">
                {['today', 'tomorrow'].map(tab => (
                    <button
                        key={tab}
                        role="tab"
                        aria-selected={activeTab === tab}
                        className={`dash-tab ${activeTab === tab ? 'dash-tab--active' : ''}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab === 'today' ? 'Today' : 'Tomorrow'}
                    </button>
                ))}
            </div>

            {/* ── Content ──────────────────────────────────── */}
            <main className="dash-scroll" role="tabpanel">
                {loading ? (
                    <div className="dash-status">
                        <div className="dash-loader" />
                        <span>Loading slots…</span>
                    </div>
                ) : reservations.length === 0 ? (
                    <div className="empty-state glass-card fade-in">
                        <div className="empty-icon">
                            <Bath size={32} strokeWidth={1.5} />
                        </div>
                        <h2 className="empty-title">All clear!</h2>
                        <p className="empty-body">No bookings yet for {activeTab}.</p>
                        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                            <Plus size={18} /> Book the first slot
                        </button>
                    </div>
                ) : (
                    <div className="res-list">
                        {reservations.map((res, i) => {
                            const isOwn = res.user_id === session.user.id
                            const startDate = new Date(res.start_time)
                            const endDate = new Date(startDate.getTime() + res.duration_minutes * 60000)
                            const fmt = (d) => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            return (
                                <div
                                    key={res.id}
                                    className={`res-card glass-card fade-in ${isOwn ? 'res-card--own' : ''}`}
                                    style={{ animationDelay: `${i * 40}ms` }}
                                >
                                    <div className="res-time-col">
                                        <span className="res-time-start">{fmt(startDate)}</span>
                                        <div className="res-time-bar" />
                                        <span className="res-time-end">{fmt(endDate)}</span>
                                    </div>
                                    <div className="res-info">
                                        <span className="res-name">{res.profiles?.display_name || res.profiles?.username}</span>
                                        <span className="res-dur">{res.duration_minutes} min</span>
                                    </div>
                                    {isOwn && (
                                        <button
                                            className="res-delete"
                                            onClick={() => deleteReservation(res.id)}
                                            aria-label="Delete booking"
                                        >
                                            <Trash2 size={17} />
                                        </button>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                )}
                {/* Spacer so FAB doesn't overlap last card */}
                <div className="fab-spacer" />
            </main>

            {/* ── FAB ──────────────────────────────────────── */}
            <button
                className="fab btn-primary"
                onClick={() => setShowModal(true)}
                aria-label="New booking"
            >
                <Plus size={26} strokeWidth={2.5} />
            </button>

            {/* ── Modal ────────────────────────────────────── */}
            {showModal && (
                <BookingModal
                    activeTab={activeTab}
                    onClose={() => setShowModal(false)}
                    onSuccess={() => { setShowModal(false); fetchReservations() }}
                    setDialog={setDialog}
                    userId={session.user.id}
                    existingReservations={reservations}
                />
            )}

            {/* ── Dialog ───────────────────────────────────── */}
            {dialog.show && (
                <CustomDialog
                    {...dialog}
                    onClose={() => setDialog(d => ({ ...d, show: false }))}
                />
            )}

            <style>{`
                /* ── Dashboard shell ─────────────────────── */
                .dashboard {
                    display: flex;
                    flex-direction: column;
                    height: 100dvh;
                    max-width: 520px;
                    margin: 0 auto;
                    padding: 0 16px;
                    padding-top:    max(16px, env(safe-area-inset-top)    + 12px);
                    padding-bottom: max(0px,  env(safe-area-inset-bottom));
                    position: relative;
                    overflow: hidden;
                }

                /* ── Header ─────────────────────────────── */
                .dash-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 12px;
                    margin-bottom: 20px;
                    min-height: 56px;
                    flex-shrink: 0;
                }
                .dash-user {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    min-width: 0;
                }
                .dash-avatar {
                    flex-shrink: 0;
                    width: 42px;
                    height: 42px;
                    border-radius: 14px;
                    background: linear-gradient(135deg, rgba(56,189,248,0.25), rgba(129,140,248,0.25));
                    border: 1px solid var(--glass-border-hi);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.8125rem;
                    font-weight: 700;
                    letter-spacing: 0.03em;
                    color: var(--accent-primary);
                }
                .dash-welcome { min-width: 0; }
                .dash-greeting {
                    font-size: 1rem;
                    font-weight: 700;
                    color: var(--text-primary);
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .dash-sub {
                    font-size: 0.8125rem;
                    color: var(--text-secondary);
                    margin-top: 1px;
                }
                .dash-signout {
                    flex-shrink: 0;
                    width: 44px;
                    height: 44px;
                    border-radius: 12px;
                    background: var(--bg-surface);
                    border: 1px solid var(--glass-border);
                    color: var(--text-secondary);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: background var(--t-base) ease, color var(--t-base) ease;
                }
                .dash-signout:active { background: rgba(255,255,255,0.08); color: var(--text-primary); }

                /* ── Tabs ───────────────────────────────── */
                .dash-tabs {
                    display: flex;
                    padding: 4px;
                    margin-bottom: 16px;
                    border-radius: 16px;
                    flex-shrink: 0;
                }
                .dash-tab {
                    flex: 1;
                    min-height: 44px;
                    border: none;
                    background: transparent;
                    color: var(--text-secondary);
                    font-family: inherit;
                    font-size: 0.9375rem;
                    font-weight: 600;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: background var(--t-base) ease, color var(--t-base) ease;
                    user-select: none;
                    -webkit-user-select: none;
                }
                .dash-tab--active {
                    background: rgba(255,255,255,0.1);
                    color: var(--text-primary);
                }
                .dash-tab:active { opacity: 0.7; }

                /* ── Scroll area ────────────────────────── */
                .dash-scroll {
                    flex: 1;
                    overflow-y: auto;
                    overflow-x: hidden;
                    -webkit-overflow-scrolling: touch;
                    overscroll-behavior: contain;
                }
                .fab-spacer { height: 96px; }

                /* ── Loading ────────────────────────────── */
                .dash-status {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 12px;
                    padding-top: 64px;
                    color: var(--text-secondary);
                    font-size: 0.9rem;
                }
                .dash-loader {
                    width: 28px;
                    height: 28px;
                    border-radius: 50%;
                    border: 2.5px solid var(--glass-border);
                    border-top-color: var(--accent-primary);
                    animation: spin 0.8s linear infinite;
                }

                /* ── Empty state ────────────────────────── */
                .empty-state {
                    margin-top: 12px;
                    padding: 48px 24px 40px;
                    text-align: center;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 10px;
                }
                .empty-icon {
                    width: 72px;
                    height: 72px;
                    border-radius: 22px;
                    background: rgba(56,189,248,0.1);
                    border: 1px solid rgba(56,189,248,0.2);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--accent-primary);
                    margin-bottom: 6px;
                }
                .empty-title {
                    font-size: 1.25rem;
                    font-weight: 700;
                }
                .empty-body {
                    color: var(--text-secondary);
                    font-size: 0.9375rem;
                    margin-bottom: 8px;
                }

                /* ── Reservation list ───────────────────── */
                .res-list {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    padding-top: 4px;
                }
                .res-card {
                    display: flex;
                    align-items: center;
                    gap: 14px;
                    padding: 14px 16px;
                    border-radius: 18px;
                    transition: transform var(--t-fast) ease, box-shadow var(--t-fast) ease;
                }
                .res-card--own {
                    border-color: rgba(56,189,248,0.22);
                    background: rgba(56,189,248,0.06);
                }

                /* Time column */
                .res-time-col {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 3px;
                    min-width: 52px;
                }
                .res-time-start {
                    font-size: 0.9375rem;
                    font-weight: 700;
                    color: var(--accent-primary);
                    line-height: 1;
                }
                .res-time-bar {
                    width: 2px;
                    height: 12px;
                    background: linear-gradient(to bottom, var(--accent-primary), var(--accent-secondary));
                    border-radius: 1px;
                    opacity: 0.5;
                }
                .res-time-end {
                    font-size: 0.75rem;
                    color: var(--text-secondary);
                    line-height: 1;
                }

                /* Info column */
                .res-info {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 3px;
                    min-width: 0;
                }
                .res-name {
                    font-size: 0.9375rem;
                    font-weight: 600;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .res-dur {
                    font-size: 0.8125rem;
                    color: var(--text-secondary);
                }

                /* Delete button */
                .res-delete {
                    flex-shrink: 0;
                    width: 44px;
                    height: 44px;
                    border-radius: 50%;
                    background: transparent;
                    border: none;
                    color: var(--error);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 0.55;
                    transition: opacity var(--t-base) ease, background var(--t-base) ease;
                }
                .res-delete:active {
                    opacity: 1;
                    background: rgba(248,113,113,0.12);
                    transform: scale(0.92);
                }

                /* ── FAB ──────────────────────────────── */
                .fab {
                    position: fixed;
                    bottom: max(28px, env(safe-area-inset-bottom) + 20px);
                    right: 24px;
                    width: 60px;
                    height: 60px;
                    border-radius: 20px;
                    border: none;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 8px 28px rgba(56,189,248,0.35), 0 4px 12px rgba(0,0,0,0.4);
                    z-index: 90;
                    transition: transform var(--t-fast) var(--ease-bounce), box-shadow var(--t-fast) ease;
                }
                .fab:active {
                    transform: scale(0.93) translateY(2px);
                    box-shadow: 0 4px 12px rgba(56,189,248,0.25);
                }

                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>
        </div>
    )
}

/* ─────────────────────────────────────────────────────────────
   BOOKING MODAL
───────────────────────────────────────────────────────────── */
function BookingModal({ activeTab, onClose, onSuccess, setDialog, userId, existingReservations }) {
    const [time, setTime] = useState('')
    const [duration, setDuration] = useState(10)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const start = new Date()
        if (activeTab === 'tomorrow') start.setDate(start.getDate() + 1)
        const [hours, minutes] = time.split(':')
        start.setHours(parseInt(hours), parseInt(minutes), 0, 0)

        // Cannot book in the past (60s grace so "Now" always works)
        if (start.getTime() < new Date().getTime() - 60000) {
            setError('You cannot book a slot in the past.')
            setLoading(false)
            return
        }

        const newStart = start.getTime()
        const newEnd = newStart + duration * 60000
        const overlap = existingReservations.some(res => {
            const rs = new Date(res.start_time).getTime()
            const re = rs + res.duration_minutes * 60000
            return newStart < re && newEnd > rs
        })

        if (overlap) {
            setError('This slot overlaps with another booking.')
            setLoading(false)
            return
        }

        const { error: dbError } = await supabase.from('reservations').insert({
            user_id: userId,
            start_time: start.toISOString(),
            duration_minutes: duration
        })

        if (dbError) {
            setError(dbError.message)
        } else {
            onSuccess()
            setDialog({ show: true, title: 'Booked! 🎉', message: 'Your bathroom session is locked in.', type: 'success' })
        }
        setLoading(false)
    }

    const setNow = () => {
        const n = new Date()
        setTime(`${String(n.getHours()).padStart(2, '0')}:${String(n.getMinutes()).padStart(2, '0')}`)
    }

    return (
        <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Book a slot">
            <div className="modal-sheet glass-card-hi" onClick={e => e.stopPropagation()}>
                {/* Handle bar (mobile swipe hint) */}
                <div className="modal-handle" aria-hidden="true" />

                {/* Header */}
                <div className="modal-head">
                    <div className="modal-head-left">
                        <div className="modal-icon-bg" aria-hidden="true">
                            <CalendarCheck size={20} />
                        </div>
                        <div>
                            <h2 className="modal-title">Book Slot</h2>
                            <p className="modal-sub">Scheduling for <strong>{activeTab}</strong></p>
                        </div>
                    </div>
                    <button className="modal-close" onClick={onClose} aria-label="Close">
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} noValidate>
                    {/* Time */}
                    <div className="input-group">
                        <label className="input-label" htmlFor="bm-time">What time?</label>
                        <div className="bm-time-row">
                            <div className="bm-time-wrap">
                                <Clock size={17} className="bm-field-icon" aria-hidden="true" />
                                <input
                                    id="bm-time"
                                    type="time"
                                    className="input-field bm-time-input"
                                    value={time}
                                    onChange={e => setTime(e.target.value)}
                                    required
                                />
                            </div>
                            {activeTab === 'today' && (
                                <button
                                    type="button"
                                    className="btn btn-secondary now-btn"
                                    onClick={setNow}
                                >
                                    <Sparkles size={15} />
                                    <span>Now</span>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Duration */}
                    <div className="input-group">
                        <label className="input-label">How long?</label>
                        <div className="chip-grid">
                            {[10, 15, 20, 30, 45, 60].map(d => (
                                <button
                                    key={d}
                                    type="button"
                                    className={`chip ${duration === d ? 'chip--active' : ''}`}
                                    onClick={() => setDuration(d)}
                                >
                                    <span className="chip-val">{d}</span>
                                    <span className="chip-unit">min</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="modal-error fade-in" role="alert">
                            <AlertCircle size={15} style={{ flexShrink: 0 }} />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        className="btn btn-primary modal-submit"
                        disabled={loading || !time}
                    >
                        {loading
                            ? <><span className="auth-spinner" /> Booking…</>
                            : 'Confirm Reservation'
                        }
                    </button>
                </form>
            </div>

            <style>{`
                /* ── Overlay ──────────────────────────── */
                .modal-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(0,0,0,0.5);
                    backdrop-filter: blur(6px);
                    -webkit-backdrop-filter: blur(6px);
                    display: flex;
                    align-items: flex-end;
                    justify-content: center;
                    padding: 0 0 env(safe-area-inset-bottom);
                    z-index: 100;
                }
                @media (min-height: 600px) and (min-width: 480px) {
                    .modal-overlay {
                        align-items: center;
                        padding: 20px;
                        padding-bottom: max(20px, env(safe-area-inset-bottom));
                    }
                    .modal-sheet {
                        border-radius: 24px !important;
                        max-height: 90dvh;
                    }
                }

                /* ── Sheet ────────────────────────────── */
                .modal-sheet {
                    width: 100%;
                    max-width: 480px;
                    padding: 12px 20px 24px;
                    border-radius: 28px 28px 0 0;
                    border-bottom: none;
                    max-height: 95dvh;
                    overflow-y: auto;
                    -webkit-overflow-scrolling: touch;
                }

                /* ── Handle ───────────────────────────── */
                .modal-handle {
                    width: 40px;
                    height: 4px;
                    border-radius: 2px;
                    background: rgba(255,255,255,0.2);
                    margin: 0 auto 16px;
                }
                @media (min-width: 480px) { .modal-handle { display: none; } }

                /* ── Header ───────────────────────────── */
                .modal-head {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 12px;
                    margin-bottom: 24px;
                }
                .modal-head-left {
                    display: flex;
                    align-items: center;
                    gap: 14px;
                }
                .modal-icon-bg {
                    width: 46px;
                    height: 46px;
                    border-radius: 14px;
                    background: linear-gradient(135deg, rgba(56,189,248,0.18), rgba(129,140,248,0.18));
                    border: 1px solid rgba(56,189,248,0.2);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--accent-primary);
                    flex-shrink: 0;
                }
                .modal-title {
                    font-size: 1.375rem;
                    font-weight: 700;
                    line-height: 1;
                    margin-bottom: 3px;
                }
                .modal-sub {
                    font-size: 0.8375rem;
                    color: var(--text-secondary);
                }
                .modal-close {
                    width: 44px;
                    height: 44px;
                    border-radius: 12px;
                    background: var(--bg-surface);
                    border: 1px solid var(--glass-border);
                    color: var(--text-secondary);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                    transition: background var(--t-base) ease;
                }
                .modal-close:active { background: rgba(255,255,255,0.1); }

                /* ── Time row ────────────────────────── */
                .bm-time-row {
                    display: flex;
                    gap: 10px;
                    align-items: stretch;
                }
                .bm-time-wrap {
                    flex: 1;
                    position: relative;
                    display: flex;
                    align-items: center;
                }
                .bm-field-icon {
                    position: absolute;
                    left: 13px;
                    color: var(--text-muted);
                    pointer-events: none;
                    z-index: 1;
                }
                .bm-time-input {
                    padding-left: 40px !important;
                    min-height: 52px;
                    color-scheme: dark;
                }

                /* ── Now button ──────────────────────── */
                .now-btn {
                    flex-shrink: 0;
                    min-height: 52px;
                    padding: 0 18px;
                    border-radius: 12px;
                    font-size: 0.9rem;
                    gap: 6px;
                }

                /* ── Chips ───────────────────────────── */
                .chip-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 9px;
                }
                .chip {
                    min-height: 58px;
                    padding: 10px 6px;
                    border-radius: 14px;
                    border: 1px solid var(--glass-border);
                    background: var(--bg-surface);
                    color: var(--text-secondary);
                    cursor: pointer;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 2px;
                    font-family: inherit;
                    transition: all var(--t-base) ease;
                    user-select: none;
                    -webkit-user-select: none;
                }
                .chip:active { transform: scale(0.95); }
                .chip--active {
                    background: var(--accent-grad);
                    color: #fff;
                    border-color: transparent;
                    box-shadow: 0 4px 14px rgba(56,189,248,0.30);
                    transform: translateY(-2px);
                }
                .chip-val {
                    font-size: 1.125rem;
                    font-weight: 700;
                    line-height: 1;
                }
                .chip-unit {
                    font-size: 0.6875rem;
                    font-weight: 500;
                    opacity: 0.75;
                }

                /* ── Error ───────────────────────────── */
                .modal-error {
                    display: flex;
                    align-items: flex-start;
                    gap: 8px;
                    padding: 12px 14px;
                    background: var(--error-bg);
                    border: 1px solid rgba(248,113,113,0.3);
                    border-radius: 12px;
                    color: var(--error);
                    font-size: 0.875rem;
                    margin-bottom: 16px;
                    line-height: 1.4;
                }

                /* ── Submit ──────────────────────────── */
                .modal-submit {
                    width: 100%;
                    min-height: 54px;
                    border-radius: 16px;
                    font-size: 1.0625rem;
                    margin-top: 24px;
                }

                .auth-spinner {
                    display: inline-block;
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    border: 2px solid rgba(255,255,255,0.35);
                    border-top-color: #fff;
                    animation: spin 0.7s linear infinite;
                    flex-shrink: 0;
                }
            `}</style>
        </div>
    )
}

/* ─────────────────────────────────────────────────────────────
   CUSTOM DIALOG
───────────────────────────────────────────────────────────── */
function CustomDialog({ title, message, type, onConfirm, onClose }) {
    const icon = type === 'success'
        ? <CheckCircle2 size={36} style={{ color: 'var(--success)' }} />
        : <AlertCircle size={36} style={{ color: type === 'confirm' ? 'var(--accent-primary)' : 'var(--error)' }} />

    return (
        <div
            className="modal-overlay dialog-overlay"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
        >
            <div className="dialog-box glass-card-hi" onClick={e => e.stopPropagation()}>
                <div className="dialog-icon">{icon}</div>
                <h2 className="dialog-title">{title}</h2>
                <p className="dialog-msg">{message}</p>
                <div className="dialog-actions">
                    {type === 'confirm' ? (
                        <>
                            <button className="btn btn-secondary dialog-btn" onClick={onClose}>
                                No, keep it
                            </button>
                            <button className="btn btn-primary dialog-btn" onClick={() => { onConfirm?.(); onClose() }}>
                                Yes, remove
                            </button>
                        </>
                    ) : (
                        <button className="btn btn-primary dialog-btn" onClick={onClose}>Got it</button>
                    )}
                </div>
            </div>

            <style>{`
                .dialog-overlay {
                    align-items: center !important;
                    padding: 24px !important;
                    padding-bottom: max(24px, env(safe-area-inset-bottom) + 16px) !important;
                }
                .dialog-box {
                    width: 100%;
                    max-width: 340px;
                    padding: 32px 24px 28px;
                    border-radius: 28px;
                    text-align: center;
                    border: 1px solid var(--glass-border-hi);
                }
                .dialog-icon {
                    margin-bottom: 16px;
                    display: flex;
                    justify-content: center;
                }
                .dialog-title {
                    font-size: 1.25rem;
                    font-weight: 700;
                    margin-bottom: 8px;
                }
                .dialog-msg {
                    font-size: 0.9375rem;
                    color: var(--text-secondary);
                    margin-bottom: 28px;
                    line-height: 1.5;
                }
                .dialog-actions {
                    display: flex;
                    gap: 10px;
                }
                .dialog-btn {
                    flex: 1;
                    min-height: 48px;
                    border-radius: 14px;
                    font-size: 0.9375rem;
                }
            `}</style>
        </div>
    )
}
