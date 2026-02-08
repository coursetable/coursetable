import React, { type ReactNode } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Form, Badge } from 'react-bootstrap';

import { useShallow } from 'zustand/react/shallow';
import {
  useModalHistory,
  type Store,
} from '../../../contexts/modalHistoryContext';
import type { CourseModalOverviewDataQuery } from '../../../generated/graphql-types';
import { useStore } from '../../../store';
import { ratingColormap } from '../../../utilities/constants';
import { isDiscussionSection } from '../../../utilities/course';
import { createProfModalLink } from '../../../utilities/display';
import RelatedCoursesList from '../../RelatedCoursesList';
import type { ModalNavigationFunction } from '../CourseModal';

type RelatedCourseInfo = CourseModalOverviewDataQuery['sameCourse'][number];

function createProfSummary(
  courseProfessors: RelatedCourseInfo['course_professors'],
  navigate: Store['navigate'],
  searchParams: URLSearchParams,
) {
  const profsByName = courseProfessors.toSorted((a, b) =>
    a.professor.name.localeCompare(b.professor.name, 'en-US'),
  );
  const names = profsByName.map((prof) => prof.professor.name);
  const links = (
    <>
      {profsByName.map((prof, i) => {
        // TODO: TS doesn't understand how to map over an intersection of arrays
        const professor =
          prof.professor as RelatedCourseInfo['course_professors'][number]['professor'];
        return (
          <React.Fragment key={professor.professor_id}>
            <Link
              key={professor.professor_id}
              to={createProfModalLink(professor.professor_id, searchParams)}
              onClick={() => {
                navigate('push', {
                  type: 'professor',
                  data: professor.professor_id,
                });
              }}
            >
              {prof.professor.name}
            </Link>
            {professor.average_rating && (
              <>
                {' '}
                <Badge
                  bg="none"
                  className="mx-1 mb-1"
                  style={{
                    backgroundColor: ratingColormap(
                      professor.average_rating,
                    ).css(),
                    color: 'var(--color-text-dark)',
                  }}
                >
                  {professor.average_rating.toFixed(1)}
                </Badge>
              </>
            )}
            {i < courseProfessors.length - 1 ? ' • ' : ''}
          </React.Fragment>
        );
      })}
    </>
  );
  return { key: names.join(' • '), links };
}

function OverviewRatings({
  onNavigation,
  listing,
  sameCourse,
}: {
  readonly onNavigation: ModalNavigationFunction;
  readonly listing: NonNullable<CourseModalOverviewDataQuery['self']>;
  readonly sameCourse: RelatedCourseInfo[];
}) {
  const [searchParams] = useSearchParams();
  const { navigate } = useModalHistory();
  const sameCourseNormalized = sameCourse
    .filter((o) => !isDiscussionSection(o) && o.extra_info === 'ACTIVE')
    .sort(
      (a, b) =>
        b.season_code.localeCompare(a.season_code, 'en-US') ||
        parseInt(a.section, 10) - parseInt(b.section, 10),
    );

  const { groupSameProf, togglePref } = useStore(
    useShallow((state) => ({
      groupSameProf: state.coursePref.groupSameProf,
      togglePref: state.togglePref,
    })),
  );
  const coursesByProf = new Map<
    string,
    { title: ReactNode; courses: RelatedCourseInfo[] }
  >();
  // We need to add the listing's professor first, so it appears first in
  // the list
  const { key: listingProfKey, links: listingProfLinks } = createProfSummary(
    listing.course.course_professors,
    navigate,
    searchParams,
  );
  coursesByProf.set(listingProfKey, { title: listingProfLinks, courses: [] });
  for (const course of sameCourseNormalized) {
    const { key, links } = createProfSummary(
      course.course_professors,
      navigate,
      searchParams,
    );
    if (!coursesByProf.has(key))
      coursesByProf.set(key, { title: links, courses: [course] });
    else coursesByProf.get(key)!.courses.push(course);
  }
  return (
    <>
      {sameCourseNormalized.length !== 0 ? (
        <>
          <Form.Check type="switch" className="mb-3">
            <Form.Check.Input
              checked={groupSameProf}
              onChange={() => {
                togglePref('coursePref', 'groupSameProf');
              }}
            />
            <Form.Check.Label
              onClick={() => {
                togglePref('coursePref', 'groupSameProf');
              }}
            >
              Group by professors
            </Form.Check.Label>
          </Form.Check>
          <RelatedCoursesList
            listing={listing}
            courses={groupSameProf ? coursesByProf : sameCourseNormalized}
            usesSameCourse
            columns={
              groupSameProf
                ? ['rating', 'workload']
                : ['rating', 'professor', 'workload']
            }
            columnWidth={2}
            onNavigation={onNavigation}
            extraText={(c) =>
              groupSameProf
                ? `Section ${c.section}`
                : c.course_professors.length === 0
                  ? 'TBA'
                  : `${c.course_professors[0]!.professor.name}${c.course_professors.length > 1 ? ` +${c.course_professors.length - 1}` : ''}`
            }
          />
        </>
      ) : (
        <div className="m-auto text-center">
          <strong>No results</strong>
        </div>
      )}
    </>
  );
}

export default OverviewRatings;
