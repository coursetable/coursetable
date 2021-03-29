import React, { useState } from 'react';
import { Col, Row, Spinner } from 'react-bootstrap';
import { toSeasonString } from '../courseUtilities';
import { TextComponent } from './StyledComponents';
import styles from './NewCourseModalEvaluations.module.css';
import styled from 'styled-components';
import { LineChart, PieChart } from 'react-chartkick';
import 'chart.js';
import { useSearchEvaluationNarrativesQuery } from '../generated/graphql';
import NewEvaluationRatings from './NewEvaluationRatings';

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
    margin-bottom: 2rem;
  }
  &.selected {
    font-size: 22px;
    font-weight: 600;
    color: ${({ theme }) => theme.text[1]};
  }
`;

const CourseModalEvaluations = ({ all_listings }) => {
  const [selected, setSelected] = useState(null);
  const seasons = Object.keys(all_listings).reverse();
  const workloads = [];
  const overalls = [];
  for (const season in all_listings) {
    const evals = all_listings[season][0].evals;
    workloads.push([
      toSeasonString(season)[0],
      evals ? evals.avg_workload : null,
    ]);
    overalls.push([toSeasonString(season)[0], evals ? evals.avg_rating : null]);
  }
  // console.log(all_listings);
  // console.log(workloads);
  // console.log(overalls);
  // Fetch eval data for this listing
  const { loading, error, data } = useSearchEvaluationNarrativesQuery({
    variables: {
      season_code: selected ? selected.season_code : 'lmao',
      crn: selected ? selected.crn : 69,
    },
  });
  console.log(data);

  return (
    <>
      <Col sm={3} className="pr-2">
        {seasons.map((cur_season, index) => {
          const season_index = index;
          return all_listings[cur_season].map((cur_listing, index) =>
            cur_listing.evals ? (
              <StyledSeasonHeader
                key={index}
                className={`mx-auto justify-content-center ${
                  season_index === seasons.length - 1 &&
                  index === all_listings[cur_season].length - 1
                    ? 'last'
                    : ''
                } ${
                  selected && cur_listing.crn === selected.crn ? 'selected' : ''
                }`}
                onClick={() => {
                  setSelected(
                    selected && cur_listing.crn === selected.crn
                      ? null
                      : cur_listing
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
        {selected ? (
          data ? (
            <NewEvaluationRatings info={data.computed_listing_info[0]} />
          ) : (
            <Row className="mx-auto my-4 justify-content-center">
              <Spinner animation="border" role="status">
                <span className="sr-only">Loading...</span>
              </Spinner>
            </Row>
          )
        ) : (
          <LineChart
            round={2}
            data={[
              { name: 'Workload', data: workloads },
              { name: 'Overall', data: overalls },
            ]}
          />
        )}
      </Col>
    </>
  );
};

export default CourseModalEvaluations;
