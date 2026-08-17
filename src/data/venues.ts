export type Venue = {
  id: string
  name: string
  lat: number
  lng: number
  area: string
  note?: string
}

/** Approximate LA28 venue coordinates for map planning (not official GIS). */
export const VENUES: Venue[] = [
  {
    id: 'coliseum',
    name: 'LA Memorial Coliseum',
    lat: 34.0141,
    lng: -118.2879,
    area: 'Exposition Park',
  },
  {
    id: 'venice',
    name: 'Venice Beach',
    lat: 33.985,
    lng: -118.4695,
    area: 'Westside',
  },
  {
    id: 'stadium-2028',
    name: '2028 Stadium (Aquatics)',
    lat: 34.0148,
    lng: -118.2872,
    area: 'Exposition Park',
    note: 'Placeholder pin near Expo Park until final aquatics venue is locked.',
  },
  {
    id: 'dtla-arena',
    name: 'DTLA Arena',
    lat: 34.043,
    lng: -118.2673,
    area: 'Downtown',
  },
  {
    id: 'peacock',
    name: 'Peacock Theater',
    lat: 34.0443,
    lng: -118.2659,
    area: 'Downtown',
  },
  {
    id: 'lacc',
    name: 'LA Convention Center',
    lat: 34.0396,
    lng: -118.2695,
    area: 'Downtown',
  },
  {
    id: 'galen',
    name: 'Galen Center',
    lat: 34.0212,
    lng: -118.2797,
    area: 'USC',
  },
  {
    id: 'carson-stadium',
    name: 'Carson Stadium',
    lat: 33.8644,
    lng: -118.2611,
    area: 'Carson',
  },
  {
    id: 'carson-velo',
    name: 'Carson Velodrome',
    lat: 33.8585,
    lng: -118.254,
    area: 'Carson',
  },
  {
    id: 'carson-field',
    name: 'Carson Field',
    lat: 33.863,
    lng: -118.257,
    area: 'Carson',
  },
  {
    id: 'carson-courts',
    name: 'Carson Courts',
    lat: 33.861,
    lng: -118.259,
    area: 'Carson',
  },
  {
    id: 'intuit',
    name: 'Intuit Dome',
    lat: 33.9447,
    lng: -118.3426,
    area: 'Inglewood',
  },
  {
    id: 'dodger',
    name: 'Dodger Stadium',
    lat: 34.0739,
    lng: -118.24,
    area: 'Elysian Park',
  },
  {
    id: 'rose-bowl',
    name: 'Rose Bowl Aquatics Center',
    lat: 34.1614,
    lng: -118.1676,
    area: 'Pasadena',
  },
  {
    id: 'rose-bowl-stadium',
    name: 'Rose Bowl Stadium',
    lat: 34.1613,
    lng: -118.1676,
    area: 'Pasadena',
  },
  {
    id: 'lb-aquatics',
    name: 'Long Beach Aquatics Center',
    lat: 33.7625,
    lng: -118.188,
    area: 'Long Beach',
  },
  {
    id: 'lb-arena',
    name: 'Long Beach Arena',
    lat: 33.764,
    lng: -118.1887,
    area: 'Long Beach',
  },
  {
    id: 'lb-climb',
    name: 'Long Beach Climbing Theater',
    lat: 33.7672,
    lng: -118.191,
    area: 'Long Beach',
  },
  {
    id: 'marine',
    name: 'Marine Stadium',
    lat: 33.7782,
    lng: -118.1345,
    area: 'Long Beach',
  },
  {
    id: 'alamitos',
    name: 'Alamitos Beach Stadium',
    lat: 33.7612,
    lng: -118.1402,
    area: 'Long Beach',
  },
  {
    id: 'belmont',
    name: 'Belmont Shore',
    lat: 33.7565,
    lng: -118.136,
    area: 'Long Beach',
  },
  {
    id: 'honda',
    name: 'Honda Center',
    lat: 33.8075,
    lng: -117.8765,
    area: 'Anaheim',
  },
  {
    id: 'santa-anita',
    name: 'Santa Anita Park',
    lat: 34.1384,
    lng: -118.0442,
    area: 'Arcadia',
  },
  {
    id: 'valley',
    name: 'Valley Complex',
    lat: 34.182,
    lng: -118.482,
    area: 'San Fernando Valley',
  },
  {
    id: 'industry',
    name: 'Industry Hill MTB Course',
    lat: 34.016,
    lng: -117.961,
    area: 'City of Industry',
  },
  {
    id: 'trestles',
    name: 'Trestles Beach',
    lat: 33.3842,
    lng: -117.594,
    area: 'San Clemente',
  },
  {
    id: 'expo',
    name: 'Exposition Park Stadium',
    lat: 34.014,
    lng: -118.2865,
    area: 'Exposition Park',
  },
  {
    id: 'universal',
    name: 'Universal Studios',
    lat: 34.1381,
    lng: -118.3534,
    area: 'Universal City',
  },
  {
    id: 'riviera',
    name: 'Riviera Country Club',
    lat: 34.0524,
    lng: -118.5013,
    area: 'Pacific Palisades',
  },
  {
    id: 'whittier',
    name: 'Whittier Narrows',
    lat: 34.039,
    lng: -118.061,
    area: 'South El Monte',
  },
  {
    id: 'fairplex',
    name: 'Fairgrounds Cricket Stadium',
    lat: 34.085,
    lng: -117.766,
    area: 'Pomona',
  },
  {
    id: 'okc-softball',
    name: 'OKC Softball Park',
    lat: 35.4676,
    lng: -97.5164,
    area: 'Oklahoma City',
    note: 'Preliminary softball — outside LA metro.',
  },
  {
    id: 'okc-whitewater',
    name: 'OKC Whitewater Center',
    lat: 35.465,
    lng: -97.51,
    area: 'Oklahoma City',
    note: 'Canoe slalom — outside LA metro.',
  },
  {
    id: 'multiple',
    name: 'Multiple Stadiums',
    lat: 34.0522,
    lng: -118.2437,
    area: 'Various',
    note: 'Soccer uses several venues; pin is downtown LA placeholder.',
  },
]

