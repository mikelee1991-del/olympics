import {
  accessNote,
  classifyAccess,
  freeOrBoatCodes,
  type AccessKind,
} from './access'
import { interestedPeople, type PersonId } from './family'
import { resolveVenueId } from './venues'
import official from './officialSessions.json'

export type TicketStatus = 'have' | 'want' | 'skip'
export type SessionKind = 'MEDAL' | 'STD' | 'CEREMONY' | 'OTHER'
export type { AccessKind }

export type PlannedSession = {
  id: string
  sport: string
  venueLabel: string
  venueId: string
  /** ISO date YYYY-MM-DD (2028) */
  date: string
  /** HH:MM 24h Pacific */
  startTime: string
  endTime: string
  kind: SessionKind
  ticketStatus: TicketStatus
  attendees: PersonId[]
  notes: string
  /** true when start/end are guesses, not from LA28 PDF */
  timeEstimated: boolean
  /** Official LA28 session code when known (e.g. ATH01) */
  sessionCode?: string
  /** Ticketed vs course-free vs boat-viewable */
  access: AccessKind
}

export type OfficialSession = {
  code: string
  sport: string
  venue: string
  zone: string
  date: string
  startTime: string
  endTime: string
  sessionType: string
  description: string
}

export const OFFICIAL_META = {
  source: official.source,
  sourceUrl: official.sourceUrl,
  timezone: official.timezone,
}

export const OFFICIAL_SESSIONS = official.sessions as OfficialSession[]
export const OFFICIAL_SEED_CODES = new Set(official.seedCodes as string[])

export function formatDisplayDate(iso: string): string {
  const d = new Date(`${iso}T12:00:00`)
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

function kindFromOfficial(s: OfficialSession): SessionKind {
  if (s.sessionType === 'Ceremony' || s.sport === 'Ceremonies') return 'CEREMONY'
  if (
    s.sessionType === 'Final' ||
    /medal/i.test(s.description) ||
    s.sessionType === 'Semifinal'
  ) {
    return 'MEDAL'
  }
  return 'STD'
}

export function officialToPlanned(s: OfficialSession): PlannedSession {
  const access = classifyAccess(s)
  const note = accessNote(access)
  const baseNotes = `${s.sessionType}: ${s.description}`.trim()
  return {
    id: s.code.toLowerCase(),
    sport: s.sport,
    venueLabel: s.venue,
    venueId: resolveVenueId(s.venue),
    date: s.date,
    startTime: s.startTime,
    endTime: s.endTime,
    kind: kindFromOfficial(s),
    // Free course events don't need a ticket purchase.
    ticketStatus: access === 'free' ? 'have' : 'want',
    attendees: interestedPeople(s.sport),
    notes: note ? `${baseNotes} — ${note}` : baseNotes,
    timeEstimated: false,
    sessionCode: s.code,
    access,
  }
}

/** Family wishlist + any officially free / boat-viewable sessions. */
export function buildSeedPlan(): PlannedSession[] {
  const codes = new Set([
    ...OFFICIAL_SEED_CODES,
    ...freeOrBoatCodes(OFFICIAL_SESSIONS),
  ])
  return OFFICIAL_SESSIONS.filter((s) => codes.has(s.code))
    .map(officialToPlanned)
    .sort((a, b) =>
      `${a.date}${a.startTime}`.localeCompare(`${b.date}${b.startTime}`),
    )
}

/** Backfill access on older saved plans. */
export function withAccess(session: PlannedSession): PlannedSession {
  if (session.access) return session
  const access = classifyAccess({
    sport: session.sport,
    venue: session.venueLabel,
    description: session.notes,
  })
  return { ...session, access }
}

/**
 * Ensure free / boat-viewable official sessions exist in a saved plan and carry
 * the correct access tags (so older localStorage still shows them on Calendar).
 */
export function mergeFreeBoatSessions(
  sessions: PlannedSession[],
): PlannedSession[] {
  const byId = new Map(
    sessions.map((s) => [s.id, withAccess(s)] as const),
  )

  for (const official of OFFICIAL_SESSIONS) {
    const access = classifyAccess(official)
    if (access === 'ticketed') continue
    const planned = officialToPlanned(official)
    const existing = byId.get(planned.id)
    if (!existing) {
      byId.set(planned.id, planned)
      continue
    }
    byId.set(planned.id, {
      ...existing,
      access,
      venueLabel: planned.venueLabel,
      venueId: planned.venueId,
      date: planned.date,
      startTime: planned.startTime,
      endTime: planned.endTime,
      kind: planned.kind,
      sessionCode: planned.sessionCode,
      timeEstimated: false,
      ticketStatus:
        access === 'free' && existing.ticketStatus !== 'skip'
          ? 'have'
          : existing.ticketStatus,
      notes: existing.notes.includes('LA28:') || existing.notes.includes('boat')
        ? existing.notes
        : planned.notes,
    })
  }

  return [...byId.values()].sort((a, b) =>
    `${a.date}${a.startTime}`.localeCompare(`${b.date}${b.startTime}`),
  )
}

export const ALL_SPORTS = [
  ...new Set(OFFICIAL_SESSIONS.map((s) => s.sport)),
].sort()

/** Bump key when seed source changes so browsers pick up free/boat tags. */
export const PLANNER_STORAGE_KEY = 'olympics-planner-v3-access'

/** Clear every planner key (current + legacy) before a hard reset. */
export function clearPlannerStorage(): void {
  const doomed = new Set<string>([
    PLANNER_STORAGE_KEY,
    'olympics-planner-v1',
    'olympics-planner-v2-official',
  ])
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key?.startsWith('olympics-planner-')) doomed.add(key)
  }
  for (const key of doomed) localStorage.removeItem(key)
}
