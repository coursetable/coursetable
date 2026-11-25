import { useEffect, useState } from 'react';

import NoteEditor from './NoteEditor';
import { whenNotesSaved } from './noteSaver';
import type { CourseModalPrefetchListingDataFragment } from '../../../generated/graphql-types';
import { fetchCourseNote } from '../../../queries/api';
import { useCourseSectionsQuery } from '../../../queries/graphql-queries';
import Spinner from '../../Spinner';
import { TextComponent } from '../../Typography';

type LoadedNote = { content: string } | 'loading' | 'failed';

function NotesPanel({
  listing,
}: {
  readonly listing: CourseModalPrefetchListingDataFragment;
}) {
  const [note, setNote] = useState<LoadedNote>('loading');
  const sameCourseId = listing.course.same_course_id;
  const { data } = useCourseSectionsQuery({
    variables: {
      courseCode: listing.course_code,
      seasonCode: listing.course.season_code,
      hasEvals: false,
    },
  });
  const sections = data?.listings ?? [];
  const shared = sections.filter(
    (s) => s.course.same_course_id === sameCourseId,
  );
  const others = shared
    .filter((s) => s.crn !== listing.crn)
    .map((s) => s.course.section.padStart(2, '0'))
    .sort();
  const scope =
    sections.length < 2
      ? null
      : shared.length === sections.length
        ? `These notes are shared across all ${sections.length} sections of ${listing.course_code}.`
        : others.length > 0
          ? `These notes are shared with ${listing.course_code} section${others.length > 1 ? 's' : ''} ${others.join(', ')}.`
          : `These notes are only for this section of ${listing.course_code}.`;

  useEffect(() => {
    let cancelled = false;
    void whenNotesSaved()
      .then(() => fetchCourseNote(sameCourseId))
      .then((res) => {
        if (!cancelled) setNote(res ?? 'failed');
      });
    return () => {
      cancelled = true;
    };
  }, [sameCourseId]);

  if (note === 'loading') return <Spinner message="Loading your note..." />;
  if (note === 'failed') return <p>Couldn't load your note.</p>;

  return (
    <>
      {scope && (
        <TextComponent type="tertiary" small as="div" className="mb-2">
          {scope}
        </TextComponent>
      )}
      <NoteEditor sameCourseId={sameCourseId} initialContent={note.content} />
    </>
  );
}

export default NotesPanel;
