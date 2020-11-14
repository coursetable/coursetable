import React from 'react';

import styles from './WorksheetRowDropdown.module.css';
import FBReactSelect from './FBReactSelect';
import SeasonReactSelect from './SeasonReactSelect';
import { Row, Col } from 'react-bootstrap';
import { SurfaceComponent } from './StyledComponents';
import { useUser } from '../user';

/**
 * Render row of season and FB friends dropdowns
 * @prop cur_season - string that holds the current season code
 * @prop season_codes - list of season codes
 * @prop onSeasonChange - function to change season
 * @prop setFbPerson - function to change FB person
 * @prop cur_person - string of current person who's worksheet we are viewing
 */

function WorksheetRowDropdown({
  cur_season,
  season_codes,
  onSeasonChange,
  setFbPerson,
  cur_person,
}) {
  // Fetch user context data
  const { user } = useUser();

  return (
    <SurfaceComponent>
      <Row className={styles.container + ' shadow-sm mx-auto pt-2 pb-2'}>
        {/* Season Select */}
        <Col md={6} className="pl-2 pr-1">
          <div className={styles.select_container + ' ' + styles.hover_effect}>
            <SeasonReactSelect
              cur_season={cur_season}
              season_codes={season_codes}
              onSeasonChange={onSeasonChange}
            />
          </div>
        </Col>
        {/* FB Friend Select */}
        <Col md={6} className="pr-2 pl-1">
          <div
            className={
              styles.select_container +
              (user.fbLogin ? ' ' + styles.hover_effect : '')
            }
          >
            <FBReactSelect
              cur_season={cur_season}
              setFbPerson={setFbPerson}
              cur_person={cur_person}
            />
          </div>
        </Col>
      </Row>
    </SurfaceComponent>
  );
}

export default WorksheetRowDropdown;
