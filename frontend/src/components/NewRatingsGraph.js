import React from 'react';
import { Row, Col } from 'react-bootstrap';
import styled from 'styled-components';
import styles from './RatingsGraph.module.css';
import { TextComponent } from './StyledComponents';

const StyledLabel = styled.p`
  font-size: 10px !important;
  margin: auto 0 auto 5px;
  color: #468ff2;
`;

const StyledBar = styled.div`
  height: 16px;
  border-radius: 8px;
`;

/**
 * Displays Evaluation Graphs
 * @prop ratings - list that holds the counts for each rating 1-5
 * @prop reverse - boolean of whether or not to reverse the colors
 * @prop labels - list that holds the x-axis labels for the grpah
 */

const NewRatingsGraph = ({ ratings, reverse, labels }) => {
  let max_val = 1;
  // Find the maximum count for a rating
  ratings.forEach((rating) => {
    max_val = Math.max(rating, max_val);
  });

  // Bar chart colors
  const colors = ['#f54242', '#f5a142', '#f5f542', '#aeed1a', '#00e800'];
  // Reverse colors and labels if needed
  if (reverse) {
    colors.reverse();
    labels.reverse();
  }

  // index of graph for color and key
  let indx = 0;
  // max width of bar
  const MAX_WIDTH = 85;
  // Holds the bars
  const rows = [];
  // Loop through each rating to build the bar
  ratings.forEach((rating) => {
    const width = rating ? (rating / max_val) * MAX_WIDTH : 0;
    if (indx === 1 && ratings.length === 2) indx = 4;
    rows.push(
      <Row className="mx-auto my-1" key={indx}>
        <StyledBar
          style={{ backgroundColor: colors[indx], width: `${width}%` }}
        />
        <StyledLabel>{rating}</StyledLabel>
      </Row>
    );
    indx++;
    // Calculate height of the bar
    // const height = rating ? MIN_HEIGHT + (rating / max_val) * 100 : 0;
    // // Skip to last color if this is the yes/no question
    // if (indx === 1 && ratings.length === 2) indx = 4;
    // // Build bar
    // columns.push(
    //   <div key={indx} className={styles.bar}>
    //     {/* Number of votes for each rating */}
    //     <p className={`${styles.value} m-0 `}>
    //       <TextComponent type={1}>{rating}</TextComponent>
    //     </p>
    //     {/* Bar */}
    //     <div
    //       className={`${styles.column} px-1 mx-auto`}
    //       style={{
    //         backgroundColor: colors[indx],
    //         height: `${height.toString()}px`,
    //       }}
    //     />
    //     {/* Rating labels */}
    //     {ratings.length === 2 && (
    //       <StyledLabel className={`${styles.value} m-0`}>
    //         {indx === 0 ? 'yes' : 'no'}
    //       </StyledLabel>
    //     )}
    //     {ratings.length === 5 && (
    //       <StyledLabel className={`${styles.value} m-0`}>
    //         <span className="d-none d-sm-block">{labels[indx]}</span>
    //         <span className="d-sm-none">{indx + 1}</span>
    //       </StyledLabel>
    //     )}
    //   </div>
    // );
    // indx++;
  });
  if (!reverse) rows.reverse();

  return (
    // <Row
    //   className={`${styles.container} mx-auto px-3 mb-5 justify-content-center align-items-end`}
    // >
    //   {columns}
    // </Row>

    <Row className="mx-auto">
      <Col md={4} className="px-0">
        {labels.reverse().map((label, index) => (
          <Row
            key={index}
            className="mx-auto my-1 justify-content-end"
            style={{ height: '16px' }}
          >
            <StyledLabel>
              <TextComponent type={2}>{label}</TextComponent>
            </StyledLabel>
          </Row>
        ))}
      </Col>
      <Col md={8} className="pr-0">
        {rows}
      </Col>
    </Row>
  );
};

export default NewRatingsGraph;
