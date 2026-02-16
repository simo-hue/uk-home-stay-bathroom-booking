import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import {
    Calendar,
    Clock,
    Plus,
    LogOut,
    Trash2,
    ChevronRight,
    User as UserIcon,
    Sparkles,
    CalendarCheck,
    X,
    AlertCircle,
    CheckCircle2
} from 'lucide-react'

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

        // Subscribe to changes
        const channel = supabase
            .channel('schema-db-changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'reservations' }, () => {
                fetchReservations()
            })
            .subscribe()

        return () => supabase.removeChannel(channel)
    }, [activeTab])

    const fetchProfile = async () => {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle()

        if (error) {
            console.error('Error fetching profile:', error.message)
        }
        if (data) {
            setProfile(data)
        }
    }

    const fetchReservations = async () => {
        setLoading(true)
        const start = new Date()
        if (activeTab === 'tomorrow') {
            start.setDate(start.getDate() + 1)
        }
        start.setHours(0, 0, 0, 0)

        const end = new Date(start)
        end.setHours(23, 59, 59, 999)

        const { data, error } = await supabase
            .from('reservations')
            .select(`
                *,
                profiles (username, display_name)
            `)
            .gte('start_time', start.toISOString())
            .lte('start_time', end.toISOString())
            .order('start_time', { ascending: true })

        if (error) {
            console.error('Error fetching reservations:', error.message)
        } else {
            setReservations(data || [])
        }
        setLoading(false)
    }

    const handleSignOut = () => supabase.auth.signOut()

    const deleteReservation = async (id) => {
        setDialog({
            show: true,
            title: 'Cancel Booking',
            message: 'Are you sure you want to remove this bathroom slot?',
            type: 'confirm',
            onConfirm: async () => {
                const { error } = await supabase.from('reservations').delete().eq('id', id)
                if (error) {
                    setDialog({
                        show: true,
                        title: 'Error',
                        message: 'Could not remove booking. Please try again.',
                        type: 'alert'
                    })
                } else {
                    setDialog({
                        show: true,
                        title: 'Removed!',
                        message: 'Your bathroom slot has been cancelled.',
                        type: 'success'
                    })
                }
            }
        })
    }

    return (
        <div className="dashboard fade-in">
            <header className="dash-header">
                <div className="user-info">
                    <div className="avatar">
                        <UserIcon size={20} />
                    </div>
                    <div className="welcome">
                        <h3>Hi, {profile?.display_name || session.user.email?.split('@')[0] || 'User'}</h3>
                        <p>Ready for your slot?</p>
                    </div>
                </div>
                <button className="icon-btn" onClick={handleSignOut}>
                    <LogOut size={20} />
                </button>
            </header>

            <main className="dash-main">
                <div className="tabs glass-card">
                    <button
                        className={`tab ${activeTab === 'today' ? 'active' : ''}`}
                        onClick={() => setActiveTab('today')}
                    >
                        Today
                    </button>
                    <button
                        className={`tab ${activeTab === 'tomorrow' ? 'active' : ''}`}
                        onClick={() => setActiveTab('tomorrow')}
                    >
                        Tomorrow
                    </button>
                </div>

                <div className="content-scroll">
                    {loading ? (
                        <div className="status-msg">Loading slots...</div>
                    ) : reservations.length === 0 ? (
                        <div className="empty-state glass-card">
                            <Calendar size={40} className="mb-4 text-secondary" />
                            <p>No bookings yet for {activeTab}.</p>
                            <button className="btn btn-primary mt-4" onClick={() => setShowModal(true)}>
                                Book the first slot
                            </button>
                        </div>
                    ) : (
                        <div className="reservation-list">
                            {reservations.map((res) => (
                                <div key={res.id} className="reservation-card glass-card fade-in">
                                    <div className="res-time">
                                        <Clock size={16} />
                                        <span>{new Date(res.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                    <div className="res-info">
                                        <span className="res-user">{res.profiles?.display_name || res.profiles?.username}</span>
                                        <span className="res-duration">{res.duration_minutes} min</span>
                                    </div>
                                    {res.user_id === session.user.id && (
                                        <button className="remove-btn icon-only" onClick={() => deleteReservation(res.id)}>
                                            <Trash2 size={20} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <button className="fab btn-primary" onClick={() => setShowModal(true)}>
                <Plus size={24} />
            </button>

            {showModal && (
                <BookingModal
                    activeTab={activeTab}
                    onClose={() => setShowModal(false)}
                    onSuccess={() => {
                        setShowModal(false)
                        fetchReservations()
                    }}
                    setDialog={setDialog}
                    userId={session.user.id}
                    existingReservations={reservations}
                />
            )}

            {dialog.show && (
                <CustomDialog
                    {...dialog}
                    onClose={() => setDialog({ ...dialog, show: false })}
                />
            )}

            <style>{`
        .dashboard {
          max-width: 500px;
          margin: 0 auto;
          height: 100dvh;
          display: flex;
          flex-direction: column;
          padding: 20px;
          position: relative;
        }
        .dash-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }
        .user-info {
          display: flex;
          gap: 12px;
          align-items: center;
        }
        .avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--bg-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--glass-border);
        }
        .welcome h3 { font-size: 1.125rem; }
        .welcome p { color: var(--text-secondary); font-size: 0.875rem; }
        .icon-btn {
          background: none;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
        }
        .tabs {
          display: flex;
          padding: 4px;
          margin-bottom: 24px;
        }
        .tab {
          flex: 1;
          padding: 10px;
          border: none;
          background: none;
          color: var(--text-secondary);
          font-weight: 600;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .tab.active {
          background: rgba(255, 255, 255, 0.1);
          color: white;
        }
        .content-scroll {
          flex: 1;
          overflow-y: auto;
          padding-bottom: 80px;
        }
        .empty-state {
          padding: 48px 24px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .reservation-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .reservation-card {
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .res-time {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          color: var(--accent-primary);
          font-weight: 700;
          font-size: 0.875rem;
          min-width: 60px;
        }
        .res-info {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .res-user { font-weight: 600; }
        .res-duration { font-size: 0.75rem; color: var(--text-secondary); }
        .remove-btn {
          background: none;
          border: none;
          color: var(--error);
          padding: 8px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          opacity: 0.6;
        }
        .remove-btn:hover { background: rgba(239, 68, 68, 0.1); opacity: 1; }
        .remove-btn:active { transform: scale(0.9); }
        .fab {
          position: absolute;
          bottom: 32px;
          right: 32px;
          width: 56px;
          height: 56px;
          border-radius: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
          z-index: 10;
        }
        .mb-4 { margin-bottom: 16px; }
        .text-secondary { color: var(--text-secondary); }
      `}</style>
        </div>
    )
}

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

        // Validation: Cannot book in the past
        if (start.getTime() < new Date().getTime()) {
            setError('You cannot book a slot in the past.')
            setLoading(false)
            return
        }

        // Basic overlap check (local)
        const newStart = start.getTime()
        const newEnd = newStart + duration * 60000

        const overlap = existingReservations.some(res => {
            const resStart = new Date(res.start_time).getTime()
            const resEnd = resStart + res.duration_minutes * 60000
            return (newStart < resEnd && newEnd > resStart)
        })

        if (overlap) {
            setError('This slot overlaps with another booking.')
            setLoading(false)
            return
        }

        const { error } = await supabase.from('reservations').insert({
            user_id: userId,
            start_time: start.toISOString(),
            duration_minutes: duration
        })

        if (error) {
            setError(error.message)
        } else {
            onSuccess()
            setDialog({
                show: true,
                title: 'Booked!',
                message: 'Your bathroom session is locked in.',
                type: 'success'
            })
        }
        setLoading(false)
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content glass-card slide-up" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="modal-title-wrapper">
                        <div className="modal-icon-bg">
                            <CalendarCheck size={20} className="text-accent" />
                        </div>
                        <div>
                            <h2>Book Slot</h2>
                            <p className="modal-subtitle">Schedule for {activeTab}</p>
                        </div>
                    </div>
                    <button className="close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="input-group">
                        <label className="input-label">What time?</label>
                        <div className="time-input-wrapper">
                            <div className="input-with-icon">
                                <Clock size={18} className="field-icon" />
                                <input
                                    type="time"
                                    className="input-field pl-10"
                                    value={time}
                                    onChange={e => setTime(e.target.value)}
                                    required
                                />
                            </div>
                            {activeTab === 'today' && (
                                <button
                                    type="button"
                                    className="btn btn-secondary now-btn"
                                    onClick={() => {
                                        const now = new Date();
                                        const hours = String(now.getHours()).padStart(2, '0');
                                        const minutes = String(now.getMinutes()).padStart(2, '0');
                                        setTime(`${hours}:${minutes}`);
                                    }}
                                >
                                    <Sparkles size={14} />
                                    <span>Now</span>
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label">How long?</label>
                        <div className="chip-grid">
                            {[10, 15, 20, 30, 45, 60].map(d => (
                                <button
                                    key={d}
                                    type="button"
                                    className={`duration-chip ${duration === d ? 'active' : ''}`}
                                    onClick={() => setDuration(d)}
                                >
                                    <span className="duration-value">{d}</span>
                                    <span className="duration-unit">min</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {error && <div className="error-box fade-in">{error}</div>}

                    <div className="modal-footer">
                        <button type="submit" className="btn btn-primary submit-btn" disabled={loading || !time}>
                            {loading ? 'Booking...' : 'Confirm Reservation'}
                        </button>
                    </div>
                </form>
            </div>
            <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          display: flex;
          align-items: flex-end;
          padding: 20px;
          padding-bottom: calc(20px + env(safe-area-inset-bottom));
          z-index: 100;
        }
        .modal-content {
          width: 100%;
          max-width: 460px;
          margin: 0 auto;
          padding: 24px;
          border-radius: 24px 24px 0 0;
          border-bottom: none;
        }
        @media (min-width: 500px) {
          .modal-overlay { align-items: center; }
          .modal-content { border-radius: 24px; border-bottom: 1px solid var(--glass-border); }
        }
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 24px;
        }
        .modal-title-wrapper {
          display: flex;
          gap: 16px;
          align-items: center;
        }
        .modal-icon-bg {
          width: 44px;
          height: 44px;
          background: rgba(56, 189, 248, 0.1);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .modal-content h2 { margin-bottom: 0; font-size: 1.5rem; }
        .modal-subtitle { color: var(--text-secondary); font-size: 0.875rem; }
        .close-btn { background: none; border: none; color: var(--text-secondary); cursor: pointer; padding: 4px; }
        .input-with-icon { position: relative; flex: 1; min-width: 0; }
        .field-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--text-secondary); pointer-events: none; z-index: 1; }
        .pl-10 { padding-left: 40px !important; }
        .chip-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
        .duration-chip {
          padding: 12px 8px;
          border-radius: 14px;
          border: 1px solid var(--glass-border);
          background: var(--bg-secondary);
          color: var(--text-secondary);
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          transition: all 0.2s;
        }
        .duration-chip.active {
          background: var(--accent-primary);
          color: white;
          border-color: var(--accent-primary);
          box-shadow: 0 4px 12px rgba(56, 189, 248, 0.3);
          transform: translateY(-2px);
        }
        .duration-value { font-size: 1.125rem; font-weight: 700; line-height: 1; }
        .duration-unit { font-size: 0.75rem; opacity: 0.8; }
        .error-box { 
          padding: 12px; 
          background: rgba(239, 68, 68, 0.1); 
          border: 1px solid var(--error); 
          border-radius: 12px; 
          color: var(--error); 
          font-size: 0.875rem; 
          margin-bottom: 20px;
        }
        .modal-footer { margin-top: 32px; }
        .submit-btn { width: 100%; padding: 16px; border-radius: 16px; font-size: 1.125rem; }
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .slide-up { animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
        .text-accent { color: var(--accent-primary); }
        .time-input-wrapper { 
          display: flex; 
          gap: 10px; 
          align-items: stretch;
          width: 100%;
        }
        .now-btn { 
          flex-shrink: 0;
          white-space: nowrap;
          height: auto; 
          padding: 0 16px; 
          font-size: 0.875rem;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s ease;
        }
        .now-btn:active {
          transform: scale(0.95);
          background: rgba(255, 255, 255, 0.1);
        }
        @media (max-width: 360px) {
          .time-input-wrapper { gap: 6px; }
          .now-btn { padding: 0 10px; font-size: 0.75rem; gap: 4px; }
        }
      `}</style>
        </div>
    )
}
function CustomDialog({ title, message, type, onConfirm, onClose }) {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="dialog-content glass-card slide-up" onClick={e => e.stopPropagation()}>
                <div className="dialog-icon-wrapper">
                    {type === 'confirm' ? (
                        <AlertCircle size={32} className="text-accent" />
                    ) : type === 'success' ? (
                        <CheckCircle2 size={32} className="text-success" />
                    ) : (
                        <AlertCircle size={32} className="text-error" />
                    )}
                </div>
                <div className="dialog-text">
                    <h2>{title}</h2>
                    <p>{message}</p>
                </div>
                <div className="dialog-footer">
                    {type === 'confirm' ? (
                        <>
                            <button className="btn btn-secondary flex-1" onClick={onClose}>No, keep it</button>
                            <button className="btn btn-primary flex-1" onClick={() => {
                                onConfirm();
                                onClose();
                            }}>Yes, remove</button>
                        </>
                    ) : (
                        <button className="btn btn-primary w-full" onClick={onClose}>Got it</button>
                    )}
                </div>
            </div>
            <style>{`
                .dialog-content {
                    width: 100%;
                    max-width: 320px;
                    margin: 0 auto;
                    padding: 32px 24px;
                    text-align: center;
                    border-radius: 28px;
                }
                .dialog-icon-wrapper {
                    margin-bottom: 20px;
                    display: flex;
                    justify-content: center;
                }
                .dialog-text h2 {
                    font-size: 1.25rem;
                    margin-bottom: 8px;
                }
                .dialog-text p {
                    color: var(--text-secondary);
                    font-size: 0.9375rem;
                    margin-bottom: 32px;
                }
                .dialog-footer {
                    display: flex;
                    gap: 12px;
                }
                .flex-1 { flex: 1; }
                .text-error { color: var(--error); }
                .text-success { color: var(--success); }
                @media (max-width: 500px) {
                    .modal-overlay { 
                        align-items: center; 
                        padding-bottom: env(safe-area-inset-bottom);
                    }
                }
            `}</style>
        </div>
    )
}
