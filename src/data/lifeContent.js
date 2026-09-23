/**
 * Content for "Outside of Engineering" — swap URLs for your own photos in /public/ anytime.
 * Placeholders use Unsplash.
 *
 * Friends:
 * - Grid is **row-major** (CSS Grid): array order = left → right, then next row.
 * - Rows group by time: e.g. row1 = May ’26 → Apr ’26 → Aug ’25; row2 = three Jun ’25; then Jul ’25, last Jun ’25, Apr ’25; then older.
 * - Polaroid window defaults to **landscape 4:3** (wide, shorter height) — matches typical wide night-out photos.
 * - Optional `aspectRatio` per card (e.g. '16:9' wider, '3:2' photo ratio, '9:16' only if one shot is vertical).
 * - Optional `objectPosition` to nudge crop with object-fit: cover.
 */

export const friends = [
  {
    id: 'f23',
    image: '/Friends23.jpg',
    date: 'September 2026',
    caption: 'Hack the North',
    location: 'University of Waterloo',
    objectPosition: 'center 28%',
  },
  {
    id: 'f22',
    image: '/Friends22.jpg',
    date: 'September 2026',
    caption: 'Bro is trash at darts.',
    location: 'Waterloo, ON',
  },

  {
    id: 'f21',
    image: '/Friends21.jpg',
    date: 'September 2026',
    caption: 'Year 2!',
    location: 'McMaster University',
  },

  
  {
    id: 'f13',
    image: '/Friends18.jpg',
    date: 'June 2026',
    caption: 'Downtown McDonalds hit different',
    location: 'Toronto, ON'
  },
  {
    id: 'f10',
    image: '/Friends17.jpg',
    date: 'June 2026',
    caption: 'Remote CO-OP>>>>',
    location: 'Montego Bay, Jamaica'
  },
  {
    id: 'f1',
    image: '/Friends10.jpg',
    location: 'Bayview Village Park',
    date: 'May 2026',
    caption: 'Late Night Vibes.',
  },
  {
    id: 'f3',
    image: '/Friends9.jpg',
    location: 'Earl Haig Secondary School',
    date: 'April 2026',
    caption: 'Before big internships!',
  },
  {
    id: 'f11',
    image: '/Friends15.png',
    date: 'February 2026',
    location: 'A.N Bourns Building',
    caption: 'Final School Year Project',
    
  },
  {
    id: 'f14',
    image: '/Friends19.jpg',
    date: 'January 2026',
    caption: 'Pure Vibes',
    location: 'Hamilton, ON',
  },
  {
    id: 'f15',
    image: '/Friends20.jpg',
    date: 'December 2025',
    caption: 'All nighter',
    location: 'McMaster University',
  },
  {
    id: 'f12',
    image: '/Friends16.jpg',
    date: 'September 2025',
    caption: 'Projectile Motion is fun.',
    location: 'Burke Science Building'
  },
  {
    id: 'f5',
    image: '/Friends8.jpg',
    location: 'Richmond Hill Pro Bowl',
    date: 'August 2025',
    caption: 'STEAM Project Banquet 2025',
  },
  {
    id: 'f2',
    image: '/Friends7.jpg',
    location: 'Toronto, ON',
    date: 'July 2025',
    caption: 'Final Days',
  },
  {
    id: 'f4',
    image: '/Friends6.jpg',
    location: 'Toronto, ON',
    date: 'June 2025',
    caption: 'Graduated High School!',
  },
  {
    id: 'f8',
    image: '/Friends0.jpg',
    location: 'Toronto, ON',
    date: 'June 2025',
    caption: 'Graduation Part 2',
  },

  {
    id: 'f7',
    image: '/Friends4.jpg',
    location: 'Toronto, ON',
    date: 'June 2025',
    caption: 'Last Exam of High School! We got cooked😭.',
  },
  {
    id: 'f6',
    image: '/Friends5.jpg',
    location: 'Hollywood Public School',
    date: 'June 2025',
    caption: 'Back at a familiar place.',
  },
  {
    id: 'f9',
    image: '/Friends11.jpg',
    location: 'Toronto, ON',
    date: 'April 2025',
    caption: 'Midterms are finally done.',
  },
  {
    id: 'f10',
    image: '/Friends2.jpg',
    location: 'Richmond Hill, ON',
    date: 'August 2024',
    caption: 'STEAM Project staff social, 2024',
  },
  {
    id: 'f11',
    image: '/Friends13.jpg',
    location: 'Toronto, ON',
    date: 'August 2023',
    caption: 'Center Island, 2023',
  },
  {
    id: 'f12',
    image: '/Friends14.jpg',
    location: 'Bayview Middle School',
    date: 'February 2023',
    caption: 'Where it all started fr.',
  },
];

