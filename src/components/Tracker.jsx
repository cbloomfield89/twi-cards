import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../AuthContext'
import { CARDS } from '../lib/cards'
import { getPeople, getViewCounts } from '../lib/twi'

const PERIODS = [
  { key: 'last_7_days', label: 'Week', long: 'last 7 days' },
  { key: 'last_30_days', label: 'Month', long: 'last 30 days' },
  { key: 'last_365_days', label: 'Year', long: 'last 365 days' }
]

const ME = 'me'
const EVERYONE = 'everyone'

// Sums count rows into { ji: {last_7_days, ...}, jm: ..., jr: ... }.
function totalsByCard(rows) {
  const out = Object.fromEntries(
    CARDS.map((c) => [c.id, { last_7_days: 0, last_30_days: 0, last_365_days: 0 }])
  )
  for (const r of rows) {
    if (!out[r.card]) continue
    for (const p of PERIODS) out[r.card][p.key] += r[p.key]
  }
  return out
}

function CountsTable({ totals, period }) {
  return (
    <div className="table-scroll">
      <table className="count-table">
        <thead>
          <tr>
            <th scope="col">Card</th>
            {PERIODS.map((p) => (
              <th key={p.key} scope="col" className={p.key === period ? 'is-selected' : undefined}>
                {p.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {CARDS.map((c) => (
            <tr key={c.id}>
              <th scope="row">{c.title}</th>
              {PERIODS.map((p) => (
                <td key={p.key} className={p.key === period ? 'is-selected' : undefined}>
                  {totals[c.id][p.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function BarChart({ totals, period }) {
  const max = Math.max(1, ...CARDS.map((c) => totals[c.id][period]))
  const periodLong = PERIODS.find((p) => p.key === period).long
  return (
    <div className="bar-chart" role="img" aria-label={`Card opens, ${periodLong}`}>
      {CARDS.map((c) => {
        const value = totals[c.id][period]
        return (
          <div key={c.id} className="bar-chart__row">
            <span className="bar-chart__label">{c.short}</span>
            <span className="bar-chart__track">
              <span className="bar-chart__bar" style={{ width: `${(value / max) * 100}%` }} />
            </span>
            <span className="bar-chart__value">{value}</span>
          </div>
        )
      })}
    </div>
  )
}

function PeriodToggle({ period, setPeriod }) {
  return (
    <div className="segmented" role="group" aria-label="Time period for the chart">
      {PERIODS.map((p) => (
        <button
          key={p.key}
          type="button"
          className="segmented__item"
          aria-pressed={p.key === period}
          onClick={() => setPeriod(p.key)}
        >
          {p.label}
        </button>
      ))}
    </div>
  )
}

export default function Tracker() {
  const { profile, isCoachOrOwner } = useAuth()
  const [counts, setCounts] = useState(null)
  const [people, setPeople] = useState([])
  const [period, setPeriod] = useState('last_7_days')
  const [subject, setSubject] = useState(ME)
  const [teamFilter, setTeamFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [err, setErr] = useState('')

  useEffect(() => {
    if (!profile) return
    Promise.all([getViewCounts(), isCoachOrOwner ? getPeople() : Promise.resolve([])])
      .then(([c, p]) => {
        setCounts(c)
        setPeople(p)
      })
      .catch((e) => setErr(e.message))
  }, [profile, isCoachOrOwner])

  // Archived teams count as Unassigned, same as in Kata.
  const teamOf = (p) => (p.team_id && p.teams && !p.teams.archived ? p.teams.name : 'Unassigned')

  const activePeople = useMemo(() => people.filter((p) => p.active !== false), [people])

  const teamNames = useMemo(
    () => [...new Set(activePeople.map(teamOf))].sort((a, b) => a.localeCompare(b)),
    [activePeople]
  )

  const shownTotals = useMemo(() => {
    if (!counts) return null
    if (subject === EVERYONE) return totalsByCard(counts)
    const id = subject === ME ? profile.id : subject
    return totalsByCard(counts.filter((r) => r.user_id === id))
  }, [counts, subject, profile])

  const byPerson = useMemo(() => {
    if (!counts) return []
    const q = search.trim().toLowerCase()
    return activePeople
      .filter((p) => teamFilter === 'all' || teamOf(p) === teamFilter)
      .filter((p) => !q || p.full_name.toLowerCase().includes(q))
      .map((p) => {
        const t = totalsByCard(counts.filter((r) => r.user_id === p.id))
        const perCard = Object.fromEntries(CARDS.map((c) => [c.id, t[c.id][period]]))
        const total = CARDS.reduce((s, c) => s + perCard[c.id], 0)
        return { person: p, perCard, total }
      })
      .sort((a, b) => b.total - a.total || a.person.full_name.localeCompare(b.person.full_name))
  }, [counts, activePeople, teamFilter, search, period])

  if (err) return <div className="error-banner">{err}</div>
  if (!counts) return <div className="spinner-row">Loading…</div>

  const subjectName =
    subject === ME
      ? 'Your opens'
      : subject === EVERYONE
        ? 'Everyone combined'
        : `${people.find((p) => p.id === subject)?.full_name ?? 'Person'}’s opens`

  return (
    <div>
      <div className="card">
        <div className="tracker-head">
          <h1 className="tracker-head__title">{subjectName}</h1>
          <PeriodToggle period={period} setPeriod={setPeriod} />
        </div>

        {isCoachOrOwner && (
          <div className="field" style={{ marginTop: 12 }}>
            <label htmlFor="subject">Showing</label>
            <select id="subject" value={subject} onChange={(e) => setSubject(e.target.value)}>
              <option value={ME}>Just me</option>
              <option value={EVERYONE}>Everyone combined</option>
              {activePeople
                .filter((p) => p.id !== profile.id)
                .map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.full_name}
                  </option>
                ))}
            </select>
          </div>
        )}

        <BarChart totals={shownTotals} period={period} />
        <CountsTable totals={shownTotals} period={period} />
        <p className="tracker-note">
          An open counts after a card has been on screen for 5 seconds. Week, month and year are the last 7, 30
          and 365 days.
        </p>
      </div>

      {isCoachOrOwner && (
        <>
          <h2 className="section-title">By person, {PERIODS.find((p) => p.key === period).long}</h2>
          <div className="card">
            <div className="filter-row">
              <div className="field">
                <label htmlFor="teamFilter">Team</label>
                <select id="teamFilter" value={teamFilter} onChange={(e) => setTeamFilter(e.target.value)}>
                  <option value="all">All teams</option>
                  {teamNames.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              {activePeople.length > 6 && (
                <div className="field">
                  <label htmlFor="personSearch">Search</label>
                  <input
                    id="personSearch"
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Name"
                  />
                </div>
              )}
            </div>

            {byPerson.length === 0 ? (
              <p className="empty-state" style={{ padding: '20px 0' }}>
                No one matches that filter.
              </p>
            ) : (
              <div className="table-scroll">
                <table className="count-table count-table--people">
                  <thead>
                    <tr>
                      <th scope="col">Person</th>
                      {CARDS.map((c) => (
                        <th key={c.id} scope="col">
                          <abbr title={c.title}>{c.short}</abbr>
                        </th>
                      ))}
                      <th scope="col">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {byPerson.map(({ person, perCard, total }) => (
                      <tr key={person.id}>
                        <th scope="row">
                          <button
                            type="button"
                            className="link-button"
                            onClick={() => {
                              setSubject(person.id === profile.id ? ME : person.id)
                              window.scrollTo({ top: 0, behavior: 'smooth' })
                            }}
                          >
                            {person.full_name}
                          </button>
                          <span className="count-table__meta">{teamOf(person)}</span>
                        </th>
                        {CARDS.map((c) => (
                          <td key={c.id} className={perCard[c.id] === 0 ? 'is-zero' : undefined}>
                            {perCard[c.id]}
                          </td>
                        ))}
                        <td className="count-table__total">{total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
