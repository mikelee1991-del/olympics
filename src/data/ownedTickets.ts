import { PEOPLE, interestedPeople, type PersonId } from './family'

/** Tickets the family already purchased (from LA28 ticket portal). */
export type OwnedTicket = {
  code: string
  /** Seat count from the order */
  qty: number
  /** Optional display label from the ticket portal */
  label?: string
}

export const OWNED_TICKETS: OwnedTicket[] = [
  {
    code: 'ARC10',
    qty: 4,
    label: "Archery Men's Preliminary",
  },
  {
    code: 'HBL42',
    qty: 3,
    label: "Handball Women's Semifinal",
  },
  {
    code: 'CSP04',
    qty: 5,
    label: 'Canoe Sprint Mixed Final',
  },
]

export const OWNED_TICKET_BY_CODE = Object.fromEntries(
  OWNED_TICKETS.map((t) => [t.code, t]),
) as Record<string, OwnedTicket>

/** Prefer people who ranked the sport, then fill remaining seats in family order. */
export function attendeesForOwnedTickets(
  sport: string,
  qty: number,
): PersonId[] {
  const ranked = interestedPeople(sport, 99)
  const out: PersonId[] = []
  for (const p of ranked) {
    if (out.length >= qty) break
    out.push(p)
  }
  for (const p of PEOPLE) {
    if (out.length >= qty) break
    if (!out.includes(p)) out.push(p)
  }
  return out.slice(0, qty)
}
