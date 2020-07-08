import React from 'react';

import {
	Accordion,
	Card,
	Container,
	Button,
	Row,
	Col,
	Badge,
} from 'react-bootstrap';

import { BsBookmarkPlus } from 'react-icons/bs';

import './SearchResultsItem.css';
import Styles from './SearchResultsItem.module.css';

const App = ({ course, isMobile }) => {
	const RATINGS_PRECISION = 1;

	return (
		<Card key={course.course_id} className={'m-3 ' + Styles.search_result}>
			<Accordion.Toggle as={Card.Header} eventKey={course.course_id} className={Styles.card_header}>
				<Row
					className={
						'px-0 justify-content-between ' + Styles.search_result_item
					}
				>
					<Col md={4} xs={8} className={Styles.course_header}>
						<div className={Styles.course_code}>
							{course.course_codes ? course.course_codes.join(' • ') : ''}
						</div>
						<div>
							{course.title.length > 32
								? course.title.slice(0, 29) + '...'
								: course.title}
						</div>
					</Col>
					<Col md={2} xs={4} style={{whiteSpace: "nowrap"}}>
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
			</Accordion.Toggle>
			<Accordion.Collapse eventKey={course.course_id}>
				<Card.Body className={Styles.expanded_card}>
					<div>{'Taught by ' + course.professor_names.join(' ')}</div>
					<div>{course.description}</div>
				</Card.Body>
			</Accordion.Collapse>
		</Card>
	);
};

export default App;