const vacationGroups = [
  {
    id: 'v1',
    section: 'Recent Trip',
    items: [
      {
        id: 'v1a',
        image:
          '/Vacation1.jpg',
        location: 'Minden Hills, ON',
        date: 'July 2025',
        note: 'Graduation Trip',
      },
      {
        id: 'v1b',
        image:
          '/Vacation2.jpg',
        location: 'Punta Cana, Dominican Republic',
        date: 'July 2025',
        note: 'RIP my Bank Account',
      },
    ],
  },
  {
    id: 'v2',
    section: 'Older Trip',
    items: [
      {
        id: 'v2a',
        image:
          '/Vacation3.jpg',
        location: 'Muskoka, ON',
        date: 'July 2016',
        note: '2016, that\'s all needed to be said',
       
      },
      {
        id: 'v2b',
        image:
          '/Vacation4.jpg',
        location: 'Singapore',
        date: 'July 2012',
        note: 'Universal Studios was PEAK.',
      },
      {
        id: 'v2c',
        image:
          '/Vacation5.jpg',
        location: 'London, UK',
        date: 'July 2011',
        note: 'I almost met Lewis Hamilton in person, but I was too scared to ask for a photo...',
      }
    ],
  },
];

/** Flat list for horizontal travel strip */
export const vacationSlides = vacationGroups.flatMap((g) =>
  g.items.map((item) => ({ ...item, sectionLabel: g.section }))
);

/** Shown under the playoff tracker bar */
export const PLAYOFF_SCORING_NOTE =
  'Scoring: exact winner + series length → +2. Right winner, wrong games → +1. Wrong winner → +1 loss. Pending rounds are not scored yet.';

export const ufcPredictions = [
  {
    id: 'u0',
    event: 'UFC 330: Makhachev vs Garry',
    matchup: 'Makhachev vs Garry',
    prediction: 'Ian Garry by decision',
    detail: 'I\'m feeling ballsy for this pick. I genuinely think the UFC has been so unpredictable lately and Garry has the style to beat Makhachev. Better striking plus a solid ground game. Garry is a big welterweight too. I think this will be a shocker and Garry will win by decision.',
    analysis: 'It was a close fight, but Makhachev showed why he is one of the GOATs in UFC history. I think Morales will be a nightmare fight for Makhachev.',
    outcome: 'loss',
    tag: 'Main card'
  },
  {
    id: 'u1',
    event: 'UFC 329: Holloway vs McGregor',
    matchup: 'Holloway vs McGregor',
    prediction: 'Holloway by round 3 TKO',
    detail: 'Mcgregor returning after 5 years, I just think he is too old and rusty. Holloway is no longer in his prime, however he is still competing at the highest level. First round will be tough for Holloway but he will get the TKO along the fence by round 3.',
    analysis: 'Brother...',
    outcome: 'win',
    tag: 'Main card',
    
  },
  {
    id: 'u2',
    event: 'UFC White House Card',
    matchup: 'Topuria vs Gaethje',
    prediction: 'Topuria by KO, round 1',
    detail:
      'This is not a fair fight, Topuria will pressure Gaethje and finish him in the first round.',
    analysis: 'Wow, did not expect this to happen. Topuria was clearly way too overconfident and Gaethje clearly had the right gameplan of clinching and uppercuts. I honestly don\'t think Topuria will ever be the same. That was a life changing beating.',
    outcome: 'loss',
    tag: 'Main card',
  },
  {
    id: 'u3',
    event: 'Co-Main Event',
    matchup: 'Alex Pereira vs Cyril Gane',
    prediction: 'Alex Pereira by decision',
    detail:
      "I know you're surprised I picked this fight to go the distance, but I think this will be a close fight. Gane is no slouch, but I do believe Alex is one of the best strikers we've seen in UFC history. It will be quite a boring fight too in my opinion with some people saying 'robbery'.",
    analysis: 'Alex clearly just couldn\'t handle being up at heavyweight. He should fight Hokit next but man he looked really bad out there. Gane honesly has a good shot of beating Aspinall in rematch and that is the next fight I want to see.',
    outcome: 'loss',
    tag: 'Main card',
  },
];

