import chroma from 'chroma-js';

export const sortbyOptions = [
	{ label: 'Relevance', value: 'text' },
	{ label: 'Course name', value: 'course_name' },
	{ label: 'Rating', value: 'rating' },
	{ label: 'Workload', value: 'workload' },
	// { label: 'Enrollment', value: 'enrollment' },
];

export const sortbyQueries = {
	text: null,
	course_name: { title: 'asc' },
	rating: { average_rating: 'desc' },
	workload: { average_workload: 'asc' },
};

export const areas = ['Hu', 'So', 'Sc'];
export const skills = ['QR', 'WR', 'L1', 'L2', 'L3', 'L4', 'L5'];

export const skillsAreasOptions = [
	{ label: 'HU', value: 'Hu', color: '#9970AB' },
	{ label: 'SO', value: 'So', color: '#4393C3' },
	{ label: 'SC', value: 'Sc', color: '#5AAE61' },
	{ label: 'QR', value: 'QR', color: '#CC3311' },
	{ label: 'WR', value: 'WR', color: '#EC7014' },
	{ label: 'L (all)', value: 'L', color: '#000000' },
	{ label: 'L1', value: 'L1', color: '#888888' },
	{ label: 'L2', value: 'L2', color: '#888888' },
	{ label: 'L3', value: 'L3', color: '#888888' },
	{ label: 'L4', value: 'L4', color: '#888888' },
	{ label: 'L5', value: 'L5', color: '#888888' },
];

export const colorOptionStyles = {
	control: styles => ({ ...styles, backgroundColor: 'white' }),
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
			cursor: isDisabled ? 'not-allowed' : 'default',

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
			backgroundColor: color.alpha(0.25).css(),
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
		':hover': {
			backgroundColor: data.color,
			color: 'white',
		},
	}),
	menuPortal: base => ({ ...base, zIndex: 9999 }),
	menu: base => ({
		...base,
		marginTop: 0,
	}),
};

export const selectStyles = {
	menuPortal: base => ({ ...base, zIndex: 9999 }),
	menu: base => ({
		...base,
		marginTop: 0,
	}),
};

export const creditOptions = [
	{ label: '0.5', value: '0.5' },
	{ label: '1', value: '1' },
	{ label: '1.5', value: '1.5' },
	{ label: '2', value: '2' },
];

export const ratingColormap = chroma.bezier(['#d32626','#f6d743','#79d70f']).scale().domain([1,5])
export const workloadColormap = chroma.bezier(['#79d70f','#f6d743','#d32626']).scale().domain([1,5])