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
  .scale(['#63b37b', '#ffeb84', '#f8696b'])
  .domain([1, 5]);
export const workloadColormap = chroma
  .scale(['#f8696b', '#ffeb84', '#63b37b'])
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
  CSLI: 'Computing and Linguistics',
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

// TODO: dynamically generate this like seasons.json
export const courseInfoAttributes = [
  'DI: Area I',
  'DI: Area II',
  'DI: Area III',
  'DI: Area IV',
  'DI: Area V',
  'DI: BRAD',
  'DI: Diversity',
  'DI: Ethics',
  'DI: Hebrew Bible',
  'DI: Homiletics',
  'DI: Latin(x) Am Christianity',
  'DI: New Testament',
  'DI: Non-Christian Religions',
  'DI: Theology',
  'DI: WGSS',
  'GB: Core',
  'GB: Cross-School Cross-Listed',
  'GB: Elective',
  'GB: Half-Term Course (First)',
  'GB: Half-Term Course (Second)',
  'GB: Prog. Eval. Cert.',
  'GB: SAT-UNSAT',
  'GB: Sub GLBL 5020',
  'GS HIST: Ancient',
  'GS HIST: Early Modern',
  'GS HIST: Medieval',
  'GS HIST: Modern',
  'Hybrid; in-person & remote',
  'NU: Adult Gero Acute Care',
  'NU: Adult Gero Primary Care',
  'NU: DNP Clinical track',
  'NU: DNP Leadership track',
  'NU: Dual Spec, Midwifery WH',
  'NU: Family Nurse Practitioner',
  'NU: GEPN, pre-spec in nursing',
  'NU: Nurse Midwifery',
  'NU: Pediatric NP Acute Care',
  'NU: Pediatric NP Primary Care',
  'NU: Psych Mental Hlth Spec',
  "NU: Women's Health",
  'PH: Climate Change and Health',
  'PH: Global Health, Biomedicine',
  'PH: Global Health, Development/Political Economy',
  'PH: Global Health, Epidemiology',
  'PH: Global Health, Ethics/Humanities/History',
  'PH: Global Health, Implementation Science',
  'PH: Global Health, Psychosocial/Social and behavioral/Anthropology',
  'PH: Public Health Modeling',
  'Taught in-person',
  'Taught remotely',
  'YC AMST: Cultural Hist/Studies',
  'YC AMST: Early Americas',
  'YC AMST: First-Year Sem',
  'YC AMST: Gateway Courses',
  'YC AMST: Junior Seminars',
  'YC AMST: Senior Seminars',
  'YC AMST: Special&Sr Projects',
  'YC AMST: Survey of Am Lit',
  'YC Anthropology: Archaeology',
  'YC Anthropology: Biological',
  'YC Anthropology: Linguistic',
  'YC Anthropology: Sociocultural',
  'YC ARCG: Advanced Lab',
  'YC ARCG: Intro Survey',
  'YC ARCG: Theory',
  'YC ARCH: History & Theory',
  'YC ARCH: Materials & Design',
  'YC ARCH: Structures & Computation',
  'YC ARCH: Urbanism & Landscape',
  'YC ASTR: Sci/Math Elective BA',
  'YC CHEM: Advanced Courses',
  'YC CHEM: GR of Interest to UG',
  'YC CHEM: Intermediate Courses',
  'YC CHEM: Introductory Courses',
  'YC CHEM: Nonmajor w/o Prereq',
  'YC Climate Science: Anthropogenic',
  'YC Climate Science: Basic',
  'YC Climate Science: Elective',
  'YC Climate Science: Solutions',
  'YC Climate: Sci/Eng/Tech',
  'YC CLSS: Ancient Hist Greece',
  'YC CLSS: Ancient Hist Rome',
  'YC CLSS: Hist, Phil, Art, Arcg',
  'YC CLSS: Lit/Cult Anc Greece',
  'YC CLSS: Lit/Cult Anc Rome',
  'YC Cognitive Sci: Skills',
  'YC Courses Offered After Registration Closed',
  'YC CPLI: Elective in CP & Ling',
  'YC CPLT: 17th-18th centuries',
  'YC CPLT: Antiquity',
  'YC CPLT: Early Modern',
  'YC CPLT: FILM',
  'YC CPLT: Medieval',
  'YC CPLT: the Modern period (1800–present)',
  'YC CPLT: Theory',
  'YC CPLT: Translation Studies',
  'YC CPSC&MATH Adv CS Elective',
  'YC CPSC: Elective',
  'YC CSEC: Elective not CS or EC',
  'YC CSEC: Electv intrsctn CS/EC',
  'YC E&EB: BS Elective',
  'YC E&EB: Intermdiate/Advanced',
  'YC E&EB: Introductory Courses',
  'YC E&EB: Organismal Lec/Labs',
  'YC E&EB: Prereq Option',
  'YC ECON: Core',
  'YC ECON: Development',
  'YC ECON: EconData',
  'YC ECON: Education',
  'YC ECON: Environment',
  'YC ECON: Finance',
  'YC ECON: Health',
  'YC ECON: History',
  'YC ECON: Industrial Organization',
  'YC ECON: International Relations',
  'YC ECON: Introductory',
  'YC ECON: Labor',
  'YC ECON: Law',
  'YC ECON: Macroeconomics',
  'YC ECON: Methodology',
  'YC ECON: Microtheory',
  'YC ECON: Neuro',
  'YC ECON: Political Economy',
  'YC ECON: Poverty',
  'YC ECON: Public',
  'YC EDST: Indv Society',
  'YC EDST: Social Context',
  'YC English: 18th/19th Century',
  'YC English: 20th/21st Century',
  'YC English: Creative Writing',
  'YC English: Junior Seminar',
  'YC English: Medieval',
  'YC English: Renaissance',
  'YC English: Senior Seminar',
  'YC ENRG: Energy & Environment',
  'YC ENRG: Energy & Society',
  'YC ENRG: Energy Science & Tech',
  'YC EP&E Economics Core',
  'YC EP&E Ethics Core',
  'YC EP&E Intro Econometrics',
  'YC EP&E Intro Game Theory',
  'YC EP&E Intro Microeconomics',
  'YC EP&E Politics Core',
  'YC EP&E: Advanced Seminar',
  'YC EP&E: Intro Ethics',
  'YC EP&E: Intro Political Phil',
  'YC ER&M: Elect within the Major',
  'YC ER&M: Methods Course',
  'YC ER&M: Required Courses',
  'YC ER&M: Research & Sr Essay',
  'YC Ethnography: Elective',
  'YC Ethnography: Methods',
  'YC EVST B.S. NatSci Lab',
  'YC EVST: Advanced Seminar',
  'YC EVST: Core BA Natural Scie',
  'YC EVST: Core BS Natural Scie',
  'YC EVST: Core Human/Social Sci',
  'YC FILM: Critical Studies',
  'YC FILM: Production',
  'YC FILM: World Cinema',
  'YC FREN: Pre-1800',
  'YC FREN: Taught in English',
  'YC FREN: Taught in French',
  'YC GLBL: 121 Alternative Crse',
  'YC GLBL: Addtl Methods Course',
  'YC GLBL: Elective',
  'YC GLHTH: Bio & Env Influences',
  'YC GLHTH: Health & Societies',
  'YC GLHTH: Hist Approaches',
  'YC GLHTH: Perf, Rep & Health',
  'YC GLHTH: Polit Econ & Govern',
  'YC GLHTH: Quantitative Data',
  'YC GMAN: Aesthetics & Arts',
  'YC GMAN: Critical Thought',
  'YC GMAN: History & Politics',
  'YC GMAN: Literature',
  'YC GMAN: Media & Media Theory',
  'YC HIST: Africa',
  'YC HIST: Asia',
  'YC HIST: Cultural History',
  'YC HIST: Departmental Seminars',
  'YC HIST: Empires & Colonialism',
  'YC HIST: Environmental History',
  'YC HIST: Europe',
  'YC HIST: First-Year Seminars',
  'YC HIST: Ideas & Intellectuals',
  'YC HIST: Intl & Diplomat Hist',
  'YC HIST: Latin America',
  'YC HIST: Lecture Courses',
  'YC HIST: Middle East',
  'YC HIST: Pltcs, Law & Govt',
  'YC HIST: Race Gender & Sexuality',
  'YC HIST: Religion in Context',
  'YC HIST: Sci, Tech, & Medicine',
  'YC HIST: Senior Essay',
  'YC HIST: Soc Chng & Social MVMN',
  'YC HIST: The World Economy',
  'YC HIST: United States',
  'YC HIST: War & Society',
  'YC HIST: World',
  'YC HIST: Writing Tutorial',
  'YC HistofArt: 1500-1800',
  'YC HistofArt: 800-1500',
  'YC HistofArt: Africa & Pacific',
  'YC HistofArt: Asia/Near East',
  'YC HistofArt: Europe',
  'YC HistofArt: Post-1800',
  'YC HistofArt: Pre-800',
  'YC HistofArt: The Americas',
  'YC HistofArt: Transchron',
  'YC HistofArt: Transregional',
  'YC History: Preindustrial',
  'YC HSHM: Colonial Know & Power',
  'YC HSHM: Environ & Society',
  'YC HSHM: Gender, Reprod and Body',
  'YC HSHM: Global Health',
  'YC HSHM: Med & Public Health',
  'YC HSHM: Media Info & Public',
  'YC HSHM: Minds and Brains',
  'YC HSHM: Sci, Tech & Society',
  'YC HUMS: Interpretations',
  'YC HUMS: Modernities',
  'YC ISLM: Islamic Art, Arch, Lit',
  'YC ISLM: Islamic History',
  'YC ISLM: Islamic Religion',
  'YC ISLM: Islamic Society',
  'YC ITAL: Taught in English',
  'YC ITAL: Taught in Italian',
  'YC LING Brdth: Comp Ling',
  'YC LING Brdth: Historical Ling',
  'YC LING Brdth: Lang&Mind/Brain',
  'YC LING Brdth: Semntcs/Pragmat',
  'YC LING Breadth: Morphology',
  'YC LING Breadth: Phonetics',
  'YC LING Depth: Comp Linguistic',
  'YC LING Depth: Historical Ling',
  'YC LING Depth: Lang&Mind/Brain',
  'YC LING Depth: Morphology',
  'YC LING Depth: Phonetics',
  'YC LING Depth: Phonology',
  'YC LING Depth: Semntcs/Pragmat',
  'YC LING Depth: Syntax',
  'YC LING: Adv Courses/Seminars',
  'YC LING: American Sign Courses',
  'YC LING: Breadth',
  'YC LING: Depth',
  'YC LING: Elective',
  'YC LING: Intermediate Courses',
  'YC LING: Introductory Courses',
  'YC LING: Res Courses/Sr Essay',
  'YC MA&PHL: add crse w/log comp',
  'YC Math: Algebra/Number Theory',
  'YC Math: Core Complex Analysis',
  'YC Math: Core Real Analysis',
  'YC Math: Geometry/Topology',
  'YC Math: Logic/Foundations',
  'YC Math: Stat/Applied Math',
  'YC Mathematics: Analysis',
  'YC Mathematics: Core Algebra',
  'YC MDVL: East & SE Asia',
  'YC MDVL: Eur Russ & N Atlantic',
  'YC MDVL: Nr East & N Africa',
  'YC MDVL: S & Central Asia',
  'YC MENG: BS Technical Elective',
  'YC MENG: Eng Sci-Mech Crse',
  'YC MMES Survey Course',
  'YC MMES: Adv Seminar',
  'YC MMES: Distribution Crse',
  'YC Music: Advanced Grp I',
  'YC Music: Advanced Grp III',
  'YC Music: Advanced Grp IV',
  'YC Music: Intermediate Grp I',
  'YC Music: Intermediate Grp II',
  'YC Music: Intermediate Grp III',
  'YC Music: Intermediate Grp IV',
  'YC NELC: Foundations Course',
  'YC Not Taught In Target Language',
  'YC NSCI: Basic Allied Core',
  'YC NSCI: Computational',
  'YC NSCI: Molecular/Cell/Biol',
  'YC NSCI: Neuroscience Lab',
  'YC NSCI: Other Allied',
  'YC NSCI: Quantitative',
  'YC NSCI: Statistics Prereq',
  'YC NSCI: Systems/Circuit/Behav',
  'YC Phil: Ethics & Value Theory',
  'YC Phil: History of Philosophy',
  'YC Phil: Intersctn PSYC/PHIL',
  'YC Phil: Logic',
  'YC Phil: Metaphysics & Epistemol',
  'YC PLSC: American Govt',
  'YC PLSC: Analyt Pol Theory',
  'YC PLSC: Comparative Govt',
  'YC PLSC: Core Lecture',
  'YC PLSC: Intnatl Relations',
  'YC PLSC: Intro Courses',
  'YC PLSC: Method & Formal Theory',
  'YC PLSC: Political Phil',
  'YC PLSC: Sr Essay/Dir Read',
  'YC Prog: Advanced Programming',
  'YC Prog: Applctions/Algorithms',
  'YC Prog: Data Structures',
  'YC Prog: Programming',
  'YC Prog: Programming Elective',
  'YC PSYC: Natural Science',
  'YC PSYC: Natural Science Core',
  'YC PSYC: NSCI Track Adv Scie',
  'YC PSYC: NSCI Track RsrchMthds',
  'YC PSYC: NSCI Track Senior Sem',
  'YC PSYC: Social Science',
  'YC PSYC: Social Science Core',
  'YC S&DS: Data Analy Disc Area',
  'YC S&DS: Methods Data Science',
  'YC SAST: Premodern South Asia',
  'YC Sociology: Methods Course',
  'YC SOCY: Economic Sociology',
  'YC Sophomore Seminar',
  'YC Urban Studies: Elective',
  'YC Urban Studies: Methods Crse',
  'YC Urban Studies: Survey Crse',
  'YC Urban Studies: Urban Lab',
  'YC: Persia & Iran Content',
  "YC: Preference Selection Req'd",
  'YC: THST Artistic Practice',
  'YC: THST Dramlit/ThHist/PerfTh',
  'YC: THST Elective',
  'YC: THST Histories',
  'YC: THST Interarts',
  'YC: THST non-English Dram Lit',
  'YC: THST Performance Theory',
  'Writing Skill (Opt.)',
  'YC Music: Advanced Grp II',
];

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
  '#31a4d4',
  '#2cafb7',
  '#26ba9a',
  '#49be85',
  '#6cc26f',
  '#a3b24b',
  '#daa126',
  '#df8653',
  '#ca5f53',
  '#ba7881',
];

export const barChartColors = [
  '#00e800',
  '#aeed1a',
  '#f5f542',
  '#f5a142',
  '#f54242',
];
