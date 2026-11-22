import { useEffect, useState } from 'react';

import NoteEditor from './NoteEditor';
import type { CourseModalPrefetchListingDataFragment } from '../../../generated/graphql-types';
import { fetchCourseNote } from '../../../queries/api';
import { getCourseNoteCrn } from '../../../utilities/course';
import Spinner from '../../Spinner';

type LoadedNote = { content: string } | 'loading' | 'failed';

function NotesPanel({
  listing,
}: {
  readonly listing: CourseModalPrefetchListingDataFragment;
}) {
  const [note, setNote] = useState<LoadedNote>('loading');
  const sameCourseId = listing.course.same_course_id;

  useEffect(() => {
    let cancelled = false;
    void fetchCourseNote(sameCourseId).then((res) => {
      if (!cancelled) setNote(res ?? 'failed');
    });
    return () => {
      cancelled = true;
    };
  }, [sameCourseId]);

  if (note === 'loading') return <Spinner message="Loading your note..." />;
  if (note === 'failed') return <p>Couldn't load your note.</p>;

  return (
    <NoteEditor
      sameCourseId={sameCourseId}
      season={listing.course.season_code}
      crn={getCourseNoteCrn(listing.course)}
      initialContent={note.content}
    />
  );
}

export default NotesPanel;
