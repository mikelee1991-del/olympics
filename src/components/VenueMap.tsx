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
import { VENUE_BY_ID, type Venue } from '../data/venues'
import 'leaflet/dist/leaflet.css'

type Props = {
  sessions: PlannedSession[]
  focusVenueId?: string | null
  selectedDate?: string | null
}

function FitVenues({ venues }: { venues: Venue[] }) {
  const map = useMap()
  useEffect(() => {
    if (venues.length === 0) {
      map.setView([34.05, -118.25], 10)
      return
    }
    if (venues.length === 1) {
      map.setView([venues[0].lat, venues[0].lng], 12)
      return
    }
    const lats = venues.map((v) => v.lat)
    const lngs = venues.map((v) => v.lng)
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

export default function VenueMap({
  sessions,
  focusVenueId,
  selectedDate,
}: Props) {
  const visible = useMemo(() => {
    const filtered = selectedDate
      ? sessions.filter(
          (s) => s.date === selectedDate && s.ticketStatus !== 'skip',
        )
      : sessions.filter((s) => s.ticketStatus !== 'skip')
    const byVenue = new Map<string, PlannedSession[]>()
    for (const s of filtered) {
      const list = byVenue.get(s.venueId) ?? []
      list.push(s)
      byVenue.set(s.venueId, list)
    }
    return [...byVenue.entries()]
      .map(([id, list]) => ({ venue: VENUE_BY_ID[id], sessions: list }))
      .filter((x): x is { venue: Venue; sessions: PlannedSession[] } =>
        Boolean(x.venue),
      )
  }, [sessions, selectedDate])

  const venues = visible.map((v) => v.venue)

  return (
    <div className="map-shell" data-testid="venue-map">
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
        <FitVenues venues={venues} />
        {visible.map(({ venue, sessions: atVenue }) => {
          const hasTicket = atVenue.some((s) => s.ticketStatus === 'have')
          const color = hasTicket
            ? '#2d8a4e'
            : focusVenueId === venue.id
              ? '#e23d28'
              : '#3eb6d4'
          return (
            <CircleMarker
              key={venue.id}
              center={[venue.lat, venue.lng]}
              radius={focusVenueId === venue.id ? 12 : 9}
              pathOptions={{
                color,
                fillColor: color,
                fillOpacity: 0.85,
                weight: 2,
              }}
            >
              <Tooltip direction="top" offset={[0, -4]}>
                {venue.name}
              </Tooltip>
              <Popup>
                <strong>{venue.name}</strong>
                <div>{venue.area}</div>
                {venue.note ? <em>{venue.note}</em> : null}
                <ul>
                  {atVenue.slice(0, 8).map((s) => (
                    <li key={s.id}>
                      {s.sport} · {s.startTime}–{s.endTime} · {s.ticketStatus}
                    </li>
                  ))}
                </ul>
              </Popup>
            </CircleMarker>
          )
        })}
      </MapContainer>
    </div>
  )
}
