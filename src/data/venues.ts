export type Venue = {
  id: string
  name: string
  lat: number
  lng: number
  area: string
  note?: string
}

/** Approximate LA28 venue coordinates for map planning (not official GIS).
 * Audited against OSM / Wikipedia place coords (Aug 2026). */
export const VENUES: Venue[] = [
  {
    id: 'coliseum',
    name: 'LA Memorial Coliseum',
    lat: 34.01417,
    lng: -118.28778,
    area: 'Exposition Park',
  },
  {
    id: 'venice',
    name: 'Venice Beach',
    lat: 33.9867,
    lng: -118.4741,
    area: 'Westside',
  },
  {
    id: 'stadium-2028',
    name: '2028 Stadium (SoFi / Swimming)',
    lat: 33.9534,
    lng: -118.339,
    area: 'Inglewood',
    note: 'LA28 “2028 Stadium” = SoFi Stadium (swimming + ceremonies), not Exposition Park.',
  },
  {
    id: 'dtla-arena',
    name: 'DTLA Arena',
    lat: 34.043,
    lng: -118.2671,
    area: 'Downtown',
    note: 'Crypto.com Arena (LA28 DTLA Arena).',
  },
  {
    id: 'peacock',
    name: 'Peacock Theater',
    lat: 34.0445,
    lng: -118.2671,
    area: 'Downtown',
  },
  {
    id: 'lacc',
    name: 'LA Convention Center',
    lat: 34.0415,
    lng: -118.269,
    area: 'Downtown',
  },
  {
    id: 'galen',
    name: 'Galen Center',
    lat: 34.0208,
    lng: -118.2798,
    area: 'USC',
  },
  {
    id: 'carson-stadium',
    name: 'Carson Stadium',
    lat: 33.8642,
    lng: -118.2611,
    area: 'Carson',
    note: 'Dignity Health Sports Park main stadium.',
  },
  {
    id: 'carson-velo',
    name: 'Carson Velodrome',
    lat: 33.8591,
    lng: -118.2598,
    area: 'Carson',
    note: 'VELO Sports Center.',
  },
  {
    id: 'carson-field',
    name: 'Carson Field',
    lat: 33.8638,
    lng: -118.261,
    area: 'Carson',
    note: 'Hockey field on Dignity Health Sports Park campus.',
  },
  {
    id: 'carson-courts',
    name: 'Carson Courts',
    lat: 33.8618,
    lng: -118.2615,
    area: 'Carson',
    note: 'Tennis courts on Dignity Health Sports Park campus.',
  },
  {
    id: 'intuit',
    name: 'Intuit Dome',
    lat: 33.9451,
    lng: -118.3431,
    area: 'Inglewood',
  },
  {
    id: 'forum',
    name: 'Kia Forum',
    lat: 33.9582,
    lng: -118.342,
    area: 'Inglewood',
    note: 'Paralympic indoor venue (The Forum).',
  },
  {
    id: 'dodger',
    name: 'Dodger Stadium',
    lat: 34.0736,
    lng: -118.2398,
    area: 'Elysian Park',
  },
  {
    id: 'rose-bowl',
    name: 'Rose Bowl Aquatics Center',
    lat: 34.1513,
    lng: -118.1643,
    area: 'Pasadena',
    note: 'Diving pool on N Arroyo — not the football stadium up the hill.',
  },
  {
    id: 'rose-bowl-stadium',
    name: 'Rose Bowl Stadium',
    lat: 34.1613,
    lng: -118.1677,
    area: 'Pasadena',
  },
  {
    id: 'lb-aquatics',
    name: 'Long Beach Aquatics Center',
    lat: 33.758,
    lng: -118.1442,
    area: 'Long Beach',
    note: 'Belmont Plaza / Belmont Beach & Aquatics site (Olympic Plaza).',
  },
  {
    id: 'lb-arena',
    name: 'Long Beach Arena',
    lat: 33.7641,
    lng: -118.1884,
    area: 'Long Beach',
  },
  {
    id: 'lb-climb',
    name: 'Long Beach Climbing Theater',
    lat: 33.7647,
    lng: -118.1907,
    area: 'Long Beach',
    note: 'Temporary theater by the Long Beach Convention Center / Arena.',
  },
  {
    id: 'marine',
    name: 'Marine Stadium',
    lat: 33.7624,
    lng: -118.1218,
    area: 'Long Beach',
  },
  {
    id: 'alamitos',
    name: 'Alamitos Beach Stadium',
    lat: 33.755,
    lng: -118.1319,
    area: 'Long Beach',
  },
  {
    id: 'belmont',
    name: 'Belmont Shore',
    lat: 33.7572,
    lng: -118.137,
    area: 'Long Beach',
  },
  {
    id: 'honda',
    name: 'Honda Center',
    lat: 33.8078,
    lng: -117.8765,
    area: 'Anaheim',
  },
  {
    id: 'santa-anita',
    name: 'Santa Anita Park',
    lat: 34.139,
    lng: -118.0459,
    area: 'Arcadia',
  },
  {
    id: 'valley',
    name: 'Valley Complex',
    lat: 34.183,
    lng: -118.5036,
    area: 'San Fernando Valley',
    note: 'Sepulveda Basin Sports Complex (Balboa Blvd, Encino).',
  },
  {
    id: 'industry',
    name: 'Industry Hill MTB Course',
    lat: 34.0262,
    lng: -117.9385,
    area: 'City of Industry',
    note: 'Industry Hills / Expo Center area.',
  },
  {
    id: 'trestles',
    name: 'Trestles Beach',
    lat: 33.3884,
    lng: -117.5945,
    area: 'San Clemente',
  },
  {
    id: 'expo',
    name: 'Exposition Park Stadium',
    lat: 34.0128,
    lng: -118.2841,
    area: 'Exposition Park',
    note: 'BMO Stadium (flag football / lacrosse).',
  },
  {
    id: 'universal',
    name: 'Universal Studios',
    lat: 34.1392,
    lng: -118.3544,
    area: 'Universal City',
  },
  {
    id: 'riviera',
    name: 'Riviera Country Club',
    lat: 34.0452,
    lng: -118.5025,
    area: 'Pacific Palisades',
  },
  {
    id: 'whittier',
    name: 'Whittier Narrows',
    lat: 34.035,
    lng: -118.051,
    area: 'South El Monte',
  },
  {
    id: 'fairplex',
    name: 'Fairgrounds Cricket Stadium',
    lat: 34.0871,
    lng: -117.7669,
    area: 'Pomona',
  },
  {
    id: 'okc-softball',
    name: 'OKC Softball Park',
    lat: 35.5248,
    lng: -97.4637,
    area: 'Oklahoma City',
    note: 'Devon Park (USA Softbal Hall of Fame Complex) — outside LA metro.',
  },
  {
    id: 'okc-whitewater',
    name: 'OKC Whitewater Center',
    lat: 35.4599,
    lng: -97.4987,
    area: 'Oklahoma City',
    note: 'Riversport Rapids canoe slalom — outside LA metro.',
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
  // Paralympic schedule venue strings
  'LA Convention Center Hall A': 'lacc',
  'LA Convention Center Hall B': 'lacc',
  'LA Convention Center Hall C': 'lacc',
  'LA Convention Center Hall F': 'lacc',
  'LA Convention Center Hall G': 'lacc',
  'LA Convention Center Hall H': 'lacc',
  'LA Convention Center Hall K': 'lacc',
  'LA Convention Center Petree Hall': 'lacc',
  'Long Beach Waterfront': 'alamitos',
  'The Forum': 'forum',
  'Kia Forum': 'forum',
  'Valley Sports Complex': 'valley',
  'LA84 Foundation Velodrome': 'carson-velo',
  'LA84 Velodrome': 'carson-velo',
  'Para Aquatic Center': 'lb-aquatics',
  'Long Beach Aquatic Center': 'lb-aquatics',
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
