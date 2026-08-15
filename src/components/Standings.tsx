import { useMemo, useState } from 'react'
import {
  rankStandings,
  SPORTS,
  STANDINGS,
  type Sport,
} from '../data/medals'

const WATCHLIST_KEY = 'olympics-watchlist'

function loadWatchlist(): string[] {
  try {
    const raw = localStorage.getItem(WATCHLIST_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    return Array.isArray(parsed)
      ? parsed.filter((id): id is string => typeof id === 'string')
      : []
  } catch {
    return []
  }
}

function saveWatchlist(ids: string[]) {
  localStorage.setItem(WATCHLIST_KEY, JSON.stringify(ids))
}

export default function Standings() {
  const [watchlist, setWatchlist] = useState<string[]>(loadWatchlist)
  const [sportFilter, setSportFilter] = useState<Sport | 'All'>('All')
  const [toast, setToast] = useState<string | null>(null)

  const ranked = useMemo(() => {
    const filtered =
      sportFilter === 'All'
        ? STANDINGS
        : STANDINGS.filter((row) => row.highlightSport === sportFilter)
    return rankStandings(filtered)
  }, [sportFilter])

  const watchedCountries = useMemo(
    () => STANDINGS.filter((row) => watchlist.includes(row.id)),
    [watchlist],
  )

  function toggleWatch(id: string, country: string) {
    setWatchlist((prev) => {
      const next = prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
      saveWatchlist(next)
      setToast(
        prev.includes(id)
          ? `Removed ${country} from your watchlist`
          : `Added ${country} to your watchlist`,
      )
      window.setTimeout(() => setToast(null), 2400)
      return next
    })
  }

  return (
    <>
      <section className="hero" id="top" aria-labelledby="hero-brand">
        <div className="hero-copy">
          <p className="hero-brand" id="hero-brand">
            Olympics
          </p>
          <h1>Follow every podium finish.</h1>
          <p className="hero-lede">
            Demo medal table — use Schedule planner for family tickets.
          </p>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <img
            className="hero-image"
            src="https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&w=1600&q=80"
            alt=""
          />
          <div className="hero-scrim" />
        </div>
      </section>

      <section className="standings" id="standings" aria-labelledby="standings-title">
        <div className="section-head">
          <h2 id="standings-title">Medal standings</h2>
          <p>Sorted by gold, then silver, then bronze.</p>
        </div>

        <div className="filters" role="group" aria-label="Filter by sport">
          <button
            type="button"
            className={sportFilter === 'All' ? 'chip active' : 'chip'}
            onClick={() => setSportFilter('All')}
          >
            All sports
          </button>
          {SPORTS.map((sport) => (
            <button
              key={sport}
              type="button"
              className={sportFilter === sport ? 'chip active' : 'chip'}
              onClick={() => setSportFilter(sport)}
            >
              {sport}
            </button>
          ))}
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th scope="col">Rank</th>
                <th scope="col">NOC</th>
                <th scope="col">Gold</th>
                <th scope="col">Silver</th>
                <th scope="col">Bronze</th>
                <th scope="col">Total</th>
                <th scope="col">Watch</th>
              </tr>
            </thead>
            <tbody>
              {ranked.map((row) => {
                const watched = watchlist.includes(row.id)
                return (
                  <tr key={row.id} data-watched={watched ? 'true' : 'false'}>
                    <td>{row.rank}</td>
                    <td>
                      <span className="noc">{row.noc}</span>
                      <span className="country">{row.country}</span>
                    </td>
                    <td className="medal gold">{row.gold}</td>
                    <td className="medal silver">{row.silver}</td>
                    <td className="medal bronze">{row.bronze}</td>
                    <td>{row.total}</td>
                    <td>
                      <button
                        type="button"
                        className={watched ? 'watch on' : 'watch'}
                        aria-pressed={watched}
                        aria-label={
                          watched
                            ? `Remove ${row.country} from watchlist`
                            : `Add ${row.country} to watchlist`
                        }
                        onClick={() => toggleWatch(row.id, row.country)}
                      >
                        {watched ? 'Watching' : 'Watch'}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="watchlist" id="watchlist" aria-labelledby="watchlist-title">
        <div className="section-head">
          <h2 id="watchlist-title">Your watchlist</h2>
          <p>
            {watchedCountries.length === 0
              ? 'Pin nations from the standings to build your shortlist.'
              : `${watchedCountries.length} nation${watchedCountries.length === 1 ? '' : 's'} pinned.`}
          </p>
        </div>

        {watchedCountries.length === 0 ? (
          <p className="empty" data-testid="watchlist-empty">
            No countries watched yet.
          </p>
        ) : (
          <ul className="watch-grid" data-testid="watchlist-items">
            {watchedCountries.map((row) => (
              <li key={row.id}>
                <article className="watch-item">
                  <header>
                    <span className="noc">{row.noc}</span>
                    <h3>{row.country}</h3>
                  </header>
                  <p>
                    {row.gold}G · {row.silver}S · {row.bronze}B · best in{' '}
                    {row.highlightSport}
                  </p>
                  <button
                    type="button"
                    className="watch on"
                    onClick={() => toggleWatch(row.id, row.country)}
                  >
                    Remove
                  </button>
                </article>
              </li>
            ))}
          </ul>
        )}
      </section>

      {toast ? (
        <div className="toast" role="status" aria-live="polite">
          {toast}
        </div>
      ) : null}
    </>
  )
}
