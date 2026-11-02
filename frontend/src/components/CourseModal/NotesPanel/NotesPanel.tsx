import { useEffect, useState } from 'react';

import NoteEditor from './NoteEditor';
import type { CourseModalPrefetchListingDataFragment } from '../../../generated/graphql-types';
import { fetchCourseNote } from '../../../queries/api';
import Spinner from '../../Spinner';

type LoadedNote = { content: string } | 'loading' | 'failed';

function NotesPanel({
  listing,
}: {
  readonly listing: CourseModalPrefetchListingDataFragment;
}) {
  const [note, setNote] = useState<LoadedNote>('loading');
  const { season_code: season } = listing.course;
  const { crn } = listing;

  useEffect(() => {
    let cancelled = false;
    void fetchCourseNote(season, crn).then((res) => {
      if (!cancelled) setNote(res ?? 'failed');
    });
    return () => {
      cancelled = true;
    };
  }, [season, crn]);

  if (note === 'loading') return <Spinner message="Loading your note..." />;
  // The editor stays closed so a failed load can't overwrite the saved note
  if (note === 'failed') return <p>Couldn't load your note.</p>;

  return <NoteEditor season={season} crn={crn} initialContent={note.content} />;
}

export default NotesPanel;
