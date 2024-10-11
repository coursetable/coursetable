import * as Sentry from '@sentry/react';
import clsx from 'clsx';
import { OverlayTrigger, Tooltip, Popover } from 'react-bootstrap';
import type { IconType } from 'react-icons';
import { AiOutlineStar } from 'react-icons/ai';
import { BiBookOpen } from 'react-icons/bi';
import { FaCanadianMapleLeaf } from 'react-icons/fa';
import { FcCloseUpMode } from 'react-icons/fc';
import { IoMdSunny } from 'react-icons/io';
import { IoPersonOutline } from 'react-icons/io5';
import type { CatalogListing } from '../../queries/api';
import type { Season } from '../../queries/graphql-types';
import {
  subjects,
  ratingColormap,
  workloadColormap,
} from '../../utilities/constants';
import {
  getOverallRatings,
  type CourseWithOverall,
  getWorkloadRatings,
  type CourseWithWorkload,
  getProfessorRatings,
  type CourseWithProfRatings,
  toSeasonString,
  truncatedText,
} from '../../utilities/course';
import { InfoPopover, TextComponent } from '../Typography';
import styles from './ResultsItemCommon.module.css';

export function SeasonTag({
  season,
  className,
}: {
  readonly season: Season;
  readonly className?: string;
}) {
  const seasonNum = Number(season[5]);
  const year = season.substring(2, 4);
  const icon =
    seasonNum === 1 ? (
      <FcCloseUpMode className="my-auto" size={12} />
    ) : seasonNum === 2 ? (
      <IoMdSunny color="#ffaa00" className="my-auto" size={12} />
    ) : (
      <FaCanadianMapleLeaf className="my-auto" size={12} />
    );

  return (
    <OverlayTrigger
      placement="top"
      overlay={(props) => (
        <Tooltip id="button-tooltip" {...props}>
          <small>{toSeasonString(season)}</small>
        </Tooltip>
      )}
    >
      <div
        className={clsx(
          styles.seasonTag,
          {
            [styles.spring!]: seasonNum === 1,
            [styles.summer!]: seasonNum === 2,
            [styles.fall!]: seasonNum === 3,
          },
          className,
        )}
      >
        {icon}&nbsp;'{year}
      </div>
    </OverlayTrigger>
  );
}

export function CourseInfoPopover({
  listing,
  children,
}: {
  readonly listing: CatalogListing;
  readonly children: React.JSX.Element;
}) {
  return (
    <OverlayTrigger
      placement="right"
      overlay={(props) => (
        <InfoPopover {...props} id="title-popover">
          <Popover.Header>
            <strong>
              {listing.course.extra_info !== 'ACTIVE' ? (
                <span className={styles.cancelledText}>CANCELLED</span>
              ) : (
                ''
              )}{' '}
              {listing.course.title}
            </strong>
          </Popover.Header>
          <Popover.Body>
            {truncatedText(listing.course.description, 300, 'no description')}
            <br />
            <div className="text-danger">
              {truncatedText(listing.course.requirements, 250, '')}
            </div>
          </Popover.Body>
        </InfoPopover>
      )}
    >
      {children}
    </OverlayTrigger>
  );
}

export function CourseCode({
  listing,
  subdueSection,
}: {
  readonly listing: CatalogListing;
  readonly subdueSection: boolean;
}) {
  const section = listing.section ? ` ${listing.section.padStart(2, '0')}` : '';
  return (
    <>
      <OverlayTrigger
        placement="top"
        overlay={(props) => {
          const subjectName = subjects[listing.subject];
          if (!subjectName) {
            Sentry.captureException(
              new Error(`Subject ${listing.subject} has no label`),
            );
          }
          return (
            <Tooltip id="button-tooltip" {...props}>
              <small>{subjectName ?? '[unknown]'}</small>
            </Tooltip>
          );
        }}
      >
        <span>{listing.subject}</span>
      </OverlayTrigger>{' '}
      {listing.number}
      {subdueSection ? (
        <TextComponent type="secondary">{section}</TextComponent>
      ) : (
        section
      )}
    </>
  );
}

export const ratingTypes: {
  [type in 'Class' | 'Professor' | 'Workload']: {
    getRating: ((
      course: CourseWithOverall & CourseWithWorkload & CourseWithProfRatings,
      mode: 'stat',
    ) => number | null) &
      ((
        course: CourseWithOverall & CourseWithWorkload & CourseWithProfRatings,
        mode: 'display',
      ) => string);
    colorMap: chroma.Scale;
    Icon: IconType;
  };
} = {
  Class: {
    getRating: getOverallRatings,
    colorMap: ratingColormap,
    Icon: AiOutlineStar,
  },
  Professor: {
    getRating: getProfessorRatings,
    colorMap: ratingColormap,
    Icon: IoPersonOutline,
  },
  Workload: {
    getRating: getWorkloadRatings,
    colorMap: workloadColormap,
    Icon: BiBookOpen,
  },
};
