export type PersonId =
  | 'Tui'
  | 'Connie'
  | 'Jason'
  | 'Katie'
  | 'Joy'
  | 'Andy'
  | 'Michael'
  | 'Elle'
  | 'Mike'

export const PEOPLE: PersonId[] = [
  'Mike',
  'Tui',
  'Connie',
  'Jason',
  'Katie',
  'Joy',
  'Andy',
  'Michael',
  'Elle',
]

/** Ranked sport picks from Family Picks sheet (1 = highest). */
export const FAMILY_RANKS: Record<Exclude<PersonId, 'Mike'>, string[]> = {
  Tui: [
    'Ceremonies',
    'Athletics',
    'Swimming',
    'Tennis',
    'Volleyball',
    'Rugby Sevens',
    'Cycling Track',
    'Equestrian',
    'Table Tennis',
    'Lacrosse',
  ],
  Connie: [
    'Ceremonies',
    'Athletics',
    'Artistic Gymnastics',
    'Swimming',
    'Volleyball',
    'Equestrian',
    'Rugby Sevens',
    'Tennis',
    'Table Tennis',
    'Basketball',
  ],
  Jason: [
    'Beach Volleyball',
    'Volleyball',
    'Cycling Track',
    'Swimming',
    'Ceremonies',
    'Archery',
    'Baseball',
    'Rowing',
    'Handball',
    'Climbing',
  ],
  Katie: [
    'Diving',
    'Artistic Gymnastics',
    'Ceremonies',
    'Volleyball',
    'Canoe Sprint',
    'Badminton',
    'Climbing',
    'Table Tennis',
    'Rugby Sevens',
    'Swimming',
  ],
  Joy: [
    'Athletics',
    'Cycling Track',
    'Ceremonies',
    'Rugby Sevens',
    'Diving',
    'Modern Pentathlon',
    'Canoe Sprint',
    'Table Tennis',
    'Artistic Gymnastics',
    'Swimming',
  ],
  Andy: [
    'Athletics',
    'Swimming',
    'Cycling Track',
    'Rowing',
    'Ceremonies',
    'Rugby Sevens',
    'Modern Pentathlon',
    'Football (Soccer)',
    'Canoe Sprint',
    'Diving',
    'Water Polo',
  ],
  Michael: [
    'Athletics',
    'Ceremonies',
    'Climbing',
    'Cycling Track',
    'Modern Pentathlon',
    'Canoe Sprint',
    'Diving',
    'Mountain Bike',
    'Rowing',
    'Swimming',
    'Water Polo',
  ],
  Elle: [
    'Athletics',
    'Ceremonies',
    'Artistic Gymnastics',
    'Rugby Sevens',
    'Table Tennis',
    'Handball',
    'Swimming',
    'Beach Volleyball',
    'Cycling Track',
    'Equestrian',
  ],
}

/** Mike priority 1–2 sports from Mike Picks sheet. */
export const MIKE_PRIORITY: Record<string, number> = {
  Athletics: 1,
  Ceremonies: 1,
  Climbing: 1,
  'Cycling Track': 1,
  'Modern Pentathlon': 1,
  'Canoe Sprint': 2,
  Diving: 2,
  'Mountain Bike': 2,
  Rowing: 2,
  Swimming: 2,
  'Water Polo': 2,
}

export function interestedPeople(sport: string, maxRank = 3): PersonId[] {
  const people: PersonId[] = []
  if ((MIKE_PRIORITY[sport] ?? 99) <= 2) people.push('Mike')
  for (const [person, ranks] of Object.entries(FAMILY_RANKS)) {
    const idx = ranks.indexOf(sport)
    if (idx >= 0 && idx < maxRank) {
      people.push(person as PersonId)
    }
  }
  // Ceremonies / Athletics / Swimming: include anyone who ranked them at all
  if (
    sport === 'Ceremonies' ||
    sport === 'Athletics' ||
    sport === 'Swimming'
  ) {
    for (const [person, ranks] of Object.entries(FAMILY_RANKS)) {
      if (ranks.includes(sport) && !people.includes(person as PersonId)) {
        people.push(person as PersonId)
      }
    }
  }
  return people
}
