/** Driving + parking buffers for LA28 venue hops (Pacific Time planning). */

import { VENUE_BY_ID } from '../data/venues'

/** Average urban Games-time speed including congestion (km/h). */
export const AVG_DRIVE_KMH = 28

/** Minutes to exit venue / walk to car after a session ends. */
export const PARK_EXIT_MIN = 20

/** Minutes to park + walk into the next venue before session start. */
export const PARK_ENTER_MIN = 25

/** Extra contingency for Games traffic / security lines. */
export const CONTINGENCY_MIN = 15

export function haversineKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(x))
}

export type TravelPlan = {
  distanceKm: number
  driveMin: number
  parkExitMin: number
  parkEnterMin: number
  contingencyMin: number
  /** Total minutes needed between end of A and start of B. */
  requiredGapMin: number
}

export function travelBetweenVenues(
  venueIdA: string,
  venueIdB: string,
): TravelPlan | null {
  if (venueIdA === venueIdB) {
    return {
      distanceKm: 0,
      driveMin: 0,
      parkExitMin: 10,
      parkEnterMin: 10,
      contingencyMin: 5,
      requiredGapMin: 25,
    }
  }
  const a = VENUE_BY_ID[venueIdA]
  const b = VENUE_BY_ID[venueIdB]
  if (!a || !b) return null
  const distanceKm = haversineKm(a.lat, a.lng, b.lat, b.lng)
  const driveMin = Math.ceil((distanceKm / AVG_DRIVE_KMH) * 60)
  const requiredGapMin =
    PARK_EXIT_MIN + driveMin + PARK_ENTER_MIN + CONTINGENCY_MIN
  return {
    distanceKm: Math.round(distanceKm * 10) / 10,
    driveMin,
    parkExitMin: PARK_EXIT_MIN,
    parkEnterMin: PARK_ENTER_MIN,
    contingencyMin: CONTINGENCY_MIN,
    requiredGapMin,
  }
}
