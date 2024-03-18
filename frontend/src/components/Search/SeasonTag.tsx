import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import clsx from 'clsx';
import { IoMdSunny } from 'react-icons/io';
import { FcCloseUpMode } from 'react-icons/fc';
import { FaCanadianMapleLeaf } from 'react-icons/fa';
import type { Season } from '../../utilities/common';
import { toSeasonString } from '../../utilities/course';
import styles from './SeasonTag.module.css';

function SeasonTag({
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
          'ml-auto px-1 pb-0',
          {
            [styles.spring]: seasonNum === 1,
            [styles.summer]: seasonNum === 2,
            [styles.fall]: seasonNum === 3,
          },
          className,
        )}
      >
        {icon}&nbsp;'{year}
      </div>
    </OverlayTrigger>
  );
}

export default SeasonTag;