export const VENUE_BY_ID = Object.fromEntries(VENUES.map((v) => [v.id, v]))

/** Map schedule sheet venue strings → venue id. */
export const VENUE_ALIASES: Record<string, string> = {
  'Carson Stadium': 'carson-stadium',
  'DTLA Arena': 'dtla-arena',
  'Long Beach Aquatics Center': 'lb-aquatics',
  'LA Memorial Coliseum / Venice Beach': 'coliseum',
  'LA Memorial Coliseum': 'coliseum',
  'Galen Center': 'galen',
  'Dodger Stadium': 'dodger',
  'Intuit Dome': 'intuit',
  'Alamitos Beach Stadium': 'alamitos',
  'Valley Complex 1': 'valley',
  'Valley Complex 4': 'valley',
  'Valley Complex 2': 'valley',
  'Valley Complex 3': 'valley',
  'Valley Complex / Park': 'valley',
  'Peacock Theater / DTLA Arena': 'peacock',
  'Peacock Theater': 'peacock',
  'Marine Stadium': 'marine',
  'OKC Whitewater Center': 'okc-whitewater',
  'Long Beach Climbing Theater': 'lb-climb',
  'Fairgrounds Cricket Stadium': 'fairplex',
  'Venice Beach Boardwalk': 'venice',
  'Venice Beach': 'venice',
  'Carson Velodrome': 'carson-velo',
  'Rose Bowl Aquatics Center': 'rose-bowl',
  'Rose Bowl Stadium': 'rose-bowl-stadium',
  'Santa Anita Park': 'santa-anita',
  'LA Convention Center Hall 1': 'lacc',
  'LA Convention Center Hall 2': 'lacc',
  'LA Convention Center Hall 3': 'lacc',
  'Exposition Park Stadium': 'expo',
  'Multiple Stadiums': 'multiple',
  'Riviera Country Club': 'riviera',
  'Riviera Country Club Riviera': 'riviera',
  'Long Beach Arena': 'lb-arena',
  'Carson Field': 'carson-field',
  'Industry Hill MTB Course': 'industry',
  'Industry Hills MTB Course': 'industry',
  'Belmont Shore': 'belmont',
  '(Windsurfing & Kite) Belmont Shore': 'belmont',
  'Honda Center': 'honda',
  'OKC Softball Park': 'okc-softball',
  'Universal Studios': 'universal',
  'Comcast Squash Center at Universal Studios': 'universal',
  'Trestles Beach': 'trestles',
  'Trestles State Beach Trestles Beach': 'trestles',
  '2028 Stadium': 'stadium-2028',
  'Carson Courts': 'carson-courts',
  'Carson Court 1': 'carson-courts',
  'Carson Court 2': 'carson-courts',
  'Carson Courts 3-10': 'carson-courts',
  'Carson Center Court': 'carson-courts',
  'Long Beach / Whittier Narrows': 'whittier',
  '(Shotgun) Whittier Narrows Clay Shooting Center Whittier Narrows':
    'whittier',
  'LA Memorial Coliseum / 2028 Stadium': 'coliseum',
  '2028 Stadium / LA Memorial Coliseum': 'stadium-2028',
  'Venice Beach Venice': 'venice',
  '(Marathon) Venice Beach Boardwalk - Start Venice': 'venice',
  '(Race Walk) TBD TBD': 'multiple',
  'Sprint Paddle Marine Stadium': 'marine',
  '(Rifle & Pistol) Long Beach Target Shooting Hall': 'lb-arena',
  '- Final Stages DTLA Arena': 'dtla-arena',
  '- Preliminary Stages Peacock Theater': 'peacock',
}

