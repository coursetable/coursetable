import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import { Helmet } from 'react-helmet';

import ModalHeaderControls from './Header/ControlsRow';
import ModalHeaderInfo from './Header/InfoRow';
import type { CourseInfo } from './OverviewPanel/OverviewInfo';
import ProfessorModalHeaderControls from './ProfessorHeader/ProfessorControlsRow';
import ProfessorModalHeaderInfo from './ProfessorHeader/ProfessorInfoRow';
import { useFerry } from '../../contexts/ferryContext';
import type { CourseModalPrefetchListingDataFragment } from '../../generated/graphql-types';
import { useCourseModalFromUrlQuery } from '../../queries/graphql-queries';
import type { Season, Crn } from '../../queries/graphql-types';
import { useStore } from '../../store';
import {
  toSeasonDate,
  toSeasonString,
  truncatedText,
} from '../../utilities/course';
import { suspended, createCourseModalLink } from '../../utilities/display';
import styles from './CourseModal.module.css';

// We can only split subviews of CourseModal because CourseModal contains core
// logic that determines whether itself is visible.
// Maybe we should split more code into the subviews?
const OverviewPanel = suspended(() => import('./OverviewPanel/OverviewPanel'));
const EvaluationsPanel = suspended(
  () => import('./EvaluationsPanel/EvaluationsPanel'),
);

export type ModalNavigationFunction = ((
  mode: 'push' | 'replace',
  l: CourseModalPrefetchListingDataFragment,
  target: 'evals' | 'overview',
) => void) &
  ((mode: 'pop', l: undefined, target: 'evals' | 'overview') => void) &
  ((mode: 'change-view', l: undefined, target: 'evals' | 'overview') => void);

function parseQuery(courseModalQuery: string | null) {
  if (!courseModalQuery) return undefined;
  const [seasonCode, crn] = courseModalQuery.split('-') as [Season, string];
  if (!seasonCode || !crn) return undefined;
  return { seasonCode, crn: Number(crn) as Crn };
}

function useCourseInfoFromURL(
  isInitial: boolean,
): CourseModalPrefetchListingDataFragment | undefined {
  const user = useStore((state) => state.user);
  const [searchParams] = useSearchParams();
  const courseModal = searchParams.get('course-modal');
  const variables = parseQuery(courseModal);
  const { courses } = useFerry();
  // If the season is in the static catalog, we can just use that instead of
  // fetching GraphQL
  const hasStaticCatalog = variables && variables.seasonCode in courses;
  const { data } = useCourseModalFromUrlQuery({
    // If variables is undefined, the query will not be sent
    variables: { ...variables!, hasEvals: Boolean(user?.hasEvals) },
    skip: !variables || !isInitial || hasStaticCatalog,
  });
  if (hasStaticCatalog)
    return courses[variables.seasonCode]!.data.get(variables.crn);
  return data?.listings[0];
}

function useProfessorInfoFromURL(
  isInitial: boolean,
  listing: CourseModalPrefetchListingDataFragment | undefined,
): CourseInfo['course_professors'][number]['professor'] | null {
  const [searchParams] = useSearchParams();

  if (!isInitial || !listing) return null;

  const profIdParam = searchParams.get('prof');
  if (!profIdParam) return null;

  const matchingProfessor =
    listing.course.course_professors.find(
      (professorObj) =>
        professorObj.professor.professor_id === parseInt(profIdParam, 10),
    )?.professor || null;

  return matchingProfessor | null;
}

function CourseModal() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [view, setView] = useState<'overview' | 'evals'>('overview');
  // Stack for listings that the user has viewed
  const [history, setHistory] = useState<
    CourseModalPrefetchListingDataFragment[]
  >([]);
  const infoFromURL = useCourseInfoFromURL(history.length === 0);
  if (history.length === 0 && infoFromURL) setHistory([infoFromURL]);

  const [professorView, setProfessorView] = useState<
    CourseInfo['course_professors'][number]['professor'] | null
  >(null);

  // This will update when history updates
  const listing = history[history.length - 1];
  if (!listing) return null;
  const backTarget =
    history.length > 1
      ? createCourseModalLink(history[history.length - 2], searchParams)
      : undefined;

  const title = `${listing.course_code} ${listing.course.section.padStart(2, '0')}: ${listing.course.title} - Yale ${toSeasonString(listing.course.season_code)} | CourseTable`;
  const description = truncatedText(
    listing.course.description,
    300,
    'No description available',
  );
  const onNavigation: ModalNavigationFunction = (mode, l, target) => {
    if (mode === 'pop') {
      setView('overview');
      setHistory(history.slice(0, -1));
    } else if (mode === 'change-view') {
      setView(target);
    } else {
      const nextView =
        // Only actually navigate to evals if the course has evals
        target === 'evals' && l!.course.evaluation_statistic
          ? 'evals'
          : 'overview';
      setView(nextView);
      if (
        l!.crn === listing.crn &&
        l!.course.season_code === listing.course.season_code
      )
        return;
      if (mode === 'replace') setHistory([...history.slice(0, -1), l!]);
      else setHistory([...history, l!]);
    }
  };
  const hide = () => {
    setHistory([]);
    setProfessorView(null);
    setView('overview');
    setSearchParams((prev) => {
      prev.delete('course-modal');
      prev.delete('prof');
      return prev;
    });
  };
  const structuredJSON = JSON.stringify({
    '@context': 'https://schema.org/',
    name: { title },
    description: { description },
    datePublished: toSeasonDate(listing.course.season_code),
  });

  // UseEffect(() => {
  //   const profIdParam = searchParams.get('prof');
  //   if (profIdParam) {
  //     //matching prof:
  //     const matchingProfessor =
  //       listing.course.course_professors.find(
  //         (professorObj) =>
  //           professorObj.professor.professor_id === parseInt(profIdParam),
  //       )?.professor || null;

  //     // setProfessorView(matchingProfessor && null);
  //     console.log('hello');
  //   } else {
  //     setProfessorView(null);
  //   }
  // }, [searchParams]);

  return (
    <div className="d-flex justify-content-center">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <script className="structured-data-list" type="application/ld+json">
          {structuredJSON}
        </script>
      </Helmet>
      <Modal
        show={Boolean(listing)}
        scrollable
        onHide={hide}
        dialogClassName={styles.dialog}
        animation={false}
        centered
      >
        <Modal.Header className={styles.modalHeader} closeButton>
          {professorView ? (
            <>
              <ProfessorModalHeaderInfo
                listing={listing}
                professor={professorView}
                disableProfessorView={() => setProfessorView(null)}
                onNavigation={onNavigation}
              />
              <br />
              {/* <ProfessorModalHeaderControls
                listing={listing}
                view={view}
                setView={setView}
                hide={hide}
              /> */}
            </>
          ) : (
            <>
              <ModalHeaderInfo
                listing={listing}
                backTarget={backTarget}
                onNavigation={onNavigation}
              />
              <ModalHeaderControls
                listing={listing}
                view={view}
                setView={setView}
                hide={hide}
              />
            </>
          )}
        </Modal.Header>
        <Modal.Body>
          {view === 'overview' ? (
            <OverviewPanel
              onNavigation={onNavigation}
              prefetched={listing}
              professorView={professorView}
              setProfessorView={setProfessorView}
            />
          ) : (
            <EvaluationsPanel
              seasonCode={listing.course.season_code}
              crn={listing.crn}
            />
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default CourseModal;
