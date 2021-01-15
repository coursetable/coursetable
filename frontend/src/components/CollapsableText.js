import React, { useState } from 'react';
import { Collapse, Row } from 'react-bootstrap';
import { StyledHr, TextComponent } from './StyledComponents';
import styles from './CollapsableText.module.css';
import { FiPlus, FiMinus } from 'react-icons/fi';

const CollapsableText = ({ header, body }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  return (
    <>
      <Row className="mx-auto justify-content-between mt-3">
        <TextComponent type={2}>{header.toUpperCase()}</TextComponent>
        <TextComponent
          type={2}
          onClick={() => {
            setIsCollapsed(!isCollapsed);
          }}
          className={`${styles.toggle_btn} my-auto`}
        >
          {isCollapsed ? (
            <FiPlus size={22} style={{ display: 'block' }} />
          ) : (
            <FiMinus size={22} style={{ display: 'block' }} />
          )}
        </TextComponent>
      </Row>
      <StyledHr className="my-0" />
      <Collapse in={!isCollapsed}>
        <Row className="mx-auto mt-1">{body}</Row>
      </Collapse>
    </>
  );
};

export default CollapsableText;
