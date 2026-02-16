import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const mockSupabase = {
    auth: {
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
        signInWithPassword: () => Promise.resolve({ data: { user: { id: 'demo-id' } }, error: null }),
        signUp: () => Promise.resolve({ data: {}, error: null }),
        signOut: () => Promise.resolve({ error: null }),
    },
    from: () => ({
        select: () => ({
            eq: () => ({
                single: () => Promise.resolve({ data: { username: 'demo', display_name: 'Demo User' }, error: null }),
            }),
            gte: () => ({
                lte: () => ({
                    order: () => Promise.resolve({ data: [], error: null }),
                }),
            }),
        }),
        insert: () => Promise.resolve({ error: null }),
        delete: () => ({ eq: () => Promise.resolve({ error: null }) }),
    }),
    channel: () => ({ on: () => ({ subscribe: () => ({}) }) }),
    removeChannel: () => { },
}

if (!supabaseUrl || !supabaseAnonKey) {
    console.info('🚀 UI-First Mode: Using Mock Supabase. Set credentials in .env to connect to your real backend.')
}

export const supabase = (supabaseUrl && supabaseAnonKey)
    ? createClient(supabaseUrl, supabaseAnonKey)
    : mockSupabase

