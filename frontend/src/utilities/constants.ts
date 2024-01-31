import chroma from 'chroma-js';

// Phrases for search speed [50 character limit]
export const searchSpeed = {
  fast: [
    'fast',
    'kinda fast',
    'not too slow',
    'you try loading this many courses',
    'not not not fast',
    'faster than Handsome Dan',
    'faster than the doors in HQ',
    'faster than the Silliman elevator',
    'faster than the HY ticket pick-up line',
    'faster than debugging binary bomb',
    'faster than October break',
    'faster than it takes to get to Murray',
  ],
  faster: [
    'faster',
    'really fast',
    'blazing fast',
    'faster than Zoom',
    'not not fast',
  ],
  fastest: [
    'fastest',
    'wicked fast',
    'faster than Usain',
    'faster than Yale One-Day-Breaks',
    'faster than drivers on Elm St',
    'faster than the speed of light',
    'faster than seniors when they see a gut',
    'faster than Higgins on paintball',
    'faster than YPopUp getting reserved',
    "faster than durfee's tenders selling out",
    'faster than sonic the hedgehog',
    'faster than an art-stem double major drops art',
    'faster than switching your major to CS',
    'faster than you can sell out to consulting',
    'faster than HAL',
    'faster than HY tickets selling out',
    'faster than YSO Halloween tickets selling out',
    'faster than the naked run',
  ],
};

export const skillsAreas: {
  [type in 'areas' | 'skills']: { [code: string]: string };
} = {
  areas: {
    Hu: 'Humanities & Arts',
    So: 'Social Sciences',
    Sc: 'Sciences',
  },
  skills: {
    QR: 'Quantitative Reasoning',
    WR: 'Writing',
    L: 'All Language',
    ...Object.fromEntries(
      [1, 2, 3, 4, 5].map((i): [string, string] => [
        `L${i}`,
        `Language Level ${i}`,
      ]),
    ),
  },
};

export const skillsAreasColors: { [code: string]: string } = {
  Hu: '#9970AB',
  So: '#4393C3',
  Sc: '#5AAE61',
  QR: '#CC3311',
  WR: '#EC7014',
  L: '#000000',
  ...Object.fromEntries([1, 2, 3, 4, 5].map((i) => [`L${i}`, '#888888'])),
};

export const ratingColormap = chroma
  .scale(['#f8696b', '#ffeb84', '#63b37b'])
  .domain([1, 5]);
export const workloadColormap = chroma
  .scale(['#63b37b', '#ffeb84', '#f8696b'])
  .domain([1, 5]);

export const credits = [0.5, 1, 1.5, 2];

