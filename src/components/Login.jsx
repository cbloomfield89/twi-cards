import { useState } from 'react'
import { supabase } from '../supabaseClient'
import { KATA_APP_URL } from '../lib/cards'

// Sign-in only. TWI shares logins with the Kata Tracker, so accounts are
// created there (that's where team and role are picked at signup).
export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  async function handleSignIn(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setBusy(false)
    if (error) setError(error.message)
  }

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <img className="auth-card__logo" alt="9Wood" src="/9wood-logo.webp" />
        <h1>
          <b>TWI</b> Cards
        </h1>
        <p className="sub">Sign in with your Kata Tracker email and password.</p>

        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={handleSignIn}>
          <div className="field">
            <label htmlFor="email">Work email</label>
            <input
              id="email"
              name="username"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              inputMode="email"
              autoCapitalize="none"
              autoCorrect="off"
              required
            />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <div className="field__input-wrap">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                minLength={6}
                required
              />
              <button
                type="button"
                className="field__toggle-visibility"
                tabIndex={-1}
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <button className="btn btn--primary btn--block" type="submit" disabled={busy}>
            {busy ? 'Please wait…' : 'Sign in'}
          </button>
        </form>

        <div style={{ marginTop: 18, textAlign: 'center', fontSize: 14 }}>
          No account yet?{' '}
          <a className="toggle-link" href={KATA_APP_URL}>
            Create one in Kata Tracker
          </a>
        </div>
      </div>
    </div>
  )
}
