import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import { CARDS, KATA_APP_URL } from '../lib/cards'
import { getViewCounts } from '../lib/twi'

export default function Home() {
  const { profile } = useAuth()
  const navigate = useNavigate()
  const [weekByCard, setWeekByCard] = useState(null)

  useEffect(() => {
    if (!profile) return
    getViewCounts()
      .then((rows) => {
        const mine = rows.filter((r) => r.user_id === profile.id)
        setWeekByCard(Object.fromEntries(CARDS.map((c) => [c.id, mine.find((r) => r.card === c.id)?.last_7_days ?? 0])))
      })
      .catch(() => setWeekByCard(null))
  }, [profile])

  const firstName = profile?.full_name?.split(' ')[0] || 'there'

  return (
    <div>
      <div className="card">
        <p className="card__label">Welcome back</p>
        <p className="card__value" style={{ fontSize: 20, fontWeight: 700 }}>
          {firstName}
        </p>
      </div>

      <h2 className="section-title">Your cards</h2>
      {CARDS.map((c) => (
        <button key={c.id} type="button" className="card card-link" onClick={() => navigate(`/${c.id}`)}>
          <span className="card-link__code" data-color={c.color} aria-hidden="true">
            {c.short}
          </span>
          <span className="card-link__text">
            <span className="card-link__title">{c.title}</span>
            <span className="card-link__sub">{c.subtitle}</span>
          </span>
          {weekByCard && (
            <span className="card-link__count">
              {weekByCard[c.id]} <span>{weekByCard[c.id] === 1 ? 'open' : 'opens'} this week</span>
            </span>
          )}
        </button>
      ))}

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 8 }}>
        <button className="btn btn--ghost" onClick={() => navigate('/tracker')}>
          Open tracker
        </button>
        <a className="btn btn--ghost" href={KATA_APP_URL} style={{ textDecoration: 'none' }}>
          Go to Kata Tracker
        </a>
      </div>
    </div>
  )
}