/** outcome: exact (+2 wins), winner (+1 win), wrong (+1 loss), pending */
export const nbaWesternPlayoffs = {
  conference: 'Western',
  rounds: [
    {
      label: 'First round',
      series: [
        {
          id: 'w-r1-1',
          matchup: '(1) Thunder vs (8) Suns',
          prediction: 'Thunder in 4',
          actual: 'Thunder advance (4-0)',
          outcome: 'exact',
        },
        {
          id: 'w-r1-2',
          matchup: '(4) Lakers vs (5) Rockets',
          prediction: 'Lakers in 6',
          actual: 'Lakers advance (4-2)',
          outcome: 'exact',
        },
        {
          id: 'w-r1-3',
          matchup: '(3) Nuggets vs (6) Timberwolves',
          prediction: 'Nuggets in 7',
          actual: 'Timberwolves advance (4-2)',
          outcome: 'wrong',
        },
        {
          id: 'w-r1-4',
          matchup: '(2) Spurs vs (7) Trail Blazers',
          prediction: 'Spurs in 5',
          actual: 'Spurs advance (4-1)',
          outcome: 'exact',
        },
      ],
    },
    {
      label: 'Conference semifinals',
      series: [
        {
          id: 'w-r2-1',
          matchup: '(1) Thunder vs (4) Lakers',
          prediction: 'Thunder in 6',
          actual: 'Thunder advance (4-0)',
          outcome: 'winner',
        },
        {
          id: 'w-r2-2',
          matchup: '(6) Timberwolves vs (2) Spurs',
          prediction: 'Spurs in 6',
          actual: 'Spurs advance (4-2)',
          outcome: 'exact',
        },
      ],
    },
    {
      label: 'Conference finals',
      series: [
        {
          id: 'w-r3-1',
          matchup: '(1) Thunder vs (2) Spurs',
          prediction: 'Spurs in 7',
          actual: 'Spurs advance (4-3)',
          outcome: 'exact',
       
        },
      ],
    },
  ],
};

export const nbaEasternPlayoffs = {
  conference: 'Eastern',
  rounds: [
    {
      label: 'First round',
      series: [
        {
          id: 'e-r1-1',
          matchup: '(1) Pistons vs (8) Magic',
          prediction: 'Pistons in 5',
          actual: 'Pistons advance (4-3)',
          outcome: 'winner',
        },
        {
          id: 'e-r1-2',
          matchup: '(4) Cavaliers vs (5) Raptors',
          prediction: 'Cavaliers in 6',
          actual: 'Cavaliers advance (4-3)',
          outcome: 'winner',
        },
        {
          id: 'e-r1-3',
          matchup: '(3) Knicks vs (6) Hawks',
          prediction: 'Knicks in 6',
          actual: 'Knicks advance (4-2)',
          outcome: 'exact',
        },
        {
          id: 'e-r1-4',
          matchup: '(2) Celtics vs (7) 76ers',
          prediction: 'Celtics in 5',
          actual: '76ers advance',
          outcome: 'wrong',
        },
      ],
    },
    {
      label: 'Conference semifinals',
      series: [
        {
          id: 'e-r2-1',
          matchup: '(1) Pistons vs (4) Cavaliers',
          prediction: 'Pistons in 6',
          actual: 'Cavaliers advance (4-3)',
          outcome: 'wrong',
          
        },
        {
          id: 'e-r2-2',
          matchup: '(3) Knicks vs (7) 76ers',
          prediction: 'Knicks in 6',
          actual: 'Knicks advance (4-0)',
          outcome: 'winner',
        },
      ],
    },
    {
      label: 'Conference finals',
      series: [
        {
          id: 'e-r3-1',
          matchup: '(3) Knicks vs (4) Cavaliers',
          prediction: 'Knicks in 6',
          actual: 'Knicks advance (4-0)',
          outcome: 'winner',
          
        },
      ],
    },
  ],
};

export const nbaFinalsBracket = {
  label: 'NBA Finals',
  series: [
    {
      id: 'fn-1',
      matchup: '(2) Spurs vs (3) Knicks',
      prediction: 'Spurs in 6',
      actual: 'Knick win (4-1)',
      outcome: 'wrong',
      note: 'Congrats to the Knicks!',
    },
  ],
};

function collectPlayoffSeries(conf) {
  return conf.rounds.flatMap((r) => r.series);
}

export function tallyNbaPlayoffsFromBracket() {
  const all = [
    ...collectPlayoffSeries(nbaWesternPlayoffs),
    ...collectPlayoffSeries(nbaEasternPlayoffs),
    ...nbaFinalsBracket.series,
  ];
  let wins = 0;
  let losses = 0;
  let pending = 0;
  for (const s of all) {
    if (s.outcome === 'pending') pending += 1;
    else if (s.outcome === 'exact') wins += 2;
    else if (s.outcome === 'winner') wins += 1;
    else if (s.outcome === 'wrong') losses += 1;
  }
  return { wins, losses, pending };
}

