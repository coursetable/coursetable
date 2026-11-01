import type { CourseModalPrefetchListingDataFragment } from '../../../generated/graphql-types';

function NotesPanel({
  listing,
}: {
  readonly listing: CourseModalPrefetchListingDataFragment;
}) {
  return <p>Notes for {listing.course_code} will go here.</p>;
}

export default NotesPanel;
