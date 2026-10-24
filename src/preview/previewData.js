// All sample content for the grant preview lives here and is marked as sample in the interface.
// Facts come from the project's own research. Transcript lines are placeholders, not quotations.

const LINES_A = [
  'Sample line. The narrator describes the corner at 7th and Park before 1957.',
  'Sample line. A story about the grocery and who shopped there on an ordinary day.',
  'Sample line. How the family talked about school in the months before September.',
  'Sample line. What the household sounded like on the morning the school year began.',
  'Sample line. A neighbor who checked in after the news reached the street.',
  'Sample line. The Lost Year at home and who filled the empty days.',
  'Sample line. What changed in the neighborhood after the schools reopened.',
  'Sample line. A closing reflection in the narrator’s own words.'
];

const LINES_B = [
  'Sample line. The narrator describes growing up in the same house as a famous sibling.',
  'Sample line. What the family knew about the plan and what it kept from the children.',
  'Sample line. The day the newspaper printed the family’s names and address.',
  'Sample line. How the phone calls and the visitors changed the house.',
  'Sample line. The decision to send a sibling away and how the family said goodbye.',
  'Sample line. Letters and calls between Little Rock and New York.',
  'Sample line. What the narrator wants teachers to know.',
  'Sample line. A closing reflection in the narrator’s own words.'
];

export const NARRATORS = [
  {
    id: 'hampton',
    name: 'Dr. Sybil Hampton Jordan',
    tag: 'Interviewed 2024',
    facts: [
      'Grew up at 7th and Park, seven blocks from Central High School.',
      'Her grandfather built the family house and ran Kid’s Grocery on the southeast corner of that intersection.'
    ],
    lines: LINES_A,
    mapLinks: ['hampton', 'central'],
    timelineLinks: []
  },
  {
    id: 'brown',
    name: 'Phyllis Brown',
    tag: 'Interviewed 2024',
    facts: [
      'Sister of Minnijean Brown, one of the Little Rock Nine.',
      'Her story follows how a public school crisis reached the family’s front door.'
    ],
    lines: LINES_B,
    mapLinks: ['brownny'],
    timelineLinks: ['h15']
  },
  { id: 'n3', name: 'Interview scheduled', tag: 'In progress', ghost: true },
  { id: 'n4', name: 'Interview scheduled', tag: 'In progress', ghost: true }
];

export const TRANSCRIPT_SECONDS = 72;

// Links from a family event to the public event that reached it.
// Keys are family-experience event ids in TimelineSection. The grant adds a cited source to each link.
export const REACHED_BY = {
  h10: { from: 'h9', source: 'Sample citation' },
  h11: { from: 'h9', source: 'Sample citation' },
  h12: { from: 'h3', source: 'Sample citation' },
  h16: { from: 'h7', source: 'Sample citation' }
};

export const MEDIA = [
  { type: 'video', title: 'Public video excerpt', tier: 'pub' },
  { type: 'audio', title: 'Oral history audio clip', tier: 'pub' },
  { type: 'photo', title: 'Family photograph', tier: 'pub' },
  { type: 'doc', title: 'Newspaper clipping', tier: 'pub' },
  { type: 'video', title: 'Full interview recording', tier: 'lock' },
  { type: 'audio', title: 'Full audio recording', tier: 'lock' },
  { type: 'photo', title: 'Photograph held by request', tier: 'lock' },
  { type: 'doc', title: 'School board record', tier: 'pub' }
];

export const MAP_STATES = [
  { name: 'Before the crisis', caption: 'Families and businesses in their neighborhoods, before 1957.' },
  { name: 'During 1957–58', caption: 'The school year begins and the household becomes public.' },
  { name: 'The Lost Year', caption: 'All four high schools close and families scatter.' },
  { name: 'After', caption: 'The schools reopen and the community rebuilds.' }
];

export const MAP_CATEGORIES = {
  family: 'Family home',
  business: 'Family business',
  institution: 'Institution or network',
  school: 'School',
  arc: 'Lost Year journey'
};

export const NEIGHBORHOOD_VIEW = { center: [-92.2895, 34.7392], zoom: 13.3 };
export const NATIONAL_VIEW = { center: [-96.5, 38.2], zoom: 3.1 };

