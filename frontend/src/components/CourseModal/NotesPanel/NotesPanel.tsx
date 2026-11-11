import { useEffect, useState } from 'react';

import NoteEditor from './NoteEditor';
import PastNotesLinks from './PastNotesLinks';
import type {
  CourseModalOverviewDataQuery,
  CourseModalPrefetchListingDataFragment,
} from '../../../generated/graphql-types';
import { fetchCourseNotes } from '../../../queries/api';
import { useCourseModalOverviewDataQuery } from '../../../queries/graphql-queries';
import { useStore } from '../../../store';
import { getCourseNoteCrn, getListingId } from '../../../utilities/course';
import Spinner from '../../Spinner';
import type { ModalNavigationFunction } from '../CourseModal';

const MAX_OTHER_OFFERINGS = 99;

type Offering = CourseModalOverviewDataQuery['sameCourse'][number];
type LoadedNotes =
  | { content: string; pastOfferings: Offering[] }
  | 'loading'
  | 'failed';

function NotesPanel({
  listing,
  onNavigation,
}: {
  readonly listing: CourseModalPrefetchListingDataFragment;
  readonly onNavigation: ModalNavigationFunction;
}) {
  const [notes, setNotes] = useState<LoadedNotes>('loading');
  const hasEvals = useStore((state) => Boolean(state.user?.hasEvals));
  const { season_code: season } = listing.course;
  const noteCrn = getCourseNoteCrn(listing.course);

  const { data, loading: offeringsLoading } = useCourseModalOverviewDataQuery({
    variables: {
      listingId: getListingId(season, listing.crn),
      hasEvals,
      sameCourseId: listing.course.same_course_id,
    },
  });

  useEffect(() => {
    if (offeringsLoading) return undefined;
    let cancelled = false;
    // A failed offerings query only hides the links; the note still loads
    const otherOfferings = (data?.sameCourse ?? [])
      .filter(
        (offering) =>
          // Some course records have no listings, so they can't have a note
          offering.listings.length > 0 &&
          (offering.season_code !== season ||
            getCourseNoteCrn(offering) !== noteCrn),
      )
      .sort(
        (a, b) =>
          b.season_code.localeCompare(a.season_code, 'en-US') ||
          parseInt(a.section, 10) - parseInt(b.section, 10),
      )
      .slice(0, MAX_OTHER_OFFERINGS);

    void fetchCourseNotes([
      { season, crn: noteCrn },
      ...otherOfferings.map((offering) => ({
        season: offering.season_code,
        crn: getCourseNoteCrn(offering),
      })),
    ]).then((res) => {
      if (cancelled) return;
      if (!res) {
        setNotes('failed');
        return;
      }
      const hasNote = (noteSeason: string, crn: number) =>
        res.data.some(
          (note) =>
            note.season === noteSeason && note.crn === crn && note.content,
        );
      setNotes({
        content:
          res.data.find(
            (note) => note.season === season && note.crn === noteCrn,
          )?.content ?? '',
        pastOfferings: otherOfferings.filter((offering) =>
          hasNote(offering.season_code, getCourseNoteCrn(offering)),
        ),
      });
    });
    return () => {
      cancelled = true;
    };
  }, [data, noteCrn, offeringsLoading, season]);

  if (notes === 'loading') return <Spinner message="Loading your note..." />;
  // The editor stays closed so a failed load can't overwrite the saved note
  if (notes === 'failed') return <p>Couldn't load your note.</p>;

  return (
    <>
      <NoteEditor
        season={season}
        crn={noteCrn}
        initialContent={notes.content}
      />
      <PastNotesLinks
        offerings={notes.pastOfferings}
        courseCode={listing.course_code}
        onNavigation={onNavigation}
      />
    </>
  );
}

export default NotesPanel;
