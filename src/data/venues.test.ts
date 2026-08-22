import { describe, expect, it } from 'vitest'
import { hydratePlan, type PlannedSession } from './planner'
import { resolveVenueId, VENUE_BY_ID, VENUES } from './venues'

function haversineKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const toRad = (d: number) => (d * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
  return 2 * 6371 * Math.asin(Math.sqrt(a))
}

describe('venue GPS sanity', () => {
  it('places 2028 Stadium at SoFi / Inglewood, not Exposition Park', () => {
    const sofi = VENUE_BY_ID['stadium-2028']
    const coliseum = VENUE_BY_ID.coliseum
    const intuit = VENUE_BY_ID.intuit
    expect(sofi.area).toMatch(/Inglewood/i)
    // Within ~1.5 km of Intuit Dome (same Hollywood Park zone)
    expect(haversineKm(sofi.lat, sofi.lng, intuit.lat, intuit.lng)).toBeLessThan(
      1.5,
    )
    // Far from Coliseum (the old wrong pin)
    expect(
      haversineKm(sofi.lat, sofi.lng, coliseum.lat, coliseum.lng),
    ).toBeGreaterThan(5)
  })

  it('keeps Rose Bowl Aquatics south of Rose Bowl Stadium', () => {
    const pool = VENUE_BY_ID['rose-bowl']
    const stadium = VENUE_BY_ID['rose-bowl-stadium']
    expect(pool.lat).toBeLessThan(stadium.lat)
    expect(
      haversineKm(pool.lat, pool.lng, stadium.lat, stadium.lng),
    ).toBeGreaterThan(0.8)
  })

  it('puts Long Beach aquatics near Belmont Shore, not the Arena', () => {
    const aquatics = VENUE_BY_ID['lb-aquatics']
    const arena = VENUE_BY_ID['lb-arena']
    const belmont = VENUE_BY_ID.belmont
    expect(haversineKm(aquatics.lat, aquatics.lng, belmont.lat, belmont.lng)).toBeLessThan(
      1,
    )
    expect(haversineKm(aquatics.lat, aquatics.lng, arena.lat, arena.lng)).toBeGreaterThan(
      3,
    )
  })

  it('puts Valley Complex at Sepulveda Basin (west of 405 / Balboa)', () => {
    const valley = VENUE_BY_ID.valley
    expect(valley.lng).toBeLessThan(-118.49)
  })

  it('puts OKC softball at Devon Park, not downtown OKC', () => {
    const soft = VENUE_BY_ID['okc-softball']
    // Devon Park ~35.525, -97.464
    expect(soft.lat).toBeGreaterThan(35.51)
    expect(soft.lng).toBeGreaterThan(-97.48)
    expect(soft.note).toMatch(/USA Softball/)
  })

  it('keeps Kia Forum distinct from Intuit Dome in Inglewood', () => {
    const forum = VENUE_BY_ID.forum
    const intuit = VENUE_BY_ID.intuit
    expect(forum).toBeTruthy()
    expect(forum.area).toMatch(/Inglewood/i)
    const km = haversineKm(forum.lat, forum.lng, intuit.lat, intuit.lng)
    expect(km).toBeGreaterThan(0.8)
    expect(km).toBeLessThan(2.5)
    expect(forum.id).not.toBe(intuit.id)
  })

  it('resolves Forum labels to forum id', () => {
    expect(resolveVenueId('The Forum')).toBe('forum')
    expect(resolveVenueId('Kia Forum')).toBe('forum')
  })

  it('remaps saved Forum sessions off intuit during hydratePlan', () => {
    const saved: PlannedSession[] = [
      {
        id: 'para-pco01',
        sport: 'Ceremonies',
        venueLabel: 'The Forum',
        venueId: 'intuit',
        date: '2028-08-15',
        startTime: '19:00',
        endTime: '22:00',
        kind: 'CEREMONY',
        ticketStatus: 'want',
        attendees: [],
        notes: 'old pin',
        timeEstimated: false,
        sessionCode: 'PCO01',
        access: 'ticketed',
        games: 'paralympic',
      },
    ]
    const hydrated = hydratePlan(saved)
    const forum = hydrated.find((s) => s.venueLabel === 'The Forum')
    expect(forum?.venueId).toBe('forum')
    expect(forum?.notes).toBe('old pin')
  })

  it('places Alamitos Beach Stadium on the western Alamitos Beach shore', () => {
    const alamitos = VENUE_BY_ID.alamitos
    expect(alamitos.lat).toBeGreaterThan(33.76)
    expect(alamitos.lng).toBeLessThan(-118.14)
    expect(alamitos.note).toMatch(/Alamitos Beach/i)
  })

  it('keeps every pin within a plausible bounding box for its area', () => {
    for (const v of VENUES) {
      if (v.area === 'Oklahoma City') {
        expect(v.lat).toBeGreaterThan(35.4)
        expect(v.lng).toBeLessThan(-97.4)
        continue
      }
      // Southern California metro (incl. Trestles / Pomona)
      expect(v.lat).toBeGreaterThan(33.3)
      expect(v.lat).toBeLessThan(34.4)
      expect(v.lng).toBeGreaterThan(-118.6)
      expect(v.lng).toBeLessThan(-117.5)
    }
  })
})
