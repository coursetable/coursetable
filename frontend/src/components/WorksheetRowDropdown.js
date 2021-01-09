import React, { Fragment } from 'react';

import { Row, Col, Button } from 'react-bootstrap';
import styled from 'styled-components';
import styles from './WorksheetRowDropdown.module.css';
// import worksheet_styles from '../pages/Worksheet.module.css';
import FBReactSelect from './FBReactSelect';
import SeasonReactSelect from './SeasonReactSelect';
import { SurfaceComponent } from './StyledComponents';
import { useUser } from '../user';
import { BsArrowRight, BsEyeSlash, BsEye } from 'react-icons/bs';

// Space above row dropdown to hide scrolled courses
const StyledSpacer = styled.div`
  background-color: ${({ theme }) => theme.background};
  position: -webkit-sticky; /* Safari */
  position: sticky;
  top: 56px;
  transition: background-color 0.2s linear;
  z-index: 2;
`;

const StyledBsEyeSlash = styled(BsEyeSlash)`
  transition: 0.3s !important;
`;

const StyledBsEye = styled(BsEye)`
  transition: 0.3s !important;
`;

const StyledBtn = styled.div`
  background-color: ${({ theme }) => theme.select};
  color: ${({ theme }) => theme.text[0]};
  padding: 5px;
  cursor: pointer;
  text-align: center;
  transition: 0.2s linear !important;
  border: solid 2px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    border: 2px solid hsl(0, 0%, 70%);
    ${StyledBsEyeSlash} {
      transform: scale(1.15);
    }
    ${StyledBsEye} {
      transform: scale(1.15);
    }
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

const StyledExpandLink = styled(Button)`
  color: ${({ theme }) => theme.text[1]};
  font-weight: normal;
  &:hover {
    text-decoration: none !important;
    color: ${({ theme }) => theme.primary};
  }
  &:focus {
    box-shadow: none !important;
  }
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
    <StyledSpacer className="pt-3">
      <StyledContainer layer={1} className="mx-1">
        <div className="shadow-sm p-2">
          {/* Go to list view Link */}
          <Row className="mx-auto">
            <Col className="px-0">
              <StyledExpandLink
                variant="link"
                className="py-0"
                onClick={() => setCurExpand('list')}
              >
                Go to list view <BsArrowRight size={24} />
              </StyledExpandLink>
            </Col>
          </Row>
          <Row className="mx-auto mt-2">
            {/* Season Select */}
            <Col md={6} className="pl-0 pr-2">
              <div className={`${styles.select_container}`}>
                <SeasonReactSelect
                  cur_season={cur_season}
                  season_codes={season_codes}
                  onSeasonChange={onSeasonChange}
                />
              </div>
            </Col>
            {/* FB Friend Select */}
            <Col md={6} className="px-0">
              <div className={styles.select_container}>
                <FBReactSelect
                  cur_season={cur_season}
                  setFbPerson={setFbPerson}
                  cur_person={cur_person}
                />
              </div>
            </Col>
          </Row>
          {/* Hide/Show All Button */}
          <Row className="mx-auto mt-2">
            <Col
              className={`px-0 ${styles.select_container} ${styles.hide_all_btn}`}
            >
              <StyledBtn onClick={() => toggleCourse(areHidden ? -2 : -1)}>
                {areHidden ? (
                  <>
                    <StyledBsEyeSlash className={`my-auto pr-2`} size={26} />{' '}
                    Show
                  </>
                ) : (
                  <>
                    <StyledBsEye className={`my-auto pr-2`} size={26} /> Hide
                  </>
                )}{' '}
                All
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
