import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Col, Container, Row, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { FaRegShareFromSquare } from 'react-icons/fa6';
import clsx from 'clsx';

import type { Filter } from './CourseModalOverview';
import WorksheetToggleButton from '../Worksheet/WorksheetToggleButton';
import styles from './CourseModal.module.css';
import { TextComponent, LinkLikeText } from '../Typography';
import SkillBadge from '../SkillBadge';
import { suspended } from '../../utilities/display';
import { toSeasonString } from '../../utilities/course';
import { useCourseData } from '../../contexts/ferryContext';
import type { Season, Crn, Listing } from '../../utilities/common';

const extraInfoMap: { [info in Listing['extra_info']]: string } = {
  ACTIVE: 'ACTIVE',
  MOVED_TO_SPRING_TERM: 'MOVED TO SPRING',
  CANCELLED: 'CANCELLED',
  MOVED_TO_FALL_TERM: 'MOVED TO FALL',
  CLOSED: 'CLOSED',
  NUMBER_CHANGED: 'NUMBER CHANGED',
};

// Share button
function ShareButton({ courseCode }: { readonly courseCode: string }) {
  const copyToClipboard = () => {
    const textToCopy = `${courseCode} -- CourseTable: ${window.location.href}`;
    navigator.clipboard.writeText(textToCopy).then(
      () => {
        toast.success('Course and URL copied to clipboard!');
      },
      (err) => {
        console.error('Error copying to clipboard: ', err);
      },
    );
  };

  return (
    <FaRegShareFromSquare
      onClick={copyToClipboard}
      size={25}
      color="#007bff"
      style={{ cursor: 'pointer' }}
    />
  );
}

// We can only split subviews of CourseModal because CourseModal contains core
// logic that determines whether itself is visible.
// Maybe we should split more code into the subviews?
const CourseModalOverview = suspended(() => import('./CourseModalOverview'));
const CourseModalEvaluations = suspended(
  () => import('./CourseModalEvaluations'),
);

