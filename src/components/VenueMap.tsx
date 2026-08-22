import { useEffect, useMemo } from 'react'
import {
  CircleMarker,
  MapContainer,
  Popup,
  TileLayer,
  Tooltip,
  useMap,
} from 'react-leaflet'
import type { PlannedSession } from '../data/planner'
import { VENUES, VENUE_BY_ID, type Venue } from '../data/venues'
import 'leaflet/dist/leaflet.css'

type Props = {
  sessions: PlannedSession[]
  focusVenueId?: string | null
  selectedDate?: string | null
}

type VenueRole = 'have' | 'active' | 'other'

const ROLE_COLOR: Record<VenueRole, string> = {
  have: '#2d8a4e',
  active: '#3eb6d4',
  other: '#5a6a78',
}

/** Keep default zoom on SoCal — OKC / placeholder pins stay on the map. */
const FIT_SKIP = new Set(['okc-softball', 'okc-whitewater', 'multiple'])

function FitVenues({ venues }: { venues: Venue[] }) {
  const map = useMap()
  useEffect(() => {
    const fit = venues.filter((v) => !FIT_SKIP.has(v.id))
    if (fit.length === 0) {
      map.setView([34.05, -118.25], 10)
      return
    }
    if (fit.length === 1) {
      map.setView([fit[0].lat, fit[0].lng], 12)
      return
    }
    const lats = fit.map((v) => v.lat)
    const lngs = fit.map((v) => v.lng)
    map.fitBounds(
      [
        [Math.min(...lats), Math.min(...lngs)],
        [Math.max(...lats), Math.max(...lngs)],
      ],
      { padding: [40, 40] },
    )
  }, [map, venues])
  return null
}

function sessionsForVenue(
  byVenue: Map<string, PlannedSession[]>,
  venueId: string,
): PlannedSession[] {
  return byVenue.get(venueId) ?? []
}

function roleFor(pool: PlannedSession[]): VenueRole {
  if (pool.length === 0) return 'other'
  if (
    pool.some(
      (s) =>
        s.ticketStatus === 'have' &&
        (s.ticketQty != null || s.access === 'ticketed'),
    )
  ) {
    return 'have'
  }
  return 'active'
}

export default function VenueMap({
  sessions,
  focusVenueId,
  selectedDate,
}: Props) {
  const plannedByVenue = useMemo(() => {
    const byVenue = new Map<string, PlannedSession[]>()
    for (const s of sessions) {
      if (s.ticketStatus === 'skip') continue
      if (!VENUE_BY_ID[s.venueId]) continue
      const list = byVenue.get(s.venueId) ?? []
      list.push(s)
      byVenue.set(s.venueId, list)
    }
    return byVenue
  }, [sessions])

  const dayByVenue = useMemo(() => {
    if (!selectedDate) return null
    const byVenue = new Map<string, PlannedSession[]>()
    for (const s of sessions) {
      if (s.ticketStatus === 'skip' || s.date !== selectedDate) continue
      if (!VENUE_BY_ID[s.venueId]) continue
      const list = byVenue.get(s.venueId) ?? []
      list.push(s)
      byVenue.set(s.venueId, list)
    }
    return byVenue
  }, [sessions, selectedDate])

  const pins = useMemo(() => {
    return VENUES.map((venue) => {
      const planned = sessionsForVenue(plannedByVenue, venue.id)
      const today = dayByVenue
        ? sessionsForVenue(dayByVenue, venue.id)
        : null
      const pool = today ?? planned
      const role = roleFor(pool)
      return { venue, role, popupSessions: pool }
    }).sort((a, b) => {
      // Draw muted pins under active ones.
      const rank = (r: VenueRole) => (r === 'other' ? 0 : r === 'active' ? 1 : 2)
      return rank(a.role) - rank(b.role)
    })
  }, [plannedByVenue, dayByVenue])

  const legendDay = Boolean(selectedDate)

  return (
    <div className="map-shell" data-testid="venue-map">
      <ul className="map-legend" data-testid="map-legend" aria-label="Map legend">
        <li>
          <span className="map-legend-swatch have" aria-hidden />
          Have tickets{legendDay ? ' today' : ''}
        </li>
        <li>
          <span className="map-legend-swatch active" aria-hidden />
          {legendDay ? 'Sessions today' : 'On your plan'}
        </li>
        <li>
          <span className="map-legend-swatch other" aria-hidden />
          {legendDay ? 'Other venues' : 'No sessions yet'}
        </li>
      </ul>
      <MapContainer
        center={[34.05, -118.25]}
        zoom={10}
        scrollWheelZoom
        className="map-canvas"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitVenues venues={VENUES} />
        {pins.map(({ venue, role, popupSessions }) => {
          const focused = focusVenueId === venue.id
          const color = focused && role !== 'other' ? '#e23d28' : ROLE_COLOR[role]
          return (
            <CircleMarker
              key={venue.id}
              center={[venue.lat, venue.lng]}
              radius={focused ? 12 : role === 'other' ? 6 : 9}
              pathOptions={{
                color,
                fillColor: color,
                fillOpacity: role === 'other' ? 0.45 : 0.9,
                weight: focused ? 3 : 2,
                opacity: role === 'other' ? 0.7 : 1,
              }}
            >
              <Tooltip direction="top" offset={[0, -4]}>
                {venue.name}
              </Tooltip>
              <Popup>
                <strong>{venue.name}</strong>
                <div>{venue.area}</div>
                {venue.note ? <em>{venue.note}</em> : null}
                {popupSessions.length === 0 ? (
                  <p className="map-popup-empty">
                    {selectedDate
                      ? 'No sessions on this day.'
                      : 'No sessions on your plan yet.'}
                  </p>
                ) : (
                  <ul>
                    {popupSessions.slice(0, 8).map((s) => (
                      <li key={s.id}>
                        {s.sport} · {s.startTime}–{s.endTime} · {s.ticketStatus}
                      </li>
                    ))}
                  </ul>
                )}
              </Popup>
            </CircleMarker>
          )
        })}
      </MapContainer>
    </div>
  )
}