// https://catalog.yale.edu/ycps/subject-abbreviations/
export const subjects: { [code: string]: string } = {
  ACCT: 'Accounting',
  ADSC: 'Administrative Sciences',
  AFAM: 'African American Studies',
  AFAS: 'African & African-Amer Studies',
  AFKN: 'Afrikaans',
  AFST: 'African Studies',
  AKKD: 'Akkadian',
  AMST: 'American Studies',
  AMTH: 'Applied Mathematics',
  ANES: 'Anesthesiology',
  ANTH: 'Anthropology',
  APHY: 'Applied Physics',
  ARBC: 'Arabic',
  ARCG: 'Archaeological Studies',
  ARCH: 'Architecture',
  ARMN: 'Armenian',
  ART: 'Art',
  ASL: 'American Sign Language',
  ASTR: 'Astronomy',
  'B&BS': 'Biological & Biomedical Sci',
  BENG: 'Biomedical Engineering',
  BIOL: 'Biology',
  BIS: 'Biostatistics',
  BME: 'Biomedical Engineering',
  BNGL: 'Bengali',
  BRST: 'British Studies',
  BURM: 'Burmese',
  'C&MP': 'Cell & Molecular Physiology',
  CAND: 'Prep for Adv to Candidacy',
  'CB&B': 'Comp Biol & Bioinfomatics',
  CBIO: 'Cell Biology',
  CDE: 'Chronic Disease Epidemiology',
  CENG: 'Chemical Engineering',
  CEU: 'Continuing Education Unit',
  CGSC: 'Cognitive Science',
  CHEM: 'Chemistry',
  CHER: 'Cherokee',
  CHLD: 'Child Study',
  CHNS: 'Chinese',
  CLCV: 'Classical Civilization',
  CLSS: 'Classics',
  CPAR: 'Computing and the Arts',
  CPLT: 'Comparative Literature',
  CPMD: 'Comparative Medicine',
  CPSC: 'Computer Science',
  CPTC: 'Coptic',
  CSBF: 'Coll Sem:Ben Franklin Coll',
  CSBK: 'Coll Sem:Berkeley Coll',
  CSBR: 'Coll Sem:Branford Coll',
  CSCC: 'Coll Sem:Calhoun Coll',
  CSDC: 'Coll Sem:Davenport Coll',
  CSEC: 'Computer Science and Economics',
  CSES: 'Coll Sem:Ezra Stiles Coll',
  CSGH: 'Coll Sem:Grace Hopper Coll',
  CSJE: 'Coll Sem:Jonathan Edwards Coll',
  CSMC: 'Coll Sem:Morse Coll',
  CSMY: 'Coll Sem:Pauli Murray Coll',
  CSPC: 'Coll Sem:Pierson Coll',
  CSSM: 'Coll Sem:Silliman Coll',
  CSSY: 'Coll Sem:Saybrook Coll',
  CSTC: 'Coll Sem:Trumbull Coll',
  CSTD: 'Coll Sem:Timothy Dwight Coll',
  CSYC: 'Coll Sem: Yale Coll',
  CTLN: 'Catalan',
  CZEC: 'Czech',
  DERM: 'Dermatology',
  DEVN: 'The DeVane Lecture Course',
  DIAG: 'Diagnostic Radiology',
  DIR: 'DIrecting',
  DISA: 'Diss Research',
  DISR: 'Diss Research',
  DRAM: 'Drama',
  DRMA: 'Drama Summer',
  DRST: 'Directed Studies',
  DUTC: 'Dutch',
  'E&EB': 'Ecology & Evolutionary Biology',
  'E&RS': 'European & Russian Studies',
  EALL: 'East Asian Lang and Lit',
  EAST: 'East Asian Studies',
  ECON: 'Economics',
  EDST: 'Education Studies',
  EECS: 'Elec Eng & Comp Sci',
  EENG: 'Electrical Engineering',
  EGYP: 'Egyptology',
  EHS: 'Environmental Health Sciences',
  EID: 'Epidemiology Infectious Diseas',
  ELP: 'English Language Program',
  EMD: 'Epidemiology Microbial Disease',
  EMST: 'Early Modern Studies',
  ENAS: 'Engineering & Applied Science',
  ENGL: 'English',
  ENHS: 'Environmental Health Sciences',
  ENRG: 'Energy Studies',
  ENV: 'Environment',
  ENVE: 'Environmental Engineering',
  'EP&E': 'Ethics, Politics, & Economics',
  EPH: 'Epidemiology & Public Health',
  EPS: 'Earth and Planetary Sciences',
  'ER&M': 'Ethnicity, Race, & Migration',
  ESL: 'English as a Second Language',
  EVST: 'Environmental Studies',
  EXPA: 'Experimental Pathology',
  EXCH: 'Exchange Scholar Experience',
  'F&ES': 'Forestry & Environment Studies',
  FILM: 'Film & Media Studies',
  FNSH: 'Finnish',
  FREN: 'French',
  'G&G': 'Geology and Geophysics',
  GENE: 'Genetics',
  GHD: 'Global Health',
  GLBL: 'Global Affairs',
  GMAN: 'German',
  GMIC: 'Germanic',
  GMST: 'German Studies',
  GRAN: 'Gross Anatomy',
  GREK: 'Ancient Greek',
  GSAS: 'Graduate School',
  HAUS: 'Hausa',
  HEBR: 'Modern Hebrew',
  HGRN: 'Hungarian',
  HIST: 'History',
  HLTH: 'Health Studies',
  'HM&S': 'History of Medicine & Science',
  HMRT: 'Human Rights',
  HNDI: 'Hindi',
  HPA: 'Health Policy Administration',
  HPM: 'Health Policy and Management',
  HPR: 'Health Policy Resources & Adm',
  HSAR: 'History of Art',
  HSHM: 'Hist of Science, Hist of Med',
  HSMD: 'History of Medicine',
  HSPL: 'History & Politics',
  HUMS: 'Humanities',
  IBIO: 'Immunobiology',
  IDRS: 'Independent Research in the Summer',
  IHD: 'International Health',
  IMED: 'Investigative Medicine',
  IND: 'IndoEuropean',
  INDC: 'Indic',
  INDN: 'Indonesian',
  INMD: 'Internal Medicine',
  INP: 'Interdpt Neuroscience Pgm',
  INRL: 'International Relations',
  INTL: 'International',
  INTS: 'International Studies',
  IRAN: 'Iranian',
  IRES: 'Independent Research',
  ITAL: 'Italian',
  JAPN: 'Japanese',
  JDST: 'Judaic Studies',
  KHMR: 'Khmer',
  KREN: 'Korean',
  LAST: 'Latin American Studies',
  LATN: 'Latin',
  LAW: 'Law',
  LBMD: 'Laboratory Medicine',
  LING: 'Linguistics',
  LITR: 'Literature',
  LUCE: 'The Henry Luce Course',
  MATH: 'Mathematics',
  'MB&B': 'Molecular Biophysics & Biochem',
  MBIO: 'Microbiology',
  MCDB: 'Molecular, Cellular & Dev Biol',
  MD: 'MD Program',
  MDVL: 'Medieval Studies',
  MED: 'Master of Environmental Design',
  MEDC: 'Courses in School of Medicine',
  MEDR: 'Clinical Clerkships',
  MENG: 'Mechanical Engineering',
  MESO: 'Mesopotamia',
  MGMT: 'Management',
  MGRK: 'Modern Greek',
  MGT: 'School of Management',
  MHHR: 'Material Histories of the Human Record',
  MIC: 'Microbiology',
  MMES: 'Modern Middle East Studies',
  MRES: "Master's Thesis Research",
  MTBT: 'Modern Tibetan',
  MUS: 'School of Music',
  MUSI: 'Music Department',
  NAVY: 'Naval Science',
  NBIO: 'Neurobiology',
  NELC: 'Near Eastern Langs & Civs',
  NHTL: 'Nahuatl',
  NPLI: 'Nepali',
  NRLG: 'Neurology',
  NSCI: 'Neuroscience',
  NURS: 'Nursing',
  OBGN: 'Obstetrics/Gynecology',
  OBIO: 'Organismal Biology',
  OLPA: 'Online Physician Assistant Pgm',
  OPRH: 'Orthopaedics & Rehabilitation',
  OPRS: 'Operations Research',
  OPVS: 'Ophthalmology & Visual Science',
  ORMS: 'Operations Res/Mgmt Science',
  OTTM: 'Ottoman',
  PA: 'Physician Associate Program',
  PATH: 'Pathology',
  PEDT: 'Pediatrics',
  PERS: 'Persian',
  PHAR: 'Pharmacology',
  PHIL: 'Philosophy',
  PHUM: 'Public Humanities',
  PHYS: 'Physics',
  PIH: 'Program International Health',
  PLSC: 'Political Science',
  PLSH: 'Polish',
  PNJB: 'Punjabi',
  PORT: 'Portuguese',
  PPM: 'Public & Private Management',
  PRAC: 'Practicum Analysis',
  PSYC: 'Psychology',
  PSYT: 'Psychiatry',
  PTB: 'Program in Translational Biomedicine',
  QUAL: 'Preparing for Qualifying Exams',
  QUAN: 'Quantitative Reasoning',
  REL: 'Religion',
  RLST: 'Religious Studies',
  RNST: 'Renaissance Studies',
  ROMN: 'Romanian',
  RSEE: 'Russian & East Europe Studies',
  RUSS: 'Russian',
  'S&DS': 'Statistics and Data Science',
  SAST: 'South Asian Studies',
  SBCR: 'Serbian & Croatian',
  SBS: 'Social and Behavioral Sciences',
  SCAN: 'Scandinavian',
  SCIE: 'Science',
  SKRT: 'Sanskrit',
  SLAV: 'Slavic',
  SMTC: 'Semitic',
  SNHL: 'Sinhala',
  SOCY: 'Sociology',
  SPAN: 'Spanish',
  SPEC: 'Special Divisional Major',
  SPTC: 'Special Term Course',
  STAT: 'Statistics',
  STCY: 'Study of the City',
  STEV: 'Studies in the Environment',
  STRT: 'Start Program',
  SUMR: 'Summer Program',
  SURG: 'Surgery',
  SWAH: 'Kiswahili',
  SWED: 'Swedish',
  TAML: 'Tamil',
  TBTN: 'Tibetan',
  THST: 'Theater Studies',
  TKSH: 'Turkish',
  TPRP: 'Teacher Preparation',
  TRAD: 'Therapeutic Radiology',
  TWI: 'Twi',
  UKRN: 'Ukrainian',
  URBN: 'Urban Studies',
  URDU: 'Heritage Urdu',
  USAF: 'Aerospace Studies',
  VAIR: 'Visiting Assistant in Research',
  VIET: 'Vietnamese',
  WGSS: "Women'sGender&SexualityStudies",
  WGST: "Women's & Gender Studies",
  WHIT: 'Whitney Seminar',
  WLOF: 'Wolof',
  WMST: "Women's Studies",
  YDSH: 'Yiddish',
  YORU: 'Yoruba',
  YPKU: 'PKU: Direct Enrollment',
  YSM: 'Yale School of Medicine',
  ZULU: 'Zulu',
};

