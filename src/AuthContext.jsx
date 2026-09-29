import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import { getMyProfile } from './lib/twi'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(undefined) // undefined = not yet checked
  const [profile, setProfile] = useState(null)
  const [profileLoading, setProfileLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (session === undefined) return
    if (!session) {
      setProfile(null)
      setProfileLoading(false)
      return
    }
    setProfileLoading(true)
    getMyProfile()
      .then(setProfile)
      .catch((err) => console.error('Failed to load profile', err))
      .finally(() => setProfileLoading(false))
  }, [session])

  const value = {
    session,
    profile,
    loading: session === undefined || (!!session && profileLoading),
    isOwner: profile?.role === 'owner',
    isCoachOrOwner: profile?.role === 'coach' || profile?.role === 'owner',
    // Refetches the caller's own profile row — used after editing your name
    // in Account so the header updates without a full sign-out/in.
    refreshProfile: () => getMyProfile().then(setProfile).catch((err) => console.error('Failed to refresh profile', err)),
    signOut: () => supabase.auth.signOut()
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
