import { Link, useSearchParams } from 'react-router-dom';
import NoCoursesFound from '../../images/no_courses_found.svg';
import type { WishlistItemWithListings } from '../../search/wishlistContext';
import { createCourseModalLink } from '../../utilities/display';
import { TextComponent } from '../Typography';
import itemsStyles from './WishlistItems.module.css';

function WishlistItems({
  data,
  courseLinkClassName,
}: {
  readonly data: WishlistItemWithListings[];
  readonly courseLinkClassName?: string;
}) {
  const [searchParams] = useSearchParams();

  if (data.length === 0) {
    return (
      <div className={itemsStyles.emptyState}>
        <img
          alt=""
          className={itemsStyles.emptyIllustration}
          src={NoCoursesFound}
        />
        <p className={itemsStyles.emptyTitle}>No saved courses yet</p>
        <TextComponent type="secondary">
          Bookmark courses from the catalog or course modal; they&apos;ll show
          up on this list.
        </TextComponent>
      </div>
    );
  }

  return (
    <ul className="ps-3 my-2">
      {data.map((course) => {
        const title = course.listings[0]?.title ?? 'Course';

        return (
          <li key={course.sameCourseId}>
            <Link
              to={createCourseModalLink(
                {
                  crn: course.crn,
                  course: { season_code: course.season },
                },
                searchParams,
              )}
              className={courseLinkClassName}
            >
              <TextComponent>{title}</TextComponent>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export default WishlistItems;
