import React, { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { toSeasonString } from '../courseUtilities';
import { TextComponent } from './StyledComponents';
import styles from './NewCourseModalEvaluations.module.css';
import styled from 'styled-components';

const StyledSeasonHeader = styled(Row)`
  border-top: 1px solid ${({ theme }) => theme.text[3]};
  color: ${({ theme }) => theme.text[3]};
  padding: 5px 0;
  font-size: 18px;
  font-weight: 500;
  transition: font-size 0.3s, color 0.1s;
  cursor: pointer;
  &:hover {
    color: ${({ theme }) => theme.text[1]};
  }
  &.last {
    border-bottom: 1px solid ${({ theme }) => theme.text[3]};
  }
  &.selected {
    font-size: 25px;
    font-weight: 600;
    color: ${({ theme }) => theme.text[1]};
  }
`;

const CourseModalEvaluations = ({ all_listings }) => {
  const [selected, setSelected] = useState(null);
  const seasons = Object.keys(all_listings).reverse();
  return (
    <>
      <Col sm={3} className="pr-2">
        {seasons.map((cur_season, index) => {
          const season_index = index;
          return all_listings[cur_season].map((cur_listing, index) =>
            cur_listing.evals ? (
              <StyledSeasonHeader
                className={`mx-auto justify-content-center ${
                  season_index === seasons.length - 1 &&
                  index === all_listings[cur_season].length - 1
                    ? 'last'
                    : ''
                } ${cur_listing.crn === selected ? 'selected' : ''}`}
                onClick={() => {
                  setSelected(
                    cur_listing.crn === selected ? null : cur_listing.crn
                  );
                }}
              >
                <span className={styles.season_header}>
                  {toSeasonString(cur_season)[0].toUpperCase()}{' '}
                  {cur_listing.section}
                </span>
              </StyledSeasonHeader>
            ) : null
          );
        })}
      </Col>
      <Col sm={9} className="pl-2">
        Eval stuff
      </Col>
    </>
  );
};

export default CourseModalEvaluations;
