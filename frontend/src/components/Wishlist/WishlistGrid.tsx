import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import type { WishlistItemWithListings } from '../../contexts/wishlistContext';
import NoCoursesFound from '../../images/no_courses_found.svg';
import { createCourseModalLink } from '../../utilities/display';
import { TextComponent } from '../Typography';
import gridStyles from './WishlistGrid.module.css';

function WishlistGrid({
  data,
  courseLinkClassName,
}: {
  readonly data: WishlistItemWithListings[];
  readonly courseLinkClassName?: string;
}) {
  const [searchParams] = useSearchParams();

  if (data.length === 0) {
    return (
      <div className={gridStyles.emptyState}>
        <img
          alt=""
          className={gridStyles.emptyIllustration}
          src={NoCoursesFound}
        />
        <p className={gridStyles.emptyTitle}>No saved courses yet</p>
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

export default WishlistGrid;
