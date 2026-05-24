/* Shared mock data: personas, experts, BP readings, notifications, care plans */

const PERSONAS = {
  maria: {
    id: 'maria',
    name: 'Maria',
    stageLabel: 'Pregnant',
    stageDetail: 'Week 34',
    stageLong: 'You\u2019re 34 weeks pregnant.',
    weeks: 34,
    riskFactors: ['Gestational hypertension'],
    demoMode: 'acute',
    nextVisit: {
      when: 'Tomorrow 9:00 AM',
      clinician: 'Dr. Patel',
      kind: '34 week growth scan',
      visitType: 'In person',
      location: 'Huntington-Hill Maternity Center \u00B7 Pasadena',
    },
  },
  jane: {
    id: 'jane',
    name: 'Jane',
    stageLabel: 'Postpartum',
    stageDetail: 'Month 3',
    stageLong: 'Lila is 3 months old.',
    weeks: 12,
    riskFactors: [],
    demoMode: 'mental-health',
    lastSeenDays: 4,
    nextVisit: {
      when: 'Thu 3:30 PM',
      clinician: 'Dr. Patel',
      kind: '3 month wellness check',
      visitType: 'Online',
      location: 'Telehealth \u00B7 Cocuna video',
    },
  },
};

/* Urgent care site separate from clinic */
const URGENT_SITES = {
  hospital: {
    name: 'Huntington Hospital ER',
    detail: 'Labor & Delivery triage \u00B7 24/7',
    address: '100 W California Blvd, Pasadena',
    distance: '2.3 mi \u00B7 9 min drive',
    phone: '(626) 397-5000',
  },
};

const CLINIC = {
  name: 'Huntington-Hill Maternity Center',
  area: 'Pasadena, CA',
  near: '4 minute drive from Caltech',
  address: '1245 E California Blvd, Pasadena',
};

const EXPERTS = [
  {
    id: 'patel',
    initials: 'SP',
    name: 'Dr. Sarah Patel',
    cred: 'OB GYN \u00B7 MD, FACOG',
    pronoun: 'she/her',
    photo: 'doctor-patel.png',
    online: true,
    responds: 'usually replies in 12 min',
    color: 'lavender',
    bio: 'Your primary OB. High risk pregnancy and postpartum specialist at Huntington-Hill Maternity Center.',
  },
  {
    id: 'okafor',
    initials: 'NO',
    name: 'Naomi Okafor',
    cred: 'IBCLC \u00B7 Lactation Consultant',
    pronoun: 'she/her',
    photo: 'doctor-okafor.png',
    online: true,
    responds: 'usually replies in 5 min',
    color: 'mint',
    bio: 'Board-certified lactation consultant. Async messaging and 1:1 video on request.',
  },
  {
    id: 'ruiz',
    initials: 'AR',
    name: 'Dr. Ana Ruiz',
    cred: 'Perinatal Psychologist \u00B7 PhD',
    pronoun: 'she/her',
    photo: 'doctor-ruiz.png',
    online: false,
    responds: 'usually replies in 1 hr',
    color: 'peach',
    bio: 'PMH-C certified. EPDS screening, brief CBT, escalation pathways.',
  },
  {
    id: 'kim',
    initials: 'JK',
    name: 'Jane Kim, RN',
    cred: 'Paediatric Nurse \u00B7 RN',
    pronoun: 'she/her',
    photo: 'doctor-kim.png',
    online: true,
    responds: 'usually replies in 8 min',
    color: 'butter',
    bio: 'Neonatal & infant care nurse. First fever, feeding, and newborn assessment.',
  },
];

const NOTIFICATIONS = [
  {
    id: 'n1', time: '8:14 AM', triage: 'red',
    title: 'Take a moment to read this',
    body: 'Your last reading 158/102 is severe. We\u2019ve drafted a message to Dr. Patel for you. Open chat to send.',
    source: 'ACOG Postpartum Preeclampsia \u00B7 2025',
    cta: 'Open chat',
  },
  {
    id: 'n2', time: 'Yesterday', triage: 'green',
    title: 'Twelve days of recording, quietly',
    body: 'Your evening readings have come down by an average of 7 points this week.',
  },
  {
    id: 'n3', time: 'Mon', triage: 'yellow',
    title: 'Naomi checked in about feeding',
    body: '"Good supply, latch looks healthy in the video you sent. Let me know if pain returns."',
    expert: 'okafor',
  },
  {
    id: 'n4', time: 'Sun', triage: 'gray',
    title: 'Check in skipped',
    body: 'No pressure. We\u2019ll ask again tomorrow. You can also fill it in any time.',
  },
];

