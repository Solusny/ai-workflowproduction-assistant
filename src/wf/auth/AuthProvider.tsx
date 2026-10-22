import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '@/integrations/supabase/client'

interface Profile {
  display_name: string | null
  avatar_url: string | null
}

interface AuthState {
  loading: boolean
  session: Session | null
  user: User | null
  profile: Profile | null
  displayName: string
  avatarUrl: string | null
  initials: string
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<Profile | null>(null)

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s)
      setLoading(false)
    })
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  const userId = session?.user.id
  useEffect(() => {
    if (!userId) {
      setProfile(null)
      return
    }
    supabase
      .from('profiles')
      .select('display_name, avatar_url')
      .eq('id', userId)
      .maybeSingle()
      .then(({ data }) => setProfile(data))
  }, [userId])

  const value = useMemo<AuthState>(() => {
    const user = session?.user ?? null
    const meta = (user?.user_metadata ?? {}) as Record<string, string | undefined>
    const displayName =
      profile?.display_name || meta["full_name"] || meta["name"] || user?.email?.split('@')[0] || ''
    const avatarUrl = profile?.avatar_url || meta["avatar_url"] || meta["picture"] || null
    const initials =
      displayName
        .split(/[\s._-]+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((p) => p[0]!.toUpperCase())
        .join('') || 'U'
    return {
      loading,
      session,
      user,
      profile,
      displayName,
      avatarUrl,
      initials,
      signOut: async () => {
        await supabase.auth.signOut()
      },
    }
  }, [session, loading, profile])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}

/** Only allow same-origin relative paths as post-login destinations. */
export function safeRedirect(value: unknown): string {
  if (typeof value !== 'string') return '/app'
  if (!value.startsWith('/') || value.startsWith('//') || value.startsWith('/\\')) return '/app'
  if (value.startsWith('/login')) return '/app'
  return value
}