export function resolveVenueId(venueLabel: string): string {
  const direct = VENUE_ALIASES[venueLabel]
  if (direct) return direct
  const lower = venueLabel.toLowerCase().trim()
  for (const [alias, id] of Object.entries(VENUE_ALIASES)) {
    const a = alias.toLowerCase()
    if (lower === a || lower.includes(a) || a.includes(lower)) {
      return id
    }
  }
  // Fuzzy keywords (more specific first)
  if (/coliseum/.test(lower)) return 'coliseum'
  if (/2028 stadium|aquatics stadium/.test(lower)) return 'stadium-2028'
  if (/intuit/.test(lower)) return 'intuit'
  if (/dodger/.test(lower)) return 'dodger'
  if (/velodrome/.test(lower)) return 'carson-velo'
  if (/climbing/.test(lower)) return 'lb-climb'
  if (/marine stadium|sprint paddle/.test(lower)) return 'marine'
  if (/alamitos/.test(lower)) return 'alamitos'
  if (/honda/.test(lower)) return 'honda'
  if (/santa anita/.test(lower)) return 'santa-anita'
  if (/rose bowl aquatics/.test(lower)) return 'rose-bowl'
  if (/rose bowl/.test(lower)) return 'rose-bowl-stadium'
  if (/convention/.test(lower)) return 'lacc'
  if (/industry hills|mtb/.test(lower)) return 'industry'
  if (/galen/.test(lower)) return 'galen'
  if (/peacock/.test(lower)) return 'peacock'
  if (/dtla arena/.test(lower)) return 'dtla-arena'
  if (/valley complex/.test(lower)) return 'valley'
  if (/long beach arena/.test(lower)) return 'lb-arena'
  if (/long beach aquatics/.test(lower)) return 'lb-aquatics'
  if (/carson stadium/.test(lower)) return 'carson-stadium'
  if (/carson (center )?court/.test(lower)) return 'carson-courts'
  if (/carson field/.test(lower)) return 'carson-field'
  if (/exposition park/.test(lower)) return 'expo'
  if (/belmont/.test(lower)) return 'belmont'
  if (/trestles/.test(lower)) return 'trestles'
  if (/venice|marathon/.test(lower) && /beach|boardwalk/.test(lower))
    return 'venice'
  if (/universal|squash/.test(lower)) return 'universal'
  if (/whittier|shotgun|clay shooting/.test(lower)) return 'whittier'
  if (/riviera/.test(lower)) return 'riviera'
  if (/okc.*softball|softball.*okc/.test(lower)) return 'okc-softball'
  if (/whitewater|canoe slalom/.test(lower)) return 'okc-whitewater'
  if (/port of los angeles|dinghy|skiff|multihull/.test(lower)) return 'marine'
  return 'multiple'
}
