import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Col, Container, Row, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { FaRegShareFromSquare } from 'react-icons/fa6';
import clsx from 'clsx';

import type { Filter, ComputedListingInfo } from './CourseModalOverview';
import WorksheetToggleButton from '../Worksheet/WorksheetToggleButton';
import styles from './CourseModal.module.css';
import { TextComponent, LinkLikeText } from '../Typography';
import SkillBadge from '../SkillBadge';
import { suspended } from '../../utilities/display';
import { toSeasonString } from '../../utilities/course';
import { useCourseData } from '../../contexts/ferryContext';
import type { Season, Crn, Listing } from '../../utilities/common';

const extraInfoMap: { [info in ComputedListingInfo['extra_info']]: string } = {
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
  const navigate = useNavigate();

  const courseModal = searchParams.get('course-modal');
  // `view` is either "overview" or "evals"
  const [seasonCode, crn, view = 'overview'] = courseModal
    ? (courseModal.split('-') as [Season, string, string?])
    : [null, null];
  const { courses, loading } = useCourseData(seasonCode ? [seasonCode] : []);

  // Keep showing old data until new data is loaded
  const [listing, setListing] = useState<Listing | undefined>(undefined);
  useEffect(() => {
    if (loading) return;
    setListing(
      seasonCode ? courses[seasonCode]?.get(Number(crn) as Crn) : undefined,
    );
  }, [loading, seasonCode, crn, courses]);

  // Current evaluation filter (both, course, professor)
  const [filter, setFilter] = useState<Filter>('both');

  if (!listing) return null;

  return (
    <div className="d-flex justify-content-center">
      <Modal
        show
        scrollable
        onHide={() => {
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
                    <WorksheetToggleButton
                      crn={listing.crn}
                      seasonCode={listing.season_code}
                      modal
                    />
                  </Col>
                  <Col className="p-0 ml-3">
                    {/* Course Title */}
                    <Modal.Title>
                      <Row className="mx-auto mt-1 align-items-center">
                        <span className={styles.modalTitle}>
                          {listing.extra_info !== 'ACTIVE' && (
                            <span className={styles.cancelledText}>
                              {extraInfoMap[listing.extra_info]}{' '}
                            </span>
                          )}
                          {listing.title}{' '}
                          <TextComponent type="tertiary">
                            ({toSeasonString(listing.season_code)})
                          </TextComponent>
                        </span>
                      </Row>
                    </Modal.Title>

                    <Row className={clsx(styles.badges, 'mx-auto mt-1')}>
                      {/* Course Codes */}
                      <p className={clsx(styles.courseCodes, 'my-0 pr-2')}>
                        <TextComponent type="tertiary">
                          {listing.all_course_codes.join(' • ')}
                        </TextComponent>
                      </p>
                      {/* Course Skills and Areas */}
                      {listing.skills.map((skill) => (
                        <SkillBadge skill={skill} key={skill} />
                      ))}
                      {listing.areas.map((area) => (
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
                      onClick={() => navigate(-1)}
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
                          {listing.title}{' '}
                          <TextComponent type="tertiary">
                            ({toSeasonString(listing.season_code)})
                          </TextComponent>
                          {/* TODO */}
                          {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
                          <span
                            className={clsx(styles.moreInfo, 'mt-auto ml-2')}
                            onClick={() => {
                              setSearchParams((prev) => {
                                prev.set(
                                  'course-modal',
                                  `${listing.season_code}-${listing.crn}`,
                                );
                                return prev;
                              });
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
                          {listing.course_code}
                        </TextComponent>
                      </p>
                      {/* Course Skills and Areas */}
                      {listing.skills.map((skill) => (
                        <SkillBadge skill={skill} key={skill} />
                      ))}
                      {listing.areas.map((area) => (
                        <SkillBadge skill={area} key={area} />
                      ))}
                      {/* Course Professors and Section */}
                      {listing.professor_names.length > 0 && (
                        <p
                          className={clsx(
                            styles.courseCodes,
                            'my-0',
                            (listing.skills.length || listing.areas.length) &&
                              'pl-2',
                          )}
                        >
                          <TextComponent type="tertiary">
                            | {listing.professor_names.join(', ')} | Section{' '}
                            {listing.section}
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
            <ShareButton courseCode={listing.course_code} />
          </div>
        </Modal.Header>
        {view === 'overview' ? (
          // Show overview data
          <CourseModalOverview
            setFilter={setFilter}
            filter={filter}
            listing={listing}
          />
        ) : (
          // Show eval data
          <CourseModalEvaluations listing={listing} />
        )}
      </Modal>
    </div>
  );
}

export default CourseModal;
