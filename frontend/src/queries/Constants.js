import chroma from 'chroma-js';

export const sortbyOptions = [
  { label: 'Sort by course code', value: 'text' },
  { label: 'Sort by course name', value: 'course_name' },
  { label: 'Sort by rating', value: 'rating' },
  { label: 'Sort by workload', value: 'workload' },
  // { label: 'Enrollment', value: 'enrollment' },
];

export const sortbyQueries = {
	course_name: { title: 'asc' },
	rating: { average_rating: 'desc' },
	workload: { average_workload: 'asc' },
  text: { course_code: 'asc' },
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
	control: styles => ({
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
	menuPortal: base => ({ ...base, zIndex: 9999, borderRadius: '8px' }),
	menu: base => ({
		...base,
		paddingTop: 0,
		marginTop: 0,
		borderRadius: '8px',
		boxShadow:
			'0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
	}),
	menuList: base => ({
		...base,
		paddingTop: 0,
		paddingBottom: 0,
		borderRadius: '8px',
	}),
};

export const selectStyles = {
	multiValue: styles => {
		return {
			...styles,
			borderRadius: '6px',
		};
	},
	multiValueRemove: styles => {
		return {
			...styles,
			borderRadius: '6px',
		};
	},
	control: base => ({
		...base,
		borderRadius: '8px',
		cursor: 'pointer',
		border: 'solid 2px rgba(0,0,0,0.1)',
	}),
	menuPortal: base => ({ ...base, zIndex: 9999, borderRadius: '8px' }),
	menu: base => ({
		...base,
		paddingTop: 0,
		marginTop: 0,
		borderRadius: '8px',
		boxShadow:
			'0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
	}),
	menuList: base => ({
		...base,
		paddingTop: 0,
		paddingBottom: 0,
		borderRadius: '8px',
	}),
	option: base => ({
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

export const ratingColormap = chroma
	.bezier(['#e84a5f', '#fdffab', '#1fab89'])
	.scale()
	.domain([1, 5]);
export const workloadColormap = chroma
  .bezier(['#1fab89', '#fdffab', '#e84a5f'])
  .scale()
  .domain([1, 5]);