function CourseModal() {
  const [searchParams, setSearchParams] = useSearchParams();

  const courseModal = searchParams.get('course-modal');
  const [seasonCode, crn] = courseModal
    ? (courseModal.split('-') as [Season, string])
    : [null, null];
  const { courses } = useCourseData(seasonCode ? [seasonCode] : []);

  const listing = seasonCode
    ? courses[seasonCode]?.get(Number(crn) as Crn)
    : undefined;

  // Viewing overview or an evaluation? List contains
  // [season code, listing info] for evaluations
  const [view, setView] = useState<'overview' | Listing>('overview');
  // Current evaluation filter (both, course, professor)
  const [filter, setFilter] = useState<Filter>('both');
  // Stack for listings that the user has viewed
  const [listings, setListings] = useState<Listing[]>([]);
  useEffect(() => {
    setListings(listing ? [listing] : []);
  }, [listing]);
  // Current listing that we are viewing overview info for
  const curListing = listings[listings.length - 1] ?? null;

  return (
    <div className="d-flex justify-content-center">
      {curListing && (
        <Modal
          show={Boolean(listing)}
          scrollable
          onHide={() => {
            // Reset views and filters
            setView('overview');
            setFilter('both');
            setSearchParams((prev) => {
              prev.delete('course-modal');
              return prev;
            });
          }}
          dialogClassName={styles.dialog}
          animation={false}
          centered
        >
          <Modal.Header closeButton className="d-flex justify-content-between">
            <Container className="p-0" fluid>
              {view === 'overview' ? (
                // Viewing Course Overview
                <div>
                  <Row className={clsx('m-auto', styles.modalTop)}>
                    <Col xs="auto" className="my-auto p-0">
                      {/* Show worksheet add/remove button */}
                      {listings.length === 1 ? (
                        // If this is the initial listing, show worksheet
                        // toggle button
                        <WorksheetToggleButton
                          crn={curListing.crn}
                          seasonCode={curListing.season_code}
                          modal
                        />
                      ) : (
                        // If this is the overview of some other eval course,
                        // show back button
                        <LinkLikeText
                          onClick={() => {
                            // Go back to the evaluations of this course
                            setView(curListing);
                          }}
                          className={styles.backArrow}
                        >
                          <IoMdArrowRoundBack size={30} />
                        </LinkLikeText>
                      )}
                    </Col>
                    <Col className="p-0 ml-3">
                      {/* Course Title */}
                      <Modal.Title>
                        <Row className="mx-auto mt-1 align-items-center">
                          <span className={styles.modalTitle}>
                            {curListing.extra_info !== 'ACTIVE' ? (
                              <span className={styles.cancelledText}>
                                {extraInfoMap[curListing.extra_info]}{' '}
                              </span>
                            ) : (
                              ''
                            )}
                            {curListing.title}{' '}
                            <TextComponent type="tertiary">
                              ({toSeasonString(curListing.season_code)})
                            </TextComponent>
                          </span>
                        </Row>
                      </Modal.Title>

                      <Row className={clsx(styles.badges, 'mx-auto mt-1')}>
                        {/* Course Codes */}
                        <p className={clsx(styles.courseCodes, 'my-0 pr-2')}>
                          <TextComponent type="tertiary">
                            {curListing.all_course_codes.join(' • ')}
                          </TextComponent>
                        </p>
                        {/* Course Skills and Areas */}
                        {curListing.skills.map((skill) => (
                          <SkillBadge skill={skill} key={skill} />
                        ))}
                        {curListing.areas.map((area) => (
                          <SkillBadge skill={area} key={area} />
                        ))}
                      </Row>
                    </Col>
                  </Row>
                </div>
              ) : (
                // Viewing course evaluation
                <div>
                  <Row className="m-auto">
                    <Col xs="auto" className="my-auto p-0">
                      {/* Back to overview arrow */}
                      <LinkLikeText
                        onClick={() => {
                          if (
                            listings.length > 1 &&
                            curListing.crn === view.crn &&
                            curListing.season_code === view.season_code
                          ) {
                            // Go to overview of previous listing
                            setListings(listings.slice(0, -1));
                          }
                          setView('overview');
                        }}
                        className={styles.backArrow}
                      >
                        <IoMdArrowRoundBack size={30} />
                      </LinkLikeText>
                    </Col>
                    <Col className="p-0 ml-3">
                      {/* Course Title */}
                      <Modal.Title>
                        <Row className="mx-auto mt-1 align-items-center">
                          <span className={styles.modalTitle}>
                            {view.title}{' '}
                            <TextComponent type="tertiary">
                              ({toSeasonString(view.season_code)})
                            </TextComponent>
                            {/* TODO */}
                            {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
                            <span
                              className={clsx(styles.moreInfo, 'mt-auto ml-2')}
                              onClick={() => {
                                // Go to overview page of this eval course
                                setView('overview');
                                setListings([...listings, view]);
                              }}
                            >
                              More Info
                            </span>
                          </span>
                        </Row>
                      </Modal.Title>

                      <Row className={clsx(styles.badges, 'mx-auto mt-1')}>
                        {/* Course Code */}
                        <p className={clsx(styles.courseCodes, 'my-0 pr-2')}>
                          <TextComponent type="tertiary">
                            {view.course_code}
                          </TextComponent>
                        </p>
                        {/* Course Skills and Areas */}
                        {view.skills.map((skill) => (
                          <SkillBadge skill={skill} key={skill} />
                        ))}
                        {view.areas.map((area) => (
                          <SkillBadge skill={area} key={area} />
                        ))}
                        {/* Course Professors and Section */}
                        {view.professor_names.length > 0 && (
                          <p
                            className={clsx(
                              styles.courseCodes,
                              'my-0',
                              (view.skills.length || view.areas.length) &&
                                'pl-2',
                            )}
                          >
                            <TextComponent type="tertiary">
                              | {view.professor_names.join(', ')} | Section{' '}
                              {view.section}
                            </TextComponent>
                          </p>
                        )}
                      </Row>
                    </Col>
                  </Row>
                </div>
              )}
            </Container>
            {/* Share Button */}
            <div className="align-self-center">
              <ShareButton courseCode={curListing.course_code} />
            </div>
          </Modal.Header>
          {listing &&
            (view === 'overview' ? (
              // Show overview data
              <CourseModalOverview
                setFilter={setFilter}
                filter={filter}
                setView={setView}
                listing={curListing}
              />
            ) : (
              // Show eval data
              <CourseModalEvaluations
                seasonCode={view.season_code}
                crn={view.crn}
                courseCode={view.course_code}
              />
            ))}
        </Modal>
      )}
    </div>
  );
}

export default CourseModal;
