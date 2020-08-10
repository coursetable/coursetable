import React from 'react';
import NotFoundImage from '../images/not_found.svg';
import { NavLink } from 'react-router-dom';

function NotFound() {
	return (
		<div className="text-center py-5">
			<img
				alt="No courses found."
				className="py-5"
				src={NotFoundImage}
				style={{ width: '25%' }}
			></img>
			<h3>Page not found</h3>
			<div>
				If you think this is an error, please{' '}
				<NavLink to="/feedback">let us know</NavLink> and we will take a look.
			</div>
		</div>
	);
}

export default NotFound;