// Positions are illustrative until the surveyed addresses are loaded.
export const PINS = [
  { id: 'hampton', type: 'business', lon: -92.30015, lat: 34.74205, states: [0, 1, 3], title: 'Kid’s Grocery, 7th and Park',
    text: 'Built by Sybil Hampton Jordan’s grandfather on the southeast corner of the intersection where the family lived. An Anglo-owned grocery stood on the southwest corner. Two racial economies on one corner.', story: 'hampton' },
  { id: 'anglo', type: 'business', lon: -92.30085, lat: 34.74205, states: [0, 1, 3], title: 'Anglo-owned grocery, 7th and Park',
    text: 'Southwest corner of the same intersection. Compare the two corners with the 3D tilt.' },
  { id: 'central', type: 'school', lon: -92.30035, lat: 34.7362, states: [0, 1, 3], title: 'Central High School',
    text: 'Seven blocks from the Hampton family home. Closed during the Lost Year.' },
  { id: 'rizard', type: 'family', lon: -92.2862, lat: 34.7336, states: [0], title: 'Terrence Roberts, Izard Street',
    text: 'The Roberts family home at 1624 Izard Street before the move in 1952.' },
  { id: 'rhoward', type: 'family', lon: -92.2994, lat: 34.7388, states: [0, 1, 3], title: 'Terrence Roberts, Howard Street',
    text: 'The family moved in 1952 to Howard Street, one block from Park Street. The block was racially integrated in an otherwise rigidly segregated neighborhood.' },
  { id: 'bates', type: 'institution', lon: -92.2776, lat: 34.7399, states: [0, 1, 2, 3], title: 'Daisy Bates and the NAACP network',
    text: 'The organizational spine of the integration effort on 9th Street, where journalists, politicians and NAACP workers gathered.' },
  { id: 'press', type: 'institution', lon: -92.2792, lat: 34.74, states: [0, 1, 2, 3], title: 'The State Press, 9th Street',
    text: 'The newspaper that printed the names and home address of Minnijean Brown’s parents.' },
  { id: 'lr', type: 'family', national: true, lon: -92.2896, lat: 34.7465, states: [0, 1, 2, 3], title: 'Little Rock',
    text: 'Thelma Mothershed completes her courses by correspondence. Beverly Roberts stays to care for her younger siblings.' },
  { id: 'la', type: 'family', national: true, lon: -118.2437, lat: 34.0522, states: [2], title: 'Los Angeles',
    text: 'Terrence Roberts lives with his aunt and uncle and attends Los Angeles High School.' },
  { id: 'brownny', type: 'family', national: true, lon: -73.8785, lat: 40.9923, states: [2], title: 'Hastings-on-Hudson, New York',
    text: 'Minnijean Brown lives with the Clarks. Her sister Phyllis Brown tells this part of the story.', story: 'brown' }
];

// Simplified outline of the contiguous United States for the national view.
export const US_OUTLINE = [[-124.7,48.4],[-123.0,48.3],[-122.8,49.0],[-95.2,49.0],[-94.6,48.7],[-93.0,48.6],[-91.4,48.1],[-89.6,48.0],[-90.8,47.3],[-88.4,46.9],[-87.3,46.5],[-84.8,46.9],[-84.1,46.2],[-83.5,45.9],[-84.7,45.7],[-85.5,45.2],[-86.2,44.6],[-86.5,43.7],[-86.3,42.7],[-87.0,41.8],[-87.8,42.4],[-87.8,43.3],[-87.5,44.6],[-87.0,45.3],[-86.3,45.9],[-85.0,45.9],[-84.4,45.5],[-83.4,45.2],[-83.9,43.9],[-83.0,44.0],[-82.5,43.0],[-83.1,42.1],[-82.6,41.7],[-81.0,41.9],[-79.0,42.7],[-79.0,43.3],[-76.5,43.6],[-75.0,44.9],[-71.5,45.0],[-70.3,46.0],[-69.2,47.4],[-68.2,47.3],[-67.8,47.1],[-67.8,45.7],[-67.0,44.9],[-68.5,44.3],[-70.2,43.6],[-70.7,42.9],[-70.6,42.4],[-70.0,41.8],[-70.6,41.5],[-71.5,41.4],[-73.7,40.9],[-74.0,40.5],[-74.0,39.7],[-74.9,38.9],[-75.1,38.3],[-75.9,37.1],[-76.0,36.9],[-75.5,35.3],[-77.0,34.6],[-78.0,33.9],[-79.2,33.2],[-80.9,32.0],[-81.4,30.7],[-81.3,29.5],[-80.5,28.3],[-80.0,26.8],[-80.1,25.8],[-80.4,25.2],[-81.1,25.1],[-81.8,26.1],[-82.7,27.8],[-82.8,29.0],[-84.0,30.1],[-85.4,29.7],[-86.5,30.4],[-88.0,30.2],[-89.4,30.2],[-89.2,29.0],[-90.2,29.1],[-91.5,29.5],[-93.8,29.7],[-94.8,29.3],[-96.5,28.3],[-97.2,27.6],[-97.4,25.9],[-99.1,26.4],[-99.5,27.5],[-100.4,28.7],[-101.4,29.8],[-102.4,29.8],[-103.1,29.0],[-104.5,29.6],[-106.5,31.8],[-108.2,31.8],[-108.2,31.3],[-111.1,31.3],[-114.8,32.5],[-117.1,32.5],[-118.5,34.0],[-120.6,34.5],[-121.9,36.6],[-122.5,37.8],[-123.7,39.0],[-124.4,40.4],[-124.1,42.0],[-124.5,42.8],[-124.0,44.5],[-123.9,46.2],[-124.1,46.9],[-124.7,48.4]];

export const EVENT_LABELS = {
  h15: 'Minnijean Brown Expelled'
};
