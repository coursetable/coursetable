import chroma from 'chroma-js';

export const sortbyOptions = [
  { label: 'Sort by Course Code', value: 'text' },
  { label: 'Sort by Course Name', value: 'course_name' },
  { label: 'Sort by Rating', value: 'rating' },
  { label: 'Sort by Workload', value: 'workload' },
  // { label: 'Enrollment', value: 'enrollment' },
];

export const sortbyQueries = {
  course_name: { title: 'asc' },
  rating: { average_rating: 'desc' },
  workload: { average_workload: 'asc' },
  text: null,
};

export const areas = ['Hu', 'So', 'Sc'];
export const skills = ['QR', 'WR', 'L1', 'L2', 'L3', 'L4', 'L5'];

export const skillsAreasColors = {
  Hu: '#9970AB',
  So: '#4393C3',
  Sc: '#5AAE61',
  QR: '#CC3311',
  WR: '#EC7014',
  L: '#000000',
  L1: '#888888',
  L2: '#888888',
  L3: '#888888',
  L4: '#888888',
  L5: '#888888',
};

export const skillsAreasOptions = [
  { label: 'Hu', value: 'Hu', color: skillsAreasColors['Hu'] },
  { label: 'So', value: 'So', color: skillsAreasColors['So'] },
  { label: 'Sc', value: 'Sc', color: skillsAreasColors['Sc'] },
  { label: 'QR', value: 'QR', color: skillsAreasColors['QR'] },
  { label: 'WR', value: 'WR', color: skillsAreasColors['WR'] },
  { label: 'L (all)', value: 'L', color: skillsAreasColors['L'] },
  { label: 'L1', value: 'L1', color: skillsAreasColors['L1'] },
  { label: 'L2', value: 'L2', color: skillsAreasColors['L2'] },
  { label: 'L3', value: 'L3', color: skillsAreasColors['L3'] },
  { label: 'L4', value: 'L4', color: skillsAreasColors['L4'] },
  { label: 'L5', value: 'L5', color: skillsAreasColors['L5'] },
];

