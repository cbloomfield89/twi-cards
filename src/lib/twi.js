import { supabase } from '../supabaseClient'

// ---------------------------------------------------------------------------
// Profile (same profiles table the Kata app uses)
// ---------------------------------------------------------------------------
export async function getMyProfile() {
  const {
    data: { user }
  } = await supabase.auth.getUser()
  if (!user) return null
  const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (error) throw error
  return data
}

// Coaches and owners can read every profile (Kata's existing rules), which is
// what lets the tracker list people who have never opened a card.
export async function getPeople() {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, role, active, team_id, teams(name, archived)')
    .order('full_name')
  if (error) throw error
  return data
}

// ---------------------------------------------------------------------------
// Card opens
// ---------------------------------------------------------------------------

// The database stamps the user and time itself, so only the card is sent.
export async function recordCardView(card) {
  const {
    data: { user }
  } = await supabase.auth.getUser()
  if (!user) return
  const { error } = await supabase.from('twi_card_views').insert({ card, user_id: user.id })
  if (error) throw error
}

// Rows of { user_id, card, last_7_days, last_30_days, last_365_days }.
// Learners only ever get their own rows back; coaches and owners get everyone.
export async function getViewCounts() {
  const { data, error } = await supabase.rpc('twi_view_counts')
  if (error) throw error
  return (data || []).map((r) => ({
    ...r,
    last_7_days: Number(r.last_7_days),
    last_30_days: Number(r.last_30_days),
    last_365_days: Number(r.last_365_days)
  }))
}
