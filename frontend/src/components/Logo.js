import React from 'react';
import { NavLink } from 'react-router-dom';

import common_styles from '../styles/common.module.css';

function Logo({ theme }) {
	return (
		<NavLink
			to="/"
			activeStyle={{
				textDecoration: 'none',
				display: 'table-cell',
				verticalAlign: 'middle',
			}}
		>
			<span
				className={common_styles.coursetable_logo}
				style={{ color: theme === 'dark' ? 'white' : 'black' }}
			>
				Course<span style={{ color: '#92bcea' }}>Table</span>
			</span>
		</NavLink>
	);
}

export default Logo;
