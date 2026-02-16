import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { Collapse, Form, OverlayTrigger, Tooltip } from 'react-bootstrap';
import styles from './WorksheetWalkingTime.module.css';

type WorksheetWalkingTimeProps = {
  readonly walkableClasses: number;
  readonly unwalkableClasses: number;
  readonly showWalkingTimes: boolean;
  readonly onShowWalkingTimesChange: (showWalkingTimes: boolean) => void;
};

export default function WorksheetWalkingTime({
  walkableClasses,
  unwalkableClasses,
  showWalkingTimes,
  onShowWalkingTimesChange,
}: WorksheetWalkingTimeProps) {
  const [shown, setShown] = useState(true);
  const hasMountedRef = useRef(false);

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }
    setShown((previousShown) =>
      previousShown === showWalkingTimes ? previousShown : showWalkingTimes,
    );
  }, [showWalkingTimes]);

  return (
    <div className={clsx(shown ? 'dropdown' : 'dropup', styles.container)}>
      <div className={styles.toggleButton}>
        <button
          type="button"
          className="dropdown-toggle"
          onClick={() => setShown((prevShown) => !prevShown)}
        >
          Walking
        </button>
        <OverlayTrigger
          placement="top"
          overlay={
            <Tooltip id="show-walking-times-tooltip">
              {showWalkingTimes ? 'Hide walk times' : 'Show walk times'}
            </Tooltip>
          }
        >
          <div className={styles.headerSwitch}>
            <Form.Check
              type="switch"
              id="show-walking-times-toggle"
              checked={showWalkingTimes}
              aria-label={
                showWalkingTimes ? 'Hide walking times' : 'Show walking times'
              }
              onChange={(event) =>
                onShowWalkingTimesChange(event.currentTarget.checked)
              }
            />
          </div>
        </OverlayTrigger>
      </div>
      <Collapse in={shown}>
        <div>
          <div className={styles.content}>
            <dl className={styles.stats}>
              <div>
                <dt>Fits schedule</dt>
                <dd
                  className={clsx(
                    styles.metricValue,
                    walkableClasses > 0
                      ? styles.walkablePositive
                      : styles.walkableZero,
                  )}
                >
                  {walkableClasses}
                </dd>
              </div>
              <div>
                <dt>Likely too far</dt>
                <dd
                  className={clsx(
                    styles.metricValue,
                    unwalkableClasses > 0
                      ? styles.unwalkablePositive
                      : styles.unwalkableZero,
                  )}
                >
                  {unwalkableClasses}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </Collapse>
    </div>
  );
}
