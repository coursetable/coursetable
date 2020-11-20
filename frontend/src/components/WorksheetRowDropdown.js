import React from 'react';

import styles from './WorksheetRowDropdown.module.css';
import worksheet_styles from '../pages/Worksheet.module.css';
import FBReactSelect from './FBReactSelect';
import SeasonReactSelect from './SeasonReactSelect';
import { Row, Col } from 'react-bootstrap';
import { SurfaceComponent, StyledExpandBtn } from './StyledComponents';
import { FaExpandAlt } from 'react-icons/fa';
import { useUser } from '../user';
import styled from 'styled-components';

// Space above row dropdown to hide scrolled courses
const StyledSpacer = styled.div`
  background-color: ${({ theme }) => theme.background};
  position: -webkit-sticky; /* Safari */
  position: sticky;
  top: 56px;
  z-index: 2;
`;

// Container of row dropdown (without spacer)
const StyledContainer = styled(SurfaceComponent)`
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
`;

/**
 * Render row of season and FB friends dropdowns
 * @prop cur_season - string that holds the current season code
 * @prop season_codes - list of season codes
 * @prop onSeasonChange - function to change season
 * @prop setFbPerson - function to change FB person
 * @prop cur_person - string of current person who's worksheet we are viewing
 * @prop setCurExpand - function to change worksheet view
 */

function WorksheetRowDropdown({
  cur_season,
  season_codes,
  onSeasonChange,
  setFbPerson,
  cur_person,
  setCurExpand,
}) {
  // Fetch user context data
  const { user } = useUser();

  return (
    <StyledSpacer className="pt-3">
      <StyledContainer layer={1}>
        <Row className="shadow-sm mx-auto pt-2 pb-2">
          {/* Season Select */}
          <Col md={6} className="pl-2 pr-1">
            <div
              className={styles.select_container + ' ' + styles.hover_effect}
            >
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
        {/* Expand Worksheet List Button */}
        <StyledExpandBtn
          className={worksheet_styles.expand_btn + ' ' + styles.top_left}
        >
          <FaExpandAlt
            size={12}
            className={worksheet_styles.expand_icon}
            onClick={() => {
              // Expand list
              setCurExpand('list');
            }}
          />
        </StyledExpandBtn>
      </StyledContainer>
    </StyledSpacer>
  );
}

export default WorksheetRowDropdown;