export const colorOptionStyles = {
  control: (styles) => ({
    ...styles,
    backgroundColor: 'white',
    borderRadius: '8px',
    cursor: 'pointer',
    border: 'solid 2px rgba(0,0,0,0.1)',
  }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    const color = chroma(data.color);
    return {
      ...styles,
      fontWeight: 'bold',
      backgroundColor: isDisabled
        ? null
        : isSelected
        ? data.color
        : isFocused
        ? color.alpha(0.1).css()
        : null,
      color: isDisabled
        ? '#ccc'
        : isSelected
        ? chroma.contrast(color, 'white') > 2
          ? 'white'
          : 'black'
        : data.color,
      cursor: isDisabled ? 'not-allowed' : 'pointer',

      ':active': {
        ...styles[':active'],
        backgroundColor:
          !isDisabled && (isSelected ? data.color : color.alpha(0.5).css()),
      },
    };
  },
  multiValue: (styles, { data }) => {
    const color = chroma(data.color);
    return {
      ...styles,
      backgroundColor: color.alpha(0.16).css(),
      borderRadius: '6px',
    };
  },
  multiValueLabel: (styles, { data }) => ({
    ...styles,
    color: data.color,
    fontWeight: 'bold',
  }),
  multiValueRemove: (styles, { data }) => ({
    ...styles,
    color: data.color,
    borderRadius: '6px',
    ':hover': {
      backgroundColor: data.color,
      color: 'white',
    },
  }),
  menuPortal: (base) => ({ ...base, zIndex: 9999, borderRadius: '8px' }),
  menu: (base) => ({
    ...base,
    paddingTop: 0,
    marginTop: 0,
    borderRadius: '8px',
    boxShadow:
      '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  }),
  menuList: (base) => ({
    ...base,
    paddingTop: 0,
    paddingBottom: 0,
    borderRadius: '8px',
  }),
};

export const selectStyles = {
  multiValue: (styles) => {
    return {
      ...styles,
      borderRadius: '6px',
    };
  },
  multiValueRemove: (styles) => {
    return {
      ...styles,
      borderRadius: '6px',
    };
  },
  control: (base) => ({
    ...base,
    borderRadius: '8px',
    cursor: 'pointer',
    border: 'solid 2px rgba(0,0,0,0.1)',
  }),
  menuPortal: (base) => ({ ...base, zIndex: 9999, borderRadius: '8px' }),
  menu: (base) => ({
    ...base,
    paddingTop: 0,
    marginTop: 0,
    borderRadius: '8px',
    boxShadow:
      '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  }),
  menuList: (base) => ({
    ...base,
    paddingTop: 0,
    paddingBottom: 0,
    borderRadius: '8px',
  }),
  option: (base) => ({
    ...base,
    cursor: 'pointer',
  }),
};

export const creditOptions = [
  { label: '0.5', value: '0.5' },
  { label: '1', value: '1' },
  { label: '1.5', value: '1.5' },
  { label: '2', value: '2' },
];

// to get a list of abbreviations, run
// a distinct_on:school query over computed_course_info

// school labels were filled in manually
export const schoolOptions = [
  { label: 'Yale College', value: 'YC' },
  { label: 'Architecture', value: 'AC' },
  { label: 'Art', value: 'AT' },
  { label: 'Divinity', value: 'DI' },
  { label: 'Drama', value: 'DR' },
  { label: 'Forestry', value: 'FS' },
  { label: 'Graduate', value: 'GS' },
  { label: 'Law', value: 'LW' },
  { label: 'Medicine', value: 'MD' },
  { label: 'Management', value: 'MG' },
  { label: 'Music', value: 'MU' },
  { label: 'Nursing', value: 'NR' },
  { label: 'Physician Associate', value: 'PA' },
  { label: 'Summer Session', value: 'SU' },
];

export const subjectOptions = [
  { value: 'ACCT', label: 'Accounting' },
  { value: 'AFAM', label: 'African American Studies' },
  { value: 'AFST', label: 'African Studies' },
  { value: 'AKKD', label: 'Akkadian' },
  { value: 'AMST', label: 'American Studies' },
  { value: 'AMTH', label: 'Applied Mathematics' },
  { value: 'ANTH', label: 'Anthropology' },
  { value: 'APHY', label: 'Applied Physics' },
  { value: 'ARBC', label: 'Arabic' },
  { value: 'ARCG', label: 'Archaeological Studies' },
  { value: 'ARCH', label: 'Architecture' },
  { value: 'ARMN', label: 'Armenian' },
  { value: 'ART', label: 'Art' },
  { value: 'ASL', label: 'American Sign Language' },
  { value: 'ASTR', label: 'Astronomy' },
  { value: 'BENG', label: 'Biomedical Engineering' },
  { value: 'BIOL', label: 'Biology' },
  { value: 'BRST', label: 'British Studies' },
  { value: 'BURM', label: 'Burmese' },
  { value: 'CENG', label: 'Chemical Engineering' },
  { value: 'CGSC', label: 'Cognitive Science' },
  { value: 'CHEM', label: 'Chemistry' },
  { value: 'CHLD', label: 'Child Study Center' },
  { value: 'CHNS', label: 'Chinese' },
  { value: 'CLCV', label: 'Classical Civilization' },
  { value: 'CLSS', label: 'Classics' },
  { value: 'CPAR', label: 'Computing and the Arts' },
  { value: 'CPSC', label: 'Computer Science' },
  { value: 'CSEC', label: 'Computer Science and Economics' },
  { value: 'CZEC', label: 'Czech' },
  { value: 'DEVN', label: 'DeVane Lecture Course' },
  { value: 'DRST', label: 'Directed Studies' },
  { value: 'DUTC', label: 'Dutch' },
  { value: 'E&EB', label: 'Ecology and Evolutionary Biology' },
  { value: 'EALL', label: 'East Asian Languages and Literatures' },
  { value: 'EAST', label: 'East Asian Studies' },
  { value: 'ECON', label: 'Economics' },
  { value: 'EDST', label: 'Education Studies' },
  { value: 'EENG', label: 'Electrical Engineering' },
  { value: 'EGYP', label: 'Egyptian' },
  { value: 'ENAS', label: 'Engineering and Applied Science' },
  { value: 'ENGL', label: 'English Language and Literature' },
  { value: 'ENRG', label: 'Energy Studies' },
  { value: 'ENVE', label: 'Environmental Engineering' },
  { value: 'EP&E', label: 'Ethics, Politics, and Economics' },
  { value: 'EPS', label: 'Earth and Planetary Sciences' },
  { value: 'ER&M', label: 'Ethnicity, Race, and Migration' },
  { value: 'EVST', label: 'Environmental Studies' },
  { value: 'F&ES', label: 'Forestry & Environmental Studies' },
  { value: 'FILM', label: 'Film and Media Studies' },
  { value: 'FNSH', label: 'Finnish' },
  { value: 'FREN', label: 'French' },
  { value: 'GLBL', label: 'Global Affairs' },
  { value: 'GMAN', label: 'Germanic Languages and Literatures' },
  { value: 'GREK', label: 'Ancient Greek' },
  { value: 'HEBR', label: 'Hebrew' },
  { value: 'HGRN', label: 'Hungarian' },
  { value: 'HIST', label: 'History' },
  { value: 'HLTH', label: 'Global Health Studies' },
  { value: 'HMRT', label: 'Human Rights' },
  { value: 'HNDI', label: 'Hindi' },
  { value: 'HSAR', label: 'History of Art' },
  { value: 'HSHM', label: 'History of Science, Medicine, and Public Health' },
  { value: 'HUMS', label: 'Humanities' },
  { value: 'INDN', label: 'Indonesian' },
  { value: 'ITAL', label: 'Italian' },
  { value: 'JAPN', label: 'Japanese' },
  { value: 'JDST', label: 'Judaic Studies' },
  { value: 'KHMR', label: 'Khmer' },
  { value: 'KREN', label: 'Korean' },
  { value: 'LAST', label: 'Latin American Studies' },
  { value: 'LATN', label: 'Latin' },
  { value: 'LING', label: 'Linguistics' },
  { value: 'LITR', label: 'Comparative Literature' },
  { value: 'MATH', label: 'Mathematics' },
  { value: 'MB&B', label: 'Molecular Biophysics and Biochemistry' },
  { value: 'MCDB', label: 'Molecular, Cellular, and Developmental Biology' },
  { value: 'MENG', label: 'Mechanical Engineering' },
  { value: 'MGRK', label: 'Modern Greek' },
  { value: 'MMES', label: 'Modern Middle East Studies' },
  { value: 'MTBT', label: 'Modern Tibetan' },
  { value: 'MUSI', label: 'Music' },
  { value: 'NAVY', label: 'Naval Science' },
  { value: 'NELC', label: 'Near Eastern Languages and Civilizations' },
  { value: 'NSCI', label: 'Neuroscience' },
  { value: 'OTTM', label: 'Ottoman' },
  { value: 'PERS', label: 'Persian' },
  { value: 'PHIL', label: 'Philosophy' },
  { value: 'PHYS', label: 'Physics' },
  { value: 'PLSC', label: 'Political Science' },
  { value: 'PLSH', label: 'Polish' },
  { value: 'PNJB', label: 'Punjabi' },
  { value: 'PORT', label: 'Portuguese' },
  { value: 'PSYC', label: 'Psychology' },
  { value: 'RLST', label: 'Religious Studies' },
  { value: 'ROMN', label: 'Romanian' },
  { value: 'RSEE', label: 'Russian and East European Studies' },
  { value: 'RUSS', label: 'Russian' },
  { value: 'S&DS', label: 'Statistics and Data Science' },
  { value: 'SAST', label: 'South Asian Studies' },
  { value: 'SBCR', label: 'Bosnian-Croatian-Serbian' },
  { value: 'SCIE', label: 'Science' },
  { value: 'SKRT', label: 'Sanskrit' },
  { value: 'SLAV', label: 'Slavic Languages and Literatures' },
  { value: 'SNHL', label: 'Sinhala' },
  { value: 'SOCY', label: 'Sociology' },
  { value: 'SPAN', label: 'Spanish' },
  { value: 'SPEC', label: 'Special Divisional Major' },
  { value: 'STCY', label: 'Study of the City' },
  { value: 'SWAH', label: 'Kiswahili' },
  { value: 'TAML', label: 'Tamil' },
  { value: 'TBTN', label: 'Classical Tibetan' },
  { value: 'THST', label: 'Theater and Performance Studies' },
  { value: 'TKSH', label: 'Turkish' },
  { value: 'TWI', label: 'Twi' },
  { value: 'UKRN', label: 'Ukrainian' },
  { value: 'URBN', label: 'Urban Studies' },
  { value: 'USAF', label: 'Aerospace Studies' },
  { value: 'VIET', label: 'Vietnamese' },
  { value: 'WGSS', label: 'Women’s, Gender, and Sexuality Studies' },
  { value: 'WLOF', label: 'Wolof' },
  { value: 'YORU', label: 'Yorùbá' },
  { value: 'ZULU', label: 'isiZulu' },
];

export const ratingColormap = chroma
  .bezier(['#e23e57', '#ffbd39', '#55e9bc'])
  .scale()
  .domain([1, 5]);
export const workloadColormap = chroma
  .bezier(['#55e9bc', '#ffbd39', '#e23e57'])
  .scale()
  .domain([1, 5]);