/* ——— World Cup 2026 knockout bracket ——— */
/** ISO 3166-1 alpha-2 codes (used to load flag images from flagcdn.com). */
export const worldCupFlags = {
  Germany: 'de',
  Paraguay: 'py',
  France: 'fr',
  Sweden: 'se',
  'South Africa': 'za',
  Canada: 'ca',
  Netherlands: 'nl',
  Morocco: 'ma',
  Portugal: 'pt',
  Croatia: 'hr',
  Spain: 'es',
  Austria: 'at',
  USA: 'us',
  'Bosnia & Herzegovina': 'ba',
  Belgium: 'be',
  Senegal: 'sn',
  Brazil: 'br',
  Japan: 'jp',
  'Ivory Coast': 'ci',
  Norway: 'no',
  Mexico: 'mx',
  Ecuador: 'ec',
  England: 'gb-eng',
  'DR Congo': 'cd',
  Argentina: 'ar',
  Peru: 'pe',
  Australia: 'au',
  Egypt: 'eg',
  Switzerland: 'ch',
  Algeria: 'dz',
  Colombia: 'co',
  Ghana: 'gh',
};

/**
 * Round of 32 seed matchups. Everything past this is derived from the
 * user's picks (the winner of each match advances to the next round).
 */
export const worldCupKnockout = {
  left: [
    { id: 'l32-0', a: 'Germany', b: 'Paraguay' },
    { id: 'l32-1', a: 'France', b: 'Sweden' },
    { id: 'l32-2', a: 'South Africa', b: 'Canada' },
    { id: 'l32-3', a: 'Netherlands', b: 'Morocco' },
    { id: 'l32-4', a: 'Portugal', b: 'Croatia' },
    { id: 'l32-5', a: 'Spain', b: 'Austria' },
    { id: 'l32-6', a: 'USA', b: 'Bosnia & Herzegovina' },
    { id: 'l32-7', a: 'Belgium', b: 'Senegal' },
  ],
  right: [
    { id: 'r32-0', a: 'Brazil', b: 'Japan' },
    { id: 'r32-1', a: 'Ivory Coast', b: 'Norway' },
    { id: 'r32-2', a: 'Mexico', b: 'Ecuador' },
    { id: 'r32-3', a: 'England', b: 'DR Congo' },
    { id: 'r32-4', a: 'Argentina', b: 'Peru' },
    { id: 'r32-5', a: 'Australia', b: 'Egypt' },
    { id: 'r32-6', a: 'Switzerland', b: 'Algeria' },
    { id: 'r32-7', a: 'Colombia', b: 'Ghana' },
  ],
};

/** Total knockout matches to predict: 16 + 8 + 4 + 2 + 1 = 31 */
export const WORLD_CUP_TOTAL_MATCHES = 31;

/**
 * MY predictions. Edit these — the value is the team you think wins that match.
 * Later-round matchups (l16-*, lqf-*, lsf-*, r16-*, rqf-*, rsf-*, final) are
 * built automatically from the winners you set in the round before.
 *
 * Round of 32 match ids are the same as in worldCupKnockout above.
 *  - l16-0 = winner(l32-0) vs winner(l32-1), l16-1 = winner(l32-2) vs winner(l32-3), ...
 *  - final = winner(lsf-0) vs winner(rsf-0)
 */
export const worldCupPicks = {
  // Left — Round of 32
  'l32-0': 'Germany',
  'l32-1': 'France',
  'l32-2': 'Canada',
  'l32-3': 'Morocco',
  'l32-4': 'Portugal',
  'l32-5': 'Spain',
  'l32-6': 'USA',
  'l32-7': 'Senegal',
  // Left — Round of 16
  'l16-0': 'France',
  'l16-1': 'Morocco',
  'l16-2': 'Spain',
  'l16-3': 'USA',
  // Left — Quarterfinals
  'lqf-0': 'France',
  'lqf-1': 'Spain',
  // Left — Semifinal
  'lsf-0': 'France',

  // Right — Round of 32
  'r32-0': 'Brazil',
  'r32-1': 'Norway',
  'r32-2': 'Mexico',
  'r32-3': 'England',
  'r32-4': 'Argentina',
  'r32-5': 'Egypt',
  'r32-6': 'Switzerland',
  'r32-7': 'Colombia',
  // Right — Round of 16
  'r16-0': 'Norway',
  'r16-1': 'England',
  'r16-2': 'Argentina',
  'r16-3': 'Colombia',
  // Right — Quarterfinals
  'rqf-0': 'England',
  'rqf-1': 'Argentina',
  // Right — Semifinal
  'rsf-0': 'Argentina',

  // Final
  final: 'France',
};
