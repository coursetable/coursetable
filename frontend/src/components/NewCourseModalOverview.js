import React, { useMemo, useState, useCallback } from 'react';
import {
  Row,
  Col,
  Modal,
  OverlayTrigger,
  Popover,
  Badge,
} from 'react-bootstrap';
import './MultiToggle.css';
import LinesEllipsis from 'react-lines-ellipsis';
import responsiveHOC from 'react-lines-ellipsis/lib/responsiveHOC';
import { HiExternalLink } from 'react-icons/hi';
import MultiToggle from 'react-multi-toggle';
import styled from 'styled-components';
import { useUser } from '../user';
import {
  TextComponent,
  StyledPopover,
  StyledRating,
  StyledLink,
} from './StyledComponents';
import {
  ratingColormap,
  workloadColormap,
  skillsAreasColors,
} from '../queries/Constants';
import Styles from './CourseModalOverview.module.css';
import styles from './NewCourseModalOverview.module.css';
import tag_styles from './SearchResultsItem.module.css';

import CourseModalLoading from './CourseModalLoading';
import CourseModalEvaluations from './NewCourseModalEvalutions';
import CollapsableText from './CollapsableText';
import { fbFriendsAlsoTaking, toSeasonString } from '../courseUtilities';
import { useSearchAverageAcrossSeasonsQuery } from '../generated/graphql';
import { weekdays } from '../common';
import chroma from 'chroma-js';

// Button with season and other info that user selects to view evals
const StyledCol = styled(Col)`
  background-color: ${({ theme }) =>
    theme.theme === 'light' ? 'rgb(190, 221, 255)' : theme.select_hover};
`;

// Multitoggle in modal (course, both, prof)
export const StyledMultiToggle = styled(MultiToggle)`
  background-color: ${({ theme }) => theme.surface[1]};
  border-color: ${({ theme }) => theme.border};
  .toggleOption {
    color: ${({ theme }) => theme.text[0]};
  }
`;

/**
 * Displays course modal when clicking on a course
 * @prop setFilter - function that switches evaluation filter
 * @prop filter - string that holds current filter
 * @prop setSeason - function that sets the evaluation to view
 * @prop listing - dictionary that holds all the info for this listing
 */

