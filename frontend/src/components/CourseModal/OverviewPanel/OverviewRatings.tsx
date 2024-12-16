import React, { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import clsx from 'clsx';
import MultiToggle from 'react-multi-toggle';

import { useModalHistory } from '../../../contexts/modalHistoryContext';
import type { CourseModalOverviewDataQuery } from '../../../generated/graphql-types';
import { isDiscussionSection } from '../../../utilities/course';
import { createProfModalLink } from '../../../utilities/display';
import RelatedCoursesList from '../../RelatedCoursesList';
import type { ModalNavigationFunction } from '../CourseModal';

import styles from './OverviewRatings.module.css';
import './react-multi-toggle-override.css';

type Filter = 'both' | 'course' | 'professor';

type RelatedCourseInfo = CourseModalOverviewDataQuery['sameCourse'][number];

// Hold index of each filter option
const optionsIndx = {
  course: 0,
  both: 1,
  professor: 2,
};

function haveSameProfessors(
  course1: Pick<RelatedCourseInfo, 'course_professors'>,
  course2: Pick<RelatedCourseInfo, 'course_professors'>,
) {
  const aProfIds = course1.course_professors
    // @ts-expect-error: the GraphQL-codegen types are wrong because it doesn't
    // know that fragments are deep merged
    .map((p) => p.professor.professor_id as number)
    .sort((a, b) => a - b);
  const bProfIds = course2.course_professors
    // @ts-expect-error: the GraphQL-codegen types are wrong because it doesn't
    // know that fragments are deep merged
    .map((p) => p.professor.professor_id as number)
    .sort((a, b) => a - b);
  return (
    aProfIds.length === bProfIds.length &&
    aProfIds.every((id, i) => id === bProfIds[i])
  );
}

function OverviewRatings({
  onNavigation,
  listing,
  sameCourse,
}: {
  readonly onNavigation: ModalNavigationFunction;
  readonly listing: CourseModalOverviewDataQuery['self'][0];
  readonly sameCourse: RelatedCourseInfo[];
}) {
  const [searchParams] = useSearchParams();
  const { navigate } = useModalHistory();
  const overlapSections = useMemo(() => {
    const sameCourseNormalized = sameCourse
      .filter((o) => !isDiscussionSection(o))
      .sort(
        (a, b) =>
          b.season_code.localeCompare(a.season_code, 'en-US') ||
          parseInt(a.section, 10) - parseInt(b.section, 10),
      );
    const both = sameCourseNormalized.filter((o) =>
      haveSameProfessors(o, listing.course),
    );
    return {
      course: sameCourseNormalized,
      both,
    };
  }, [sameCourse, listing]);

  const options = [
    {
      displayName: `Course (${overlapSections.course.length})`,
      value: 'course',
    },
    { displayName: `Both (${overlapSections.both.length})`, value: 'both' },
    {
      displayName: 'Prof',
      value: 'professor',
    },
  ] as const;
  const [filter, setFilter] = useState<Filter>('both');
  return (
    <>
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
      <div
        className={styles.filterContainer}
        onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
          // Left/right arrow key
          const newIndx = ((optionsIndx[filter] +
            (e.key === 'ArrowLeft' ? 2 : e.key === 'ArrowRight' ? 1 : 0)) %
            3) as 0 | 1 | 2;
          setFilter(options[newIndx].value);
        }}
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        tabIndex={0}
      >
        <MultiToggle
          options={options}
          selectedOption={filter}
          onSelectOption={(val) => setFilter(val)}
          className={clsx(styles.evaluationsFilter, 'mb-2')}
        />
      </div>
      {filter === 'professor' ? (
        <div className="alert alert-info m-3">
          <p>
            We've moved! To view course offerings by each professor, click on
            their name on the left, or select from the list below.
          </p>
          <ul>
            {listing.course.course_professors.map((prof) => (
              <li key={prof.professor.professor_id}>
                <Link
                  to={createProfModalLink(
                    prof.professor.professor_id,
                    searchParams,
                  )}
                  onClick={() => {
                    navigate('push', {
                      type: 'professor',
                      data: prof.professor.professor_id,
                    });
                  }}
                >
                  {prof.professor.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : overlapSections[filter].length !== 0 ? (
        <RelatedCoursesList
          listing={listing}
          courses={overlapSections[filter]}
          usesSameCourse
          columns={['rating', 'professor', 'workload']}
          columnWidth={2}
          onNavigation={onNavigation}
          extraText={(c) =>
            filter === 'both'
              ? `Section ${c.section}`
              : c.course_professors.length === 0
                ? 'TBA'
                : `${c.course_professors[0]!.professor.name}${c.course_professors.length > 1 ? ` +${c.course_professors.length - 1}` : ''}`
          }
        />
      ) : (
        <div className="m-auto text-center">
          <strong>No Results</strong>
        </div>
      )}
    </>
  );
}

export default OverviewRatings;
