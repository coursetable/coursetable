import chroma from 'chroma-js';

export const sortbyOptions = [
  { label: 'Sort by Course Code', value: 'text' },
  { label: 'Sort by Course Name', value: 'course_name' },
  { label: 'Sort by Rating', value: 'rating' },
  { label: 'Sort by Workload', value: 'workload' },
  { label: 'Sort by (Rating - Workload)', value: 'gut' },
  // { label: 'Enrollment', value: 'enrollment' },
];

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
  { value: 'ACCT', label: 'ACCT - Accounting' },
  { value: 'AFAM', label: 'AFAM - African American Studies' },
  { value: 'AFST', label: 'AFST - African Studies' },
  { value: 'AKKD', label: 'AKKD - Akkadian' },
  { value: 'AMST', label: 'AMST - American Studies' },
  { value: 'AMTH', label: 'AMTH - Applied Mathematics' },
  { value: 'ANTH', label: 'ANTH - Anthropology' },
  { value: 'APHY', label: 'APHY - Applied Physics' },
  { value: 'ARBC', label: 'ARBC - Arabic' },
  { value: 'ARCG', label: 'ARCG - Archaeological Studies' },
  { value: 'ARCH', label: 'ARCH - Architecture' },
  { value: 'ARMN', label: 'ARMN - Armenian' },
  { value: 'ART', label: 'ART - Art' },
  { value: 'ASL', label: 'ASL - American Sign Language' },
  { value: 'ASTR', label: 'ASTR - Astronomy' },
  { value: 'BENG', label: 'BENG - Biomedical Engineering' },
  { value: 'BIOL', label: 'BIOL - Biology' },
  { value: 'BRST', label: 'BRST - British Studies' },
  { value: 'BURM', label: 'BURM - Burmese' },
  { value: 'CENG', label: 'CENG - Chemical Engineering' },
  { value: 'CGSC', label: 'CGSC - Cognitive Science' },
  { value: 'CHEM', label: 'CHEM - Chemistry' },
  { value: 'CHLD', label: 'CHLD - Child Study Center' },
  { value: 'CHNS', label: 'CHNS - Chinese' },
  { value: 'CLCV', label: 'CLCV - Classical Civilization' },
  { value: 'CLSS', label: 'CLSS - Classics' },
  { value: 'CPAR', label: 'CPAR - Computing and the Arts' },
  { value: 'CPSC', label: 'CPSC - Computer Science' },
  { value: 'CSEC', label: 'CSEC - Computer Science and Economics' },
  { value: 'CZEC', label: 'CZEC - Czech' },
  { value: 'DEVN', label: 'DEVN - DeVane Lecture Course' },
  { value: 'DRST', label: 'DRST - Directed Studies' },
  { value: 'DUTC', label: 'DUTC - Dutch' },
  { value: 'E&EB', label: 'E&EB - Ecology and Evolutionary Biology' },
  { value: 'EALL', label: 'EALL - East Asian Languages and Literatures' },
  { value: 'EAST', label: 'EAST - East Asian Studies' },
  { value: 'ECON', label: 'ECON - Economics' },
  { value: 'EDST', label: 'EDST - Education Studies' },
  { value: 'EENG', label: 'EENG - Electrical Engineering' },
  { value: 'EGYP', label: 'EGYP - Egyptian' },
  { value: 'ENAS', label: 'ENAS - Engineering and Applied Science' },
  { value: 'ENGL', label: 'ENGL - English Language and Literature' },
  { value: 'ENRG', label: 'ENRG - Energy Studies' },
  { value: 'ENVE', label: 'ENVE - Environmental Engineering' },
  { value: 'EP&E', label: 'EP&E - Ethics, Politics, and Economics' },
  { value: 'EPS', label: 'EPS - Earth and Planetary Sciences' },
  { value: 'ER&M', label: 'ER&M - Ethnicity, Race, and Migration' },
  { value: 'EVST', label: 'EVST - Environmental Studies' },
  { value: 'F&ES', label: 'F&ES - Forestry & Environmental Studies' },
  { value: 'FILM', label: 'FILM - Film and Media Studies' },
  { value: 'FNSH', label: 'FNSH - Finnish' },
  { value: 'FREN', label: 'FREN - French' },
  { value: 'GLBL', label: 'GLBL - Global Affairs' },
  { value: 'GMAN', label: 'GMAN - Germanic Languages and Literatures' },
  { value: 'GREK', label: 'GREK - Ancient Greek' },
  { value: 'HEBR', label: 'HEBR - Hebrew' },
  { value: 'HGRN', label: 'HGRN - Hungarian' },
  { value: 'HIST', label: 'HIST - History' },
  { value: 'HLTH', label: 'HLTH - Global Health Studies' },
  { value: 'HMRT', label: 'HMRT - Human Rights' },
  { value: 'HNDI', label: 'HNDI - Hindi' },
  { value: 'HSAR', label: 'HSAR - History of Art' },
  {
    value: 'HSHM',
    label: 'HSHM - History of Science, Medicine, and Public Health',
  },
  { value: 'HUMS', label: 'HUMS - Humanities' },
  { value: 'INDN', label: 'INDN - Indonesian' },
  { value: 'ITAL', label: 'ITAL - Italian' },
  { value: 'JAPN', label: 'JAPN - Japanese' },
  { value: 'JDST', label: 'JDST - Judaic Studies' },
  { value: 'KHMR', label: 'KHMR - Khmer' },
  { value: 'KREN', label: 'KREN - Korean' },
  { value: 'LAST', label: 'LAST - Latin American Studies' },
  { value: 'LATN', label: 'LATN - Latin' },
  { value: 'LING', label: 'LING - Linguistics' },
  { value: 'LITR', label: 'LITR - Comparative Literature' },
  { value: 'MATH', label: 'MATH - Mathematics' },
  { value: 'MB&B', label: 'MB&B - Molecular Biophysics and Biochemistry' },
  {
    value: 'MCDB',
    label: 'MCDB - Molecular, Cellular, and Developmental Biology',
  },
  { value: 'MENG', label: 'MENG - Mechanical Engineering' },
  { value: 'MGRK', label: 'MGRK - Modern Greek' },
  { value: 'MMES', label: 'MMES - Modern Middle East Studies' },
  { value: 'MTBT', label: 'MTBT - Modern Tibetan' },
  { value: 'MUSI', label: 'MUSI - Music' },
  { value: 'NAVY', label: 'NAVY - Naval Science' },
  { value: 'NELC', label: 'NELC - Near Eastern Languages and Civilizations' },
  { value: 'NSCI', label: 'NSCI - Neuroscience' },
  { value: 'OTTM', label: 'OTTM - Ottoman' },
  { value: 'PERS', label: 'PERS - Persian' },
  { value: 'PHIL', label: 'PHIL - Philosophy' },
  { value: 'PHYS', label: 'PHYS - Physics' },
  { value: 'PLSC', label: 'PLSC - Political Science' },
  { value: 'PLSH', label: 'PLSH - Polish' },
  { value: 'PNJB', label: 'PNJB - Punjabi' },
  { value: 'PORT', label: 'PORT - Portuguese' },
  { value: 'PSYC', label: 'PSYC - Psychology' },
  { value: 'RLST', label: 'RLST - Religious Studies' },
  { value: 'ROMN', label: 'ROMN - Romanian' },
  { value: 'RSEE', label: 'RSEE - Russian and East European Studies' },
  { value: 'RUSS', label: 'RUSS - Russian' },
  { value: 'S&DS', label: 'S&DS - Statistics and Data Science' },
  { value: 'SAST', label: 'SAST - South Asian Studies' },
  { value: 'SBCR', label: 'SBCR - Bosnian-Croatian-Serbian' },
  { value: 'SCIE', label: 'SCIE - Science' },
  { value: 'SKRT', label: 'SKRT - Sanskrit' },
  { value: 'SLAV', label: 'SLAV - Slavic Languages and Literatures' },
  { value: 'SNHL', label: 'SNHL - Sinhala' },
  { value: 'SOCY', label: 'SOCY - Sociology' },
  { value: 'SPAN', label: 'SPAN - Spanish' },
  { value: 'SPEC', label: 'SPEC - Special Divisional Major' },
  { value: 'STCY', label: 'STCY - Study of the City' },
  { value: 'SWAH', label: 'SWAH - Kiswahili' },
  { value: 'TAML', label: 'TAML - Tamil' },
  { value: 'TBTN', label: 'TBTN - Classical Tibetan' },
  { value: 'THST', label: 'THST - Theater and Performance Studies' },
  { value: 'TKSH', label: 'TKSH - Turkish' },
  { value: 'TWI', label: 'TWI - Twi' },
  { value: 'UKRN', label: 'UKRN - Ukrainian' },
  { value: 'URBN', label: 'URBN - Urban Studies' },
  { value: 'USAF', label: 'USAF - Aerospace Studies' },
  { value: 'VIET', label: 'VIET - Vietnamese' },
  { value: 'WGSS', label: 'WGSS - Women’s, Gender, and Sexuality Studies' },
  { value: 'WLOF', label: 'WLOF - Wolof' },
  { value: 'YORU', label: 'YORU - Yorùbá' },
  { value: 'ZULU', label: 'ZULU - isiZulu' },
];

export const ratingColormap = chroma
  .bezier(['#f8696b', '#ffeb84', '#63b37b'])
  // .bezier(['#ff5959', '#ffeb84', '#00bd26'])
  .scale()
  .domain([1, 5]);
export const workloadColormap = chroma
  .bezier(['#63b37b', '#ffeb84', '#f8696b'])
  // .bezier(['#00bd26', '#ffeb84', '#ff5959'])
  .scale()
  .domain([1, 5]);