const CourseModalOverview = ({ listing, all_listings }) => {
  let cross_listed_codes = [];
  if (listing.all_course_codes) {
    cross_listed_codes = [...listing.all_course_codes];
    cross_listed_codes.splice(
      listing.all_course_codes.indexOf(listing.course_code),
      1
    );
  }
  // Fetch user context data
  const { user } = useUser();
  // List of other friends shopping this class
  const also_taking =
    user.fbLogin && user.fbWorksheets
      ? fbFriendsAlsoTaking(
          listing.season_code,
          listing.crn,
          user.fbWorksheets.worksheets,
          user.fbWorksheets.friendInfo
        )
      : [];

  // Parse for location url and location name
  let location_url = '';
  for (const i in weekdays) {
    const day = weekdays[i];
    if (listing.times_by_day && listing.times_by_day[day]) {
      location_url = listing.times_by_day[day][0][3];
    }
  }

  return (
    <Modal.Body>
      {cross_listed_codes.length > 0 && (
        <Row className="mx-auto mt-2">
          Same as&nbsp;<strong>{cross_listed_codes.join(', ')}</strong>
        </Row>
      )}
      <Row className="mx-auto">
        <Col md={8} className="pl-0 pr-4">
          {listing.description && (
            <CollapsableText
              header="Description"
              body={listing.description}
              init={false}
            />
          )}
          {listing.requirements && (
            <CollapsableText
              header="Requirements"
              body={listing.requirements}
            />
          )}
          {listing.classnotes && (
            <CollapsableText header="Class Notes" body={listing.classnotes} />
          )}
          {listing.regnotes && (
            <CollapsableText header="Registrar Notes" body={listing.regnotes} />
          )}
          {listing.rp_attr && (
            <CollapsableText
              header="Reading Period Notes"
              body={listing.rp_attr}
            />
          )}
          {listing.final_exam && listing.final_exam !== 'HTBA' && (
            <CollapsableText
              header="Final Exam Notes"
              body={listing.final_exam}
            />
          )}
        </Col>
        <Col md={4} className="pr-0 pl-4">
          <Row className={`mx-auto mt-3 ${styles.metadata_header}`}>
            <TextComponent type={2}>Professor</TextComponent>
          </Row>
          <Row className="mx-auto">
            <span className={styles.metadata_body}>
              {listing.professor_names.length
                ? listing.professor_names.map((prof, index) => {
                    return (
                      <React.Fragment key={prof}>
                        {index ? ' • ' : ''}
                        <StyledLink>{prof}</StyledLink>
                      </React.Fragment>
                    );
                  })
                : 'N/A'}
            </span>
          </Row>
          <Row className={`mx-auto mt-3 ${styles.metadata_header}`}>
            <TextComponent type={2}>Date & Time</TextComponent>
          </Row>
          <Row className="mx-auto">
            <span className={styles.metadata_body}>
              {listing.times_summary}
            </span>
          </Row>
          <Row className={`mx-auto mt-3 ${styles.metadata_header}`}>
            <TextComponent type={2}>Location</TextComponent>
          </Row>
          <Row className="mx-auto">
            <span className={styles.metadata_body}>
              {location_url !== '' ? (
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={location_url}
                  className="d-flex"
                >
                  {listing.locations_summary}
                  <HiExternalLink size={18} className="ml-1 my-auto" />
                </a>
              ) : (
                listing.locations_summary
              )}
            </span>
          </Row>
          <Row className="mx-auto mt-3 justify-content-between">
            {listing.areas && (
              <Col xs="auto" className="p-0">
                <Row className={`mx-auto ${styles.metadata_header}`}>
                  <TextComponent type={2}>Areas</TextComponent>
                </Row>
                <Row className="mx-auto">
                  {listing.areas.map((area) => (
                    <Badge
                      variant="secondary"
                      className={tag_styles.tag}
                      style={{
                        color: skillsAreasColors[area],
                        backgroundColor: chroma(skillsAreasColors[area])
                          .alpha(0.16)
                          .css(),
                      }}
                      key={area}
                    >
                      {area}
                    </Badge>
                  ))}
                </Row>
              </Col>
            )}
            {listing.skills && (
              <Col xs="auto" className="p-0">
                <Row className={`mx-auto ${styles.metadata_header}`}>
                  <TextComponent type={2}>Skills</TextComponent>
                </Row>
                <Row className="mx-auto">
                  {listing.skills.map((skill) => (
                    <Badge
                      variant="secondary"
                      className={tag_styles.tag}
                      style={{
                        color: skillsAreasColors[skill],
                        backgroundColor: chroma(skillsAreasColors[skill])
                          .alpha(0.16)
                          .css(),
                      }}
                      key={skill}
                    >
                      {skill}
                    </Badge>
                  ))}
                </Row>
              </Col>
            )}
            <Col xs="auto" className="p-0">
              <Row className={`mx-auto ${styles.metadata_header}`}>
                <TextComponent type={2}>Credits</TextComponent>
              </Row>
              <Row className="mx-auto">
                <span className={styles.metadata_body}>
                  {listing.credits.toFixed(1)}
                </span>
              </Row>
            </Col>
          </Row>
          <Row className="mx-auto mt-3 justify-content-between">
            <Col xs="auto" className="p-0">
              <Row className={`mx-auto ${styles.metadata_header}`}>
                <TextComponent type={2}>Enrollment</TextComponent>
              </Row>
              <Row className="mx-auto">
                <span className={styles.metadata_body}>
                  {listing.enrolled
                    ? listing.enrolled
                    : listing.last_enrollment &&
                      listing.last_enrollment_same_professors
                    ? listing.last_enrollment
                    : listing.last_enrollment
                    ? `~${listing.last_enrollment} (different professor was teaching)`
                    : 'N/A'}
                </span>
              </Row>
            </Col>
            {listing.syllabus_url && (
              <Col xs="auto" className="p-0">
                <Row className={`mx-auto ${styles.metadata_header}`}>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={listing.syllabus_url}
                    className="d-flex"
                  >
                    Syllabus
                    <HiExternalLink size={18} className="ml-1 my-auto" />
                  </a>
                </Row>
              </Col>
            )}
          </Row>
          {listing.flag_info.length > 0 && (
            <>
              <Row className={`mx-auto mt-3 ${styles.metadata_header}`}>
                <TextComponent type={2}>Extra Info</TextComponent>
              </Row>
              <Row className="mx-auto">
                <ul className={Styles.flag_info}>
                  {listing.flag_info.map((text) => (
                    <li key={text} className={styles.metadata_body}>
                      {text}
                    </li>
                  ))}
                </ul>
              </Row>
            </>
          )}
          {also_taking.length > 0 && (
            <>
              <Row className={`mx-auto mt-3 ${styles.metadata_header}`}>
                <TextComponent type={2}>FB Friends</TextComponent>
              </Row>
              {also_taking.map((friend, index) => {
                return (
                  <Row className="m-auto" key={index}>
                    <span className={styles.metadata_body}>
                      {friend + (index === also_taking.length - 1 ? '' : ',')}
                    </span>
                  </Row>
                );
              })}
            </>
          )}
        </Col>
      </Row>
      <Row className="mx-auto mt-3">
        <CourseModalEvaluations listing={listing} all_listings={all_listings} />
      </Row>
    </Modal.Body>
  );
};

export default CourseModalOverview;