const BP_READINGS = [
  { date: 'Today, 8:02 AM',     sys: 158, dia: 102, triage: 'red',    note: 'Headache, vision spots reported.' },
  { date: 'Yesterday, 9:14 PM', sys: 142, dia: 94,  triage: 'orange', note: '' },
  { date: 'Yesterday, 8:30 AM', sys: 138, dia: 89,  triage: 'orange', note: '' },
  { date: 'Mon, 9:05 PM',       sys: 134, dia: 86,  triage: 'yellow', note: '' },
  { date: 'Mon, 8:48 AM',       sys: 129, dia: 83,  triage: 'yellow', note: '' },
  { date: 'Sun, 9:20 PM',       sys: 126, dia: 81,  triage: 'green',  note: '' },
  { date: 'Sun, 8:36 AM',       sys: 122, dia: 79,  triage: 'green',  note: 'Felt steady.' },
];

const CHAT_INIT = [
  { who: 'hera', text: 'Hello. Tell me what is happening. I\u2019m here to take care of you.' },
];

const QUICK_STARTS = [
  'My blood pressure is high',
  'I have a headache',
  'I\u2019m feeling overwhelmed',
  'Question about feeding',
];

const RESULT_PAYLOAD = {
  triage: 'red',
  level: 'Urgent',
  protocol: 'ACOG Severe Hypertension in Pregnancy',
  headline: 'Go to urgent care now',
  reason: 'Severe hypertension 158/102 with headache and visual symptoms at 34 weeks is consistent with severe pre-eclampsia. Emergency evaluation is needed.',
  actions: [
    'We\u2019ve called you a ride to Huntington Hospital ER',
    'Do not drive yourself',
    'Bring this conversation and your BP log',
  ],
  flags: ['Pregnant, week 34', 'BP 158/102', 'Headache', 'Visual spots'],
  expert: 'patel',
  notifiedClinic: true,
  sources: [
    { label: 'ACOG Severe Hypertension in Pregnancy', year: '2025' },
    { label: 'AHA Maternal Hypertension Review', year: '2025' },
  ],
  urgentSite: 'hospital',
  privacy: {
    sharedWith: [
      { name: 'Huntington Hospital ER', detail: 'L&D triage receiving you', items: ['Your name & DOB', 'BP reading', 'Symptoms', 'Estimated arrival'] },
      { name: 'Dr. Sarah Patel (your clinic)', detail: 'Notified to follow up', items: ['BP reading', 'Symptoms', 'Triage outcome'] },
    ],
    notShared: ['Your chat with Hera (full transcript)', 'Mood history', 'Companion activity'],
  },
};

/* Jane mental health result */
const MH_RESULT_PAYLOAD = {
  triage: 'yellow',
  level: 'Support',
  protocol: 'EPDS \u00B7 ACOG Perinatal Depression Screening',
  headline: 'Let\u2019s find someone to talk to',
  reason: 'You\u2019ve described low mood, low energy, and trouble sleeping for more than two weeks. EPDS estimate suggests moderate depressive symptoms. This is common, and treatable.',
  actions: [
    'Connect with Dr. Ana Ruiz, perinatal psychologist',
    'She is online now and can talk within minutes',
    'You decide what we share, and with whom',
  ],
  flags: ['Postpartum month 3', 'EPDS \u2248 13/30', 'Sleep \u2193', 'Mood \u2193 7 days'],
  expert: 'ruiz',
  sources: [
    { label: 'ACOG Perinatal Mental Health Screening', year: '2023' },
    { label: 'EPDS Cox JL et al', year: '1987 (re-validated 2024)' },
  ],
  privacy: {
    sharedWith: [
      { name: 'Dr. Ana Ruiz (perinatal psych)', detail: 'Only if you say yes', items: ['Your name', 'Brief summary of how you feel', 'Mood trend chart'] },
      { name: 'Dr. Sarah Patel (your clinic)', detail: 'Soft check-in flag only', items: ['That you might appreciate extra support', 'Date the flag was raised'] },
    ],
    notShared: ['Your chat with Hera', 'Specific things you said', 'EPDS answers verbatim'],
  },
};

