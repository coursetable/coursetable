import React from 'react';

import { Row, Col } from 'react-bootstrap';
import { FaExpandAlt } from 'react-icons/fa';
import styled from 'styled-components';
import styles from './WorksheetRowDropdown.module.css';
// import worksheet_styles from '../pages/Worksheet.module.css';
import FBReactSelect from './FBReactSelect';
import SeasonReactSelect from './SeasonReactSelect';
import { SurfaceComponent, StyledExpandBtn } from './StyledComponents';
import { useUser } from '../user';

// Space above row dropdown to hide scrolled courses
const StyledSpacer = styled.div`
  background-color: ${({ theme }) => theme.background};
  position: -webkit-sticky; /* Safari */
  position: sticky;
  top: 56px;
  transition: background-color 0.2s linear;
  z-index: 2;
`;

const StyledBtn = styled.div`
  background-color: ${({ theme }) => theme.select};
  color: ${({ theme }) => theme.text[0]};
  padding: 5px;
  cursor: pointer;
  text-align: center;
  transition: 0.2s linear !important;
  border: ${({ theme }) =>
    theme.theme === 'light'
      ? '2px solid hsl(0, 0%, 90%)'
      : '2px solid rgba(0,0,0,0.1)'};
  border-radius: 8px;

  &:hover {
    border: 2px solid #cccccc;
  }

  &:focus {
    background-color: ${({ theme }) => theme.select};
  }

  &.form-control:focus {
    color: ${({ theme }) => theme.text[0]};
  }
`;

// Container of row dropdown (without spacer)
const StyledContainer = styled(SurfaceComponent)`
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  box-shadow: 0 2px 6px 0px rgba(0, 0, 0, 0.2);
`;

/**
 * Render row of season and FB friends dropdowns
 * @prop cur_season - string that holds the current season code
 * @prop season_codes - list of season codes
 * @prop onSeasonChange - function to change season
 * @prop setFbPerson - function to change FB person
 * @prop cur_person - string of current person who's worksheet we are viewing
 * @prop setCurExpand - function to change worksheet view
 * @prop toggleCourse - function to hide courses
 * @prop areHidden - boolean | are all courses hidden
 */

function WorksheetRowDropdown({
  cur_season,
  season_codes,
  onSeasonChange,
  setFbPerson,
  cur_person,
  setCurExpand,
  toggleCourse,
  areHidden,
}) {
  // Fetch user context data
  const { user } = useUser();

  return (
    <StyledSpacer className="pt-2">
      <StyledContainer layer={1} className="mx-1">
        <div className="shadow-sm pt-2 pb-2">
          <Row className="mx-auto">
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
          <Row className="mx-auto mt-2">
            <Col className="pl-2 pr-2">
              <StyledBtn
                className={styles.btn}
                onClick={() => toggleCourse(areHidden ? -2 : -1)}
              >
                {areHidden ? 'Show' : 'Hide'} All
              </StyledBtn>
            </Col>
            {/* <Col md={6} className="pr-2 pl-1">
              <StyledBtn
                className={styles.btn}
                onClick={() => setCurExpand('list')}
              >
                Expand
              </StyledBtn>
            </Col> */}
          </Row>
        </div>

        {/* Expand Worksheet List Button */}
        {/* <StyledExpandBtn
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
        </StyledExpandBtn> */}
      </StyledContainer>
    </StyledSpacer>
  );
}

export default WorksheetRowDropdown;
