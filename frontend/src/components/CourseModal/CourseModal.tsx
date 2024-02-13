import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Col, Container, Row, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { FaRegShareFromSquare } from 'react-icons/fa6';
import clsx from 'clsx';

import WorksheetToggleButton from '../Worksheet/WorksheetToggleButton';
import styles from './CourseModal.module.css';
import { TextComponent, LinkLikeText } from '../Typography';
import SkillBadge from '../SkillBadge';
import { suspended } from '../../utilities/display';
import { toSeasonString } from '../../utilities/course';
import { useFerry } from '../../contexts/ferryContext';
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
      size={20}
      color="#007bff"
      className={styles.shareButton}
    />
  );
}

function ViewTabs({
  view,
  setView,
}: {
  readonly view: 'overview' | 'evals';
  readonly setView: React.Dispatch<React.SetStateAction<'overview' | 'evals'>>;
}) {
  return (
    <div className={styles.tabs}>
      {(
        [
          { label: 'Overview', value: 'overview' },
          { label: 'Evaluations', value: 'evals' },
        ] as const
      ).map(({ label, value }) => (
        <button
          key={value}
          aria-current={view === value}
          type="button"
          onClick={() => setView(value)}
          className={clsx(
            styles.tabButton,
            view === value && styles.tabSelected,
          )}
        >
          {label}
        </button>
      ))}
    </div>
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
  const { requestSeasons, courses } = useFerry();

  const [view, setView] = useState<'overview' | 'evals'>('overview');
  // Stack for listings that the user has viewed
  const [history, setHistory] = useState<Listing[]>([]);
  useEffect(() => {
    if (history.length !== 0) return;
    const courseModal = searchParams.get('course-modal');
    if (!courseModal) return;
    const [seasonCode, crn] = courseModal.split('-') as [Season, string];
    requestSeasons([seasonCode]);
    const listingFromQuery = courses[seasonCode]?.get(Number(crn) as Crn);
    if (!listingFromQuery) return;
    setHistory([listingFromQuery]);
  }, [history.length, searchParams, requestSeasons, courses]);
  const listing = history[history.length - 1];

  if (!listing) return null;
  return (
    <div className="d-flex justify-content-center">
      <Modal
        show={Boolean(listing)}
        scrollable
        onHide={() => {
          setHistory([]);
          setView('overview');
          setSearchParams((prev) => {
            prev.delete('course-modal');
            return prev;
          });
        }}
        dialogClassName={styles.dialog}
        animation={false}
        centered
      >
        <Modal.Header closeButton>
          <Container className="p-0 ml-2" fluid>
            <Row className={clsx('m-auto', styles.modalTop)}>
              <Col xs="auto" className="my-auto p-0">
                {history.length > 1 && (
                  // If this is the overview of some other eval course,
                  // show back button
                  <LinkLikeText
                    onClick={() => {
                      setHistory(history.slice(0, -1));
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
                      {listing.extra_info !== 'ACTIVE' ? (
                        <span className={styles.cancelledText}>
                          {extraInfoMap[listing.extra_info]}{' '}
                        </span>
                      ) : (
                        ''
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
            <Row className="ml-auto mr-2 justify-content-between flex-wrap-reverse">
              <ViewTabs view={view} setView={setView} />
              <Row>
                <WorksheetToggleButton
                  crn={listing.crn}
                  seasonCode={listing.season_code}
                  modal
                />
                <ShareButton courseCode={listing.course_code} />
              </Row>
            </Row>
          </Container>
        </Modal.Header>
        {view === 'overview' ? (
          // Show overview data
          <CourseModalOverview
            gotoCourse={(l) => {
              if (
                l.crn === listing.crn &&
                l.season_code === listing.season_code
              )
                return;
              setHistory([...history, l]);
              setSearchParams((prev) => {
                prev.set('course-modal', `${l.season_code}-${l.crn}`);
                return prev;
              });
            }}
            listing={listing}
          />
        ) : (
          // Show eval data
          <CourseModalEvaluations
            seasonCode={listing.season_code}
            crn={listing.crn}
          />
        )}
      </Modal>
    </div>
  );
}

export default CourseModal;
