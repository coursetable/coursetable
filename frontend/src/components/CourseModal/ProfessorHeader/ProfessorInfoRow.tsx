import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import { IoMdArrowRoundBack } from 'react-icons/io';

import type { Option } from '../../../contexts/searchContext';
import type {
  CourseSectionsQuery,
  CourseModalPrefetchListingDataFragment,
} from '../../../generated/graphql-types';
import { useCourseSectionsQuery } from '../../../queries/graphql-queries';
import { useStore } from '../../../store';
import { extraInfo } from '../../../utilities/constants';
import {
  toWeekdaysDisplayString,
  to12HourTime,
  toSeasonString,
  truncatedText,
} from '../../../utilities/course';
import { createCourseModalLink } from '../../../utilities/display';
import { Popout } from '../../Search/Popout';
import { PopoutSelect } from '../../Search/PopoutSelect';
import SkillBadge from '../../SkillBadge';
import { TextComponent } from '../../Typography';
import type { ModalNavigationFunction } from '../CourseModal';
import styles from './ProfessorInfoRow.module.css';
import { CourseInfo } from '../OverviewPanel/OverviewInfo';

function SectionLink({
  section,
  hasDifferentTitles,
  onNavigation,
}: {
  readonly section: CourseSectionsQuery['listings'][number];
  readonly hasDifferentTitles: boolean;
  readonly onNavigation: ModalNavigationFunction;
}) {
  const [searchParams] = useSearchParams();
  const timeString = section.course.course_meetings
    .map(
      (session) =>
        `${toWeekdaysDisplayString(session.days_of_week)} ${to12HourTime(session.start_time)}–${to12HourTime(session.end_time)}`,
    )
    .join(', ');
  const professors =
    section.course.course_professors
      .map((professor) => professor.professor.name)
      .join(' • ') || 'TBA';

  return (
    <Link
      to={createCourseModalLink(section, searchParams)}
      onClick={() => {
        onNavigation('replace', section, 'overview');
      }}
      className={styles.sectionLink}
    >
      <span title={hasDifferentTitles ? section.course.title : undefined}>
        <b>{section.course.section.padStart(2, '0')}</b>{' '}
        {hasDifferentTitles && (
          <>
            {truncatedText(section.course.title, 40, '')}
            <br />
          </>
        )}
        <small>
          {professors}
          {timeString ? ' - ' : ''}
          {timeString}
        </small>
      </span>
    </Link>
  );
}

function SectionsDropdown({
  listing,
  sections,
  onNavigation,
}: {
  readonly listing: CourseModalPrefetchListingDataFragment;
  readonly sections: CourseSectionsQuery['listings'];
  readonly onNavigation: ModalNavigationFunction;
}) {
  const hasDifferentTitles =
    new Set(sections.map((section) => section.course.title)).size > 1;
  const sectionsOptions: Map<string, Option> = new Map<string, Option>(
    // @ts-expect-error: TODO it actually works to have a ReactNode as label
    sections.map((section) => [
      section.course.section,
      {
        value: section.course.section.padStart(2, '0'),
        label: (
          <SectionLink
            section={section}
            hasDifferentTitles={hasDifferentTitles}
            onNavigation={onNavigation}
          />
        ),
      },
    ]),
  );

  return (
    <Popout
      buttonText={listing.course.section.padStart(2, '0')}
      selectedOptions={sectionsOptions.get(listing.course.section)}
      clearIcon={false}
      className={styles.sectionsDropdownButton}
      wrapperClassName={styles.sectionsDropdown}
    >
      <PopoutSelect<Option, false>
        className={styles.sectionsDropdownSelect}
        value={sectionsOptions.get(listing.course.section)}
        options={[...sectionsOptions.values()]}
        isSearchable={false}
        showControl={false}
      />
    </Popout>
  );
}

export default function ProfessorModalHeaderInfo({
  listing,
  professor,
  disableProfessorView,
  onNavigation,
}: {
  readonly listing: CourseModalPrefetchListingDataFragment;
  professor: CourseInfo['course_professors'][number]['professor'] | null;
  disableProfessorView: () => void;
  readonly onNavigation: ModalNavigationFunction;
}) {
  const user = useStore((state) => state.user);
  const [searchParams, setSearchParams] = useSearchParams();
  const courseCode = listing.course_code;
  const season = listing.course.season_code;
  const { data, loading, error } = useCourseSectionsQuery({
    variables: {
      courseCode,
      seasonCode: season,
      hasEvals: Boolean(user?.hasEvals),
    },
  });
  const sections =
    loading || error || !data?.listings
      ? []
      : [...data.listings].sort((a, b) =>
          a.course.section.localeCompare(b.course.section, 'en-US', {
            numeric: true,
          }),
        );
  return (
    <div className={styles.modalTop}>
      <Link
        to="#"
        onClick={(e) => {
          e.preventDefault();
          setSearchParams((prev) => {
            prev.delete('prof');
            return prev;
          });
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
            {professor?.name}
          </div>
        </Modal.Title>

        <div className={styles.badges}>
          <p className={styles.courseCodes}>
            <TextComponent type="tertiary">Professor</TextComponent>
          </p>
        </div>
      </div>
    </div>
  );
}
