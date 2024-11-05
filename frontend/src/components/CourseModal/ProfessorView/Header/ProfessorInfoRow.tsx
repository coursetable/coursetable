import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import { IoMdArrowRoundBack } from 'react-icons/io';

import { extraInfo } from '../../../../utilities/constants';
import { toSeasonString } from '../../../../utilities/course';
import { createCourseModalLink } from '../../../../utilities/display';
import SkillBadge from '../../../SkillBadge';
import { TextComponent } from '../../../Typography';
import type {
  ModalNavigationFunction,
  CourseModalHeaderData,
} from '../../CourseModal';
import styles from './InfoRow.module.css';
import { CourseInfo } from '../../DefaultView/OverviewPanel/OverviewInfo';

export default function ProfessorModalHeaderInfo({
  listing,
  professor,
  disableProfessorView,
  backTarget,
  onNavigation,
}: {
  readonly listing: CourseModalHeaderData;
  professor: CourseInfo['course_professors'][number]['professor'] | null;
  disableProfessorView: () => void;
  readonly backTarget: string | undefined;
  readonly onNavigation: ModalNavigationFunction;
}) {
  const [searchParams] = useSearchParams();
  return (
    <div className={styles.modalTop}>
      {/* {backTarget && (
        <Link
          to={backTarget}
          onClick={() => {
            onNavigation('pop', undefined, 'overview');
          }}
          className={styles.backArrow}
        >
          <IoMdArrowRoundBack size={30} />
        </Link>
      )} */}
      <Link
        to="#"
        onClick={(e) => {
          e.preventDefault();
          disableProfessorView();
        }}
        className={styles.backArrow}
      >
        <IoMdArrowRoundBack size={30} />
      </Link>
      <div>
        <Modal.Title>
          <div className={styles.modalTitle}>
            {listing.course.extra_info !== 'ACTIVE' ? (
              <span className={styles.cancelledText}>
                {extraInfo[listing.course.extra_info]}{' '}
              </span>
            ) : (
              ''
            )}
            {professor?.name}{' '}
            {/* <TextComponent type="tertiary">
              ({toSeasonString(listing.season_code)})
            </TextComponent> */}
          </div>
        </Modal.Title>
        <TextComponent type="tertiary">{professor?.email}</TextComponent>
        <div className={styles.badges}>
          <p className={styles.courseCodes}>
            <TextComponent type="tertiary">
              {listing.course.listings.map((l, i) => (
                <React.Fragment key={l.crn}>
                  {i > 0 && ' • '}
                  {l.crn === listing.crn ? (
                    // Make current listing appear more important in case
                    // of cross-listings; otherwise other links are
                    // underlined and are more prominent than this one
                    listing.course.listings.length > 1 ? (
                      <b>{l.course_code}</b>
                    ) : (
                      l.course_code
                    )
                  ) : (
                    <Link
                      className={styles.crossListingLink}
                      to={createCourseModalLink(
                        { crn: l.crn, season_code: listing.season_code },
                        searchParams,
                      )}
                      // We replace instead of pushing to history. I don't
                      // think navigating between cross-listings should be
                      // treated as an actual navigation
                      onClick={() => {
                        onNavigation(
                          'replace',
                          { ...listing, ...l },
                          'overview',
                        );
                      }}
                    >
                      {l.course_code}
                    </Link>
                  )}
                </React.Fragment>
              ))}{' '}
              | {toSeasonString(listing.season_code)}
            </TextComponent>
          </p>
          {[...listing.course.skills, ...listing.course.areas].map((skill) => (
            <SkillBadge skill={skill} key={skill} />
          ))}
        </div>
      </div>
    </div>
  );
}