/* Persona-specific care plans */
const CARE_PLANS = {
  maria: {
    today: [
      { title: 'Count kicks after lunch',    body: 'Settle on your left side, count baby\u2019s movements for 10 minutes. Aim for 10+.', icon: 'foot', accent: 'rose' },
      { title: 'Pelvic floor breath \u00B7 3 min', body: 'Slow exhale, lift gently from below. We\u2019ll guide you.', icon: 'breath', accent: 'lavender' },
      { title: 'Hydrate \u00B7 about 2.3L',  body: 'Sip steadily. Add a pinch of salt if you feel lightheaded.', icon: 'drop', accent: 'mint' },
    ],
    warnings: [
      'Severe or persistent headache',
      'Vision changes (spots, blurriness, light sensitivity)',
      'Sudden swelling in face or hands',
      'Reduced fetal movement (less than 10 kicks in 2 hours)',
      'Vaginal bleeding or fluid leak',
    ],
    sources: ['ACOG Pregnancy Care 2024', 'AHA Maternal Hypertension Review 2025'],
  },
  jane: {
    today: [
      { title: 'Tummy time with Lila \u00B7 10 min', body: 'Three short sessions. Strong neck builds well between months 3 and 4.', icon: 'baby', accent: 'mint' },
      { title: 'Pelvic floor restore \u00B7 5 min',   body: 'Standing breath and gentle Kegel cycle. Build slowly.', icon: 'breath', accent: 'lavender' },
      { title: 'Get outside light before noon',      body: '15 minutes of morning sun helps Lila\u2019s sleep and yours.', icon: 'sun', accent: 'butter' },
    ],
    warnings: [
      'Fever above 100.4F in baby under 4 months',
      'Heavy bleeding (soaking a pad an hour)',
      'Severe headache or vision changes',
      'Thoughts of harming yourself or your baby',
      'Persistent sadness for more than 2 weeks',
    ],
    sources: ['AAP Bright Futures 2024', 'ACOG Postpartum Care 2018 (reaffirmed 2025)'],
  },
};

const COMPANION_LOG = [
  { date: 'Today',     entries: ['Logged twice', 'Checked in steady'] },
  { date: 'Yesterday', entries: ['Three minute breath', 'Reached out to Naomi about feeding'] },
  { date: 'Mon',       entries: ['Trending down', 'Mood: Good'] },
  { date: 'Sun',       entries: ['Slept 6h 40m', 'Mood: Good'] },
];

/* Companion meditation library */
const COMPANION_CATEGORIES = [
  { id: 'breathe',  label: 'Breathe',  count: 8,  color: 'lavender', icon: 'breath' },
  { id: 'meditate', label: 'Meditate', count: 14, color: 'mint',     icon: 'lotus'  },
  { id: 'yoga',     label: 'Yoga',     count: 22, color: 'peach',    icon: 'yoga'   },
  { id: 'journal',  label: 'Journal',  count: 6,  color: 'butter',   icon: 'pen'    },
  { id: 'stories',  label: 'Stories',  count: 11, color: 'rose',     icon: 'moon'   },
  { id: 'circle',   label: 'Circle',   count: 4,  color: 'lavender', icon: 'hands'  },
];

