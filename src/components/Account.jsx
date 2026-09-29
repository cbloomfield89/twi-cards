import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { useAuth } from '../AuthContext'

export default function Account() {
  const { profile, refreshProfile } = useAuth()
  const navigate = useNavigate()

  const [fullName, setFullName] = useState(profile?.full_name || '')
  const [savingName, setSavingName] = useState(false)
  const [nameMsg, setNameMsg] = useState('')
  const [nameErr, setNameErr] = useState('')

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)
  const [passwordMsg, setPasswordMsg] = useState('')
  const [passwordErr, setPasswordErr] = useState('')

  async function handleSaveName(e) {
    e.preventDefault()
    setNameErr('')
    setNameMsg('')
    setSavingName(true)
    try {
      const { error } = await supabase.from('profiles').update({ full_name: fullName.trim() }).eq('id', profile.id)
      if (error) throw error
      await refreshProfile()
      setNameMsg('Saved.')
    } catch (err) {
      setNameErr(err.message)
    } finally {
      setSavingName(false)
    }
  }

  async function handleChangePassword(e) {
    e.preventDefault()
    setPasswordErr('')
    setPasswordMsg('')
    if (newPassword.length < 6) {
      setPasswordErr('Password must be at least 6 characters.')
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordErr('Those two passwords don’t match.')
      return
    }
    setSavingPassword(true)
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) throw error
      setPasswordMsg('Password updated.')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      setPasswordErr(err.message)
    } finally {
      setSavingPassword(false)
    }
  }

  return (
    <div>
      <button className="btn btn--ghost" onClick={() => navigate('/')} style={{ width: 'auto', marginBottom: 14 }}>
        ← Back to home
      </button>

      <p className="tracker-note" style={{ marginTop: 0 }}>
        Your name and password are shared with Kata Tracker, so changes here apply there too.
      </p>

      <p className="section-title">Your details</p>
      <form className="card" onSubmit={handleSaveName}>
        {nameErr && <div className="error-banner">{nameErr}</div>}
        {nameMsg && (
          <p className="card__label" style={{ color: 'var(--status-good)' }}>
            {nameMsg}
          </p>
        )}
        <div className="field">
          <label htmlFor="fullName">Full name</label>
          <input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
        </div>
        <div className="field" style={{ marginBottom: 0 }}>
          <label htmlFor="workEmail">Work email</label>
          <input id="workEmail" value={profile?.email || ''} disabled />
        </div>
        <button
          className="btn btn--primary"
          type="submit"
          disabled={savingName}
          style={{ width: 'auto', marginTop: 14 }}
        >
          {savingName ? 'Saving…' : 'Save name'}
        </button>
      </form>

      <p className="section-title">Change password</p>
      <form className="card" onSubmit={handleChangePassword}>
        {passwordErr && <div className="error-banner">{passwordErr}</div>}
        {passwordMsg && (
          <p className="card__label" style={{ color: 'var(--status-good)' }}>
            {passwordMsg}
          </p>
        )}
        <div className="field">
          <label htmlFor="newPassword">New password</label>
          <div className="field__input-wrap">
            <input
              id="newPassword"
              name="new-password"
              type={showNewPassword ? 'text' : 'password'}
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              minLength={6}
              required
            />
            <button
              type="button"
              className="field__toggle-visibility"
              tabIndex={-1}
              onClick={() => setShowNewPassword((v) => !v)}
              aria-label={showNewPassword ? 'Hide password' : 'Show password'}
            >
              {showNewPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>
        <div className="field" style={{ marginBottom: 0 }}>
          <label htmlFor="confirmPassword">Confirm new password</label>
          <input
            id="confirmPassword"
            name="new-password"
            type={showNewPassword ? 'text' : 'password'}
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            minLength={6}
            required
          />
        </div>
        <button
          className="btn btn--primary"
          type="submit"
          disabled={savingPassword}
          style={{ width: 'auto', marginTop: 14 }}
        >
          {savingPassword ? 'Saving…' : 'Update password'}
        </button>
      </form>
    </div>
  )
}
