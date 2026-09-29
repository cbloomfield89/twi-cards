import { Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'
import Login from './components/Login'
import Home from './components/Home'
import CardView from './components/CardView'
import Tracker from './components/Tracker'
import Account from './components/Account'
import { CARDS } from './lib/cards'

function TabBar() {
  const location = useLocation()
  const navigate = useNavigate()
  // Everyone sees the same tabs; the Tracker shows more for coaches and owners.
  const tabs = [
    { to: '/', label: 'Home', exact: true },
    ...CARDS.map((c) => ({ to: `/${c.id}`, label: c.tab })),
    { to: '/tracker', label: 'Tracker' }
  ]

  return (
    <nav className="tabbar">
      {tabs.map((t) => (
        <button
          key={t.to}
          className="tabbar__item"
          aria-current={(t.exact ? location.pathname === t.to : location.pathname.startsWith(t.to)) ? 'page' : undefined}
          onClick={() => navigate(t.to)}
        >
          {t.label}
        </button>
      ))}
    </nav>
  )
}

function Header() {
  const { profile, signOut } = useAuth()
  return (
    <header className="app-header">
      <div className="app-header__top">
        <Link to="/" className="app-header__brand" style={{ textDecoration: 'none', color: 'inherit' }}>
          <img className="app-header__logo" alt="9Wood" src="/9wood-logo.webp" />
          <span className="app-header__product">
            TWI
            <br />
            <b>Cards</b>
          </span>
        </Link>
        <div className="app-header__actions">
          <Link to="/account" style={{ color: 'inherit', textDecoration: 'none' }}>
            {profile?.full_name}
          </Link>
          <button className="btn btn--ghost" style={{ padding: '6px 12px', fontSize: 13 }} onClick={signOut}>
            Sign out
          </button>
        </div>
      </div>
      <TabBar />
    </header>
  )
}

function DeactivatedScreen() {
  const { signOut } = useAuth()
  return (
    <div className="auth-screen">
      <div className="auth-card" style={{ textAlign: 'center' }}>
        <img className="auth-card__logo" alt="9Wood" src="/9wood-logo.webp" style={{ margin: '0 auto 18px' }} />
        <p className="card__value" style={{ marginBottom: 18 }}>
          Your account has been deactivated. Contact your Kata Owner if you think this is a mistake.
        </p>
        <button className="btn btn--ghost btn--block" onClick={signOut}>
          Sign out
        </button>
      </div>
    </div>
  )
}

export default function App() {
  const { session, loading, profile } = useAuth()

  if (loading) {
    return <div className="spinner-row">Loading…</div>
  }

  if (!session) {
    return <Login />
  }

  if (profile && profile.active === false) {
    return <DeactivatedScreen />
  }

  return (
    <div className="app-shell">
      <Header />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/account" element={<Account />} />
          {CARDS.map((c) => (
            // key per card so switching tabs remounts the card and restarts its timer
            <Route key={c.id} path={`/${c.id}`} element={<CardView key={c.id} cardId={c.id} />} />
          ))}
          <Route path="/tracker" element={<Tracker />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
    </div>
  )
}