// To get a list of abbreviations, run
// a distinct_on:school query over computed_course_info
// School labels were filled in manually
export const schools: { [code: string]: string } = {
  YC: 'Yale College',
  AC: 'School of Architecture',
  AT: 'School of Fine Arts',
  GS: 'Graduate School of Arts and Sciences',
  DI: 'Divinity School',
  DR: 'School of Drama',
  FS: 'School of the Environment',
  LW: 'Law School',
  MD: 'School of Medicine',
  MG: 'School of Management',
  MU: 'School of Music',
  NR: 'School of Nursing',
  PA: 'Physician Associate Program',
  PH: 'School of Public Health',
  SU: 'Summer Session',
};

export const evalQuestions = {
  assessment: {
    question: 'What is your overall assessment of this course?',
    labels: ['poor', 'fair', 'good', 'very good', 'excellent'],
    title: 'Overall',
  },
  workload: {
    question:
      'Relative to other courses you have taken at Yale, the workload of this course was:',
    labels: ['much less', 'less', 'same', 'greater', 'much greater'],
    title: 'Workload',
  },
  engagement: {
    question: 'Your level of engagement with the course was:',
    labels: ['very low', 'low', 'medium', 'high', 'very high'],
    title: 'Engagement',
  },
  organized: {
    question: 'The course was well organized to facilitate student learning.',
    labels: [
      'strongly disagree',
      'disagree',
      'neutral',
      'agree',
      'strongly agree',
    ],
    title: 'Organization',
  },
  feedback: {
    question: 'I received clear feedback that improved my learning.',
    labels: [
      'strongly disagree',
      'disagree',
      'neutral',
      'agree',
      'strongly agree',
    ],
    title: 'Feedback Clarity',
  },
  challenge: {
    question:
      'Relative to other courses you have taken at Yale, the level of intellectual challenge of this course was:',
    labels: ['much less', 'less', 'same', 'greater', 'much greater'],
    title: 'Intellectual Challenge',
  },
};

export const worksheetColors = [
  '#6cc26f',
  '#ca5f53',
  '#31a4d4',
  '#df8653',
  '#26ba9a',
  '#ba7881',
];
