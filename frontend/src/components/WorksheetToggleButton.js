import React from 'react';

import styles from './Footer.module.css';
import common_styles from '../styles/common.module.css';
import { Button } from 'react-bootstrap';

const App = (props) => {
	
	var [inWorksheet, setInWorksheet] = React.useState();

	function toggleWorkSheet(e){
		e.preventDefault();
		console.log("toggle ", props.course_id)
		setInWorksheet(!inWorksheet)
	}

	return (
		<Button onClick={toggleWorkSheet}>{inWorksheet ? "-" : "+"}</Button>
	)

}


export default App;