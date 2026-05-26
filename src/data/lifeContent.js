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
    id: 'u1',
    event: 'UFC White House Card',
    matchup: 'Topuria vs Gaethje',
    prediction: 'Topuria by KO, round 1',
    detail:
      'This is not a fair fight, Topuria will pressure Gaethje and finish him in the first round.',
    tag: 'Main card',
  },
  {
    id: 'u2',
    event: 'Co-Main Event',
    matchup: 'Alex Pereira vs Cyril Gane',
    prediction: 'Alex Pereira by decision',
    detail:
      "I know you're surprised I picked this fight to go the distance, but I think this will be a close fight. Gane is no slouch, but I do believe Alex is one of the best strikers we've seen in UFC history. It will be quite a boring fight too in my opinion with some people saying 'robbery'.",
    tag: 'Co-main energy',
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
          actual: null,
          outcome: 'pending',
          note: 'Next game: May 24 @ 8:00 PM ET',
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
      actual: null,
      outcome: 'pending',
    
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
