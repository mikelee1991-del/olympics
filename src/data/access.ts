/** How a spectator can attend without buying a venue ticket. */
export type AccessKind = 'ticketed' | 'free' | 'boat'

type AccessInput = {
  code?: string
  sport: string
  venue: string
  description?: string
}

/**
 * LA28 officially lists Marathon, Race Walk, and Cycling Road as non-ticketed
 * (cheer along the course, space permitting):
 * https://get.support.tickets.la28.org/hc/en-us/articles/22983287155356
 *
 * Boat: open-water / coastal sessions where a private boat is a realistic free
 * viewing option (not an LA28 guarantee — harbor rules may still apply).
 */
export function classifyAccess(s: AccessInput): AccessKind {
  const sport = s.sport
  const blob = `${s.venue} ${s.description ?? ''}`.toLowerCase()

  if (sport === 'Cycling Road' || sport === 'Para Cycling Road') return 'free'
  if (sport === 'Athletics' || sport === 'Para Athletics (Marathon)') {
    if (/marathon|race walk|half-marathon/.test(blob) || sport.includes('Marathon'))
      return 'free'
  }
  if (sport === 'Para Triathlon') return 'free' // often course-based; confirm later


  if (sport === 'Sailing') return 'boat'
  if (sport === 'Open Water Swimming') return 'boat'
  if (sport === 'Surfing') return 'boat'
  if (sport === 'Rowing Coastal Beach Sprints') return 'boat'

  return 'ticketed'
}

export function accessLabel(access: AccessKind): string {
  if (access === 'free') return 'Free course'
  if (access === 'boat') return 'Free w/ boat'
  return 'Ticketed'
}

export function accessNote(access: AccessKind): string {
  if (access === 'free') {
    return 'LA28: non-ticketed course event — cheer along the route (space permitting).'
  }
  if (access === 'boat') {
    return 'No venue ticket expected if viewing from a boat / open water (confirm harbor rules).'
  }
  return ''
}

/** Codes for free or boat-access sessions to always include in the seed plan. */
export function freeOrBoatCodes(sessions: AccessInput[]): string[] {
  return sessions
    .filter((s) => classifyAccess(s) !== 'ticketed' && s.code)
    .map((s) => s.code as string)
}