/* Yoga clips library, persona aware */
const YOGA_CLIPS = {
  maria: [
    { id: 'y1', title: 'Third trimester hips opener', min: 8,  level: 'Gentle', teacher: 'Priya, RYT 500', tag: 'For week 34', triage: 'green' },
    { id: 'y2', title: 'Lower back relief lying side', min: 5, level: 'Restorative', teacher: 'Priya, RYT 500', tag: 'For week 34', triage: 'green' },
    { id: 'y3', title: 'Pelvic tilts on the wall', min: 6, level: 'Gentle', teacher: 'Mei, Prenatal Yoga Center', tag: 'For week 34', triage: 'green' },
    { id: 'y4', title: 'Cat cow with breath', min: 4, level: 'Gentle', teacher: 'Priya, RYT 500', tag: 'For week 34', triage: 'green' },
    { id: 'y5', title: 'Birth prep squat hold', min: 10, level: 'Active', teacher: 'Sasha, Doula', tag: 'For week 34+', triage: 'green' },
    { id: 'y6', title: 'Anxiety release exhale', min: 6, level: 'Restorative', teacher: 'Priya, RYT 500', tag: 'For week 34', triage: 'green' },
  ],
  jane: [
    { id: 'y1', title: 'Postpartum pelvic floor restore', min: 8, level: 'Gentle', teacher: 'Priya, RYT 500', tag: 'For month 3', triage: 'green' },
    { id: 'y2', title: 'Diastasis safe core flow',        min: 10, level: 'Gentle', teacher: 'Mei, Postnatal Yoga', tag: 'For month 3', triage: 'green' },
    { id: 'y3', title: 'Carry-baby shoulder release',     min: 6,  level: 'Restorative', teacher: 'Sasha, Doula', tag: 'For month 3', triage: 'green' },
    { id: 'y4', title: 'Hip openers with baby nearby',    min: 7,  level: 'Gentle', teacher: 'Priya, RYT 500', tag: 'For month 3', triage: 'green' },
    { id: 'y5', title: 'Rebuild back strength',           min: 12, level: 'Active', teacher: 'Mei, Postnatal Yoga', tag: 'For month 3+', triage: 'green' },
    { id: 'y6', title: 'Evening wind-down stretch',       min: 8,  level: 'Restorative', teacher: 'Priya, RYT 500', tag: 'For any month', triage: 'green' },
  ],
};

/* Today's companion invitation, persona aware */
const TODAY_INVITATIONS = {
  maria: {
    eyebrow: 'A small offering, for week 34',
    title: 'Five slow breaths,\nfor your hips.',
    body: 'Pelvic floor breath. Eight minutes. Headphones if you have them.',
    minutes: 8,
    icon: 'breath',
  },
  jane: {
    eyebrow: 'A small offering, for month 3',
    title: 'Restore your back,\nbetween feeds.',
    body: 'Gentle shoulder and back release. Six minutes. Hold Lila if you like.',
    minutes: 6,
    icon: 'yoga',
  },
};

const NEARBY_MOTHERS = [
  { name: 'Aanya',    detail: 'Postpartum, month 2 \u00B7 2.1 km',     online: true },
  { name: 'Chloe',    detail: 'Pregnant, week 32 \u00B7 3.4 km',       online: true },
  { name: 'Rosalind', detail: 'Postpartum, month 4 \u00B7 5.0 km',     online: false },
];

/* Jane 7-day mood trend (declining) */
const JANE_MOOD_TREND = [
  { day: 'Mon', mood: 3, energy: 3, logged: true  },
  { day: 'Tue', mood: 3, energy: 2, logged: true  },
  { day: 'Wed', mood: 2, energy: 2, logged: true  },
  { day: 'Thu', mood: null, energy: null, logged: false },
  { day: 'Fri', mood: null, energy: null, logged: false },
  { day: 'Sat', mood: null, energy: null, logged: false },
  { day: 'Sun', mood: 1, energy: 1, logged: true,  note: 'Heard from Jane today.' },
];

window.COCUNA_DATA = {
  PERSONAS, CLINIC, URGENT_SITES, EXPERTS, NOTIFICATIONS, BP_READINGS,
  CHAT_INIT, QUICK_STARTS, RESULT_PAYLOAD, MH_RESULT_PAYLOAD,
  CARE_PLANS, COMPANION_LOG,
  COMPANION_CATEGORIES, YOGA_CLIPS, TODAY_INVITATIONS, NEARBY_MOTHERS,
  JANE_MOOD_TREND,
};
