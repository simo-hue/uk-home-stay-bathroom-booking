import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import {
    Calendar,
    Clock,
    Plus,
    LogOut,
    Trash2,
    ChevronRight,
    User as UserIcon
} from 'lucide-react'

export function Dashboard({ session }) {
    const [activeTab, setActiveTab] = useState('today')
    const [reservations, setReservations] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [profile, setProfile] = useState(null)

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
        const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()
        setProfile(data)
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

        if (!error) setReservations(data)
        setLoading(false)
    }

    const handleSignOut = () => supabase.auth.signOut()

    const deleteReservation = async (id) => {
        if (!confirm('Cancel this booking?')) return
        await supabase.from('reservations').delete().eq('id', id)
    }

    return (
        <div className="dashboard fade-in">
            <header className="dash-header">
                <div className="user-info">
                    <div className="avatar">
                        <UserIcon size={20} />
                    </div>
                    <div className="welcome">
                        <h3>Hi, {profile?.display_name || 'User'}</h3>
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
                                        <button className="delete-btn" onClick={() => deleteReservation(res.id)}>
                                            <Trash2 size={18} />
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
                    userId={session.user.id}
                    existingReservations={reservations}
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
        .delete-btn {
          background: none;
          border: none;
          color: var(--error);
          opacity: 0.6;
          cursor: pointer;
        }
        .delete-btn:hover { opacity: 1; }
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

function BookingModal({ activeTab, onClose, userId, existingReservations }) {
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
            onClose()
        }
        setLoading(false)
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content glass-card fade-in" onClick={e => e.stopPropagation()}>
                <h2>Book for {activeTab === 'today' ? 'Today' : 'Tomorrow'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label className="input-label">Start Time</label>
                        <input
                            type="time"
                            className="input-field"
                            value={time}
                            onChange={e => setTime(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label className="input-label">Duration (minutes)</label>
                        <div className="chip-group">
                            {[10, 20, 30, 45].map(d => (
                                <button
                                    key={d}
                                    type="button"
                                    className={`chip ${duration === d ? 'active' : ''}`}
                                    onClick={() => setDuration(d)}
                                >
                                    {d}m
                                </button>
                            ))}
                        </div>
                    </div>

                    {error && <p className="error-text">{error}</p>}

                    <div className="modal-actions">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary" disabled={loading || !time}>
                            {loading ? 'Booking...' : 'Confirm'}
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
          display: flex;
          align-items: flex-end;
          padding: 20px;
          z-index: 100;
        }
        .modal-content {
          width: 100%;
          max-width: 460px;
          margin: 0 auto;
          padding: 24px;
        }
        .modal-content h2 { margin-bottom: 24px; }
        .chip-group { display: flex; gap: 8px; }
        .chip {
          padding: 8px 16px;
          border-radius: 20px;
          border: 1px solid var(--glass-border);
          background: var(--bg-secondary);
          color: var(--text-secondary);
          cursor: pointer;
        }
        .chip.active {
          background: var(--accent-primary);
          color: white;
          border-color: var(--accent-primary);
        }
        .error-text { color: var(--error); font-size: 0.875rem; margin-bottom: 16px; }
        .modal-actions { display: flex; gap: 12px; margin-top: 24px; }
        .modal-actions .btn { flex: 1; }
      `}</style>
        </div>
    )
}
