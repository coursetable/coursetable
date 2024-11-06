import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import { IoMdArrowRoundBack } from 'react-icons/io';

import type { Option } from '../../../contexts/searchContext';
import type { CourseSectionsQuery } from '../../../generated/graphql-types';
import { useCourseSectionsQuery } from '../../../queries/graphql-queries';
import type { Weekdays } from '../../../queries/graphql-types';
import { extraInfo } from '../../../utilities/constants';
import {
  abbreviateWorkdays,
  to12HourTime,
  toSeasonString,
  truncatedText,
} from '../../../utilities/course';
import { createCourseModalLink } from '../../../utilities/display';
import { Popout } from '../../Search/Popout';
import { PopoutSelect } from '../../Search/PopoutSelect';
import SkillBadge from '../../SkillBadge';
import { TextComponent } from '../../Typography';
import type {
  ModalNavigationFunction,
  CourseModalHeaderData,
} from '../CourseModal';
import styles from './InfoRow.module.css';

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
  const times = new Map<string, Set<Weekdays>>();
  for (const [day, info] of Object.entries(section.course.times_by_day)) {
    for (const [startTime, endTime] of info) {
      const timespan = `${to12HourTime(startTime)}-${to12HourTime(endTime)}`;
      if (!times.has(timespan)) times.set(timespan, new Set());
      times.get(timespan)!.add(day as Weekdays);
    }
  }
  const timeString = [...times.entries()]
    .map(
      ([timespan, days]) =>
        `${abbreviateWorkdays([...days]).join('')} ${timespan}`,
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
        <b>{section.section.padStart(2, '0')}</b>{' '}
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
  readonly listing: CourseModalHeaderData;
  readonly sections: CourseSectionsQuery['listings'];
  readonly onNavigation: ModalNavigationFunction;
}) {
  const hasDifferentTitles =
    new Set(sections.map((section) => section.course.title)).size > 1;
  const sectionsOptions: Map<string, Option> = new Map<string, Option>(
    // @ts-expect-error: TODO it actually works to have a ReactNode as label
    sections.map((section) => [
      section.section,
      {
        value: section.section.padStart(2, '0'),
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
      buttonText={listing.section.padStart(2, '0')}
      selectedOptions={sectionsOptions.get(listing.section)}
      clearIcon={false}
      className={styles.sectionsDropdownButton}
      wrapperClassName={styles.sectionsDropdown}
    >
      <PopoutSelect<Option, false>
        className={styles.sectionsDropdownSelect}
        value={sectionsOptions.get(listing.section)}
        options={[...sectionsOptions.values()]}
        isSearchable={false}
        showControl={false}
      />
    </Popout>
  );
}

export default function ModalHeaderInfo({
  listing,
  backTarget,
  onNavigation,
}: {
  readonly listing: CourseModalHeaderData;
  readonly backTarget: string | undefined;
  readonly onNavigation: ModalNavigationFunction;
}) {
  const [searchParams] = useSearchParams();
  const courseCode = listing.course_code;
  const season = listing.season_code;
  const { data, loading, error } = useCourseSectionsQuery({
    variables: {
      course_code: courseCode,
      season,
    },
  });
  const sections =
    loading || error || !data?.listings
      ? []
      : [...data.listings].sort((a, b) =>
          a.section.localeCompare(b.section, 'en-US', { numeric: true }),
        );
  return (
    <div className={styles.modalTop}>
      {backTarget && (
        <Link
          to={backTarget}
          onClick={() => {
            onNavigation('pop', undefined, 'overview');
          }}
          className={styles.backArrow}
        >
          <IoMdArrowRoundBack size={30} />
        </Link>
      )}
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
            {listing.course.title}{' '}
            <TextComponent type="tertiary">
              ({toSeasonString(listing.season_code)})
            </TextComponent>
            <SectionsDropdown
              listing={listing}
              sections={sections}
              onNavigation={onNavigation}
            />
          </div>
        </Modal.Title>

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
              ))}
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
