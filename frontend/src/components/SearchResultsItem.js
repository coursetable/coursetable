import React from 'react';

import { Container, Button, Row, Col, Badge } from 'react-bootstrap';

import { BsBookmarkPlus } from 'react-icons/bs';

import Styles from './SearchResultsItem.module.css';

const App = ({ course, isMobile }) => {
	const RATINGS_PRECISION = 1;

	return (
		<Container className={'container-fluid p-3 ' + Styles.search_result_item}>
			<Row
				className={'px-0 justify-content-between ' + Styles.search_result_inner}
			>
				<Col md={4} xs={8} className={Styles.course_header}>
					<div className={Styles.course_code}>
						{course.course_codes ? course.course_codes.join(' • ') : ''}
					</div>
					<div className={Styles.dot}> • </div>
					<div className={Styles.course_section}>{course.credits} credits</div>
					<div>
						{course.title.length > 32
							? course.title.slice(0, 29) + '...'
							: course.title}
					</div>
				</Col>
				<Col md={2} xs={4}>
					<div className={Styles.overall_rating}>
						{course.average_rating
							? course.average_rating.toFixed(RATINGS_PRECISION) +
							  '\u00a0overall'
							: ''}
					</div>
					<div className={Styles.workload_rating}>
						{course.average_workload
							? course.average_workload.toFixed(RATINGS_PRECISION) +
							  '\u00a0workload'
							: ''}
					</div>
				</Col>
				<Col md={2} xs={8} className={Styles.skills_areas}>
					<div className={Styles.skills_areas}>
						{course.skills.map(skill => (
							<Badge
								variant="secondary"
								className={Styles.tag + ' ' + Styles[skill]}
							>
								{skill}
							</Badge>
						))}
						{course.areas.map(area => (
							<Badge
								variant="secondary"
								className={Styles.tag + ' ' + Styles[area]}
							>
								{area}
							</Badge>
						))}
					</div>
				</Col>
				<Col md={2} xs={4} className={Styles.friends_count}>
					<div>X friends shopping</div>
				</Col>
				<Col sm={'auto'}>
					<Button
						className={
							isMobile
								? Styles.toggle_worksheet_mobile
								: Styles.toggle_worksheet
						}
					>
						{isMobile ? 'Add to worksheet' : <BsBookmarkPlus />}
					</Button>
				</Col>
			</Row>
		</Container>
	);
};

export default App;
