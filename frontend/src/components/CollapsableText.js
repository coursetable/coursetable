import React, { useState } from 'react';
import { Collapse, Row } from 'react-bootstrap';
import { StyledHr, TextComponent } from './StyledComponents';
import styles from './CollapsableText.module.css';
import { FiPlus, FiMinus } from 'react-icons/fi';
import styled from 'styled-components';

const StyledToggle = styled(Row)`
  justify-content: space-between;
  cursor: pointer;
  transition 0.1s background-color;
  font-size: 14px;
  &:hover {
    background-color: ${({ theme }) => theme.select_hover};
  }
`;

const CollapsableText = ({ header, body, init = true }) => {
  const [isCollapsed, setIsCollapsed] = useState(init);
  return (
    <>
      <StyledToggle
        className="mx-auto mt-3"
        onClick={() => {
          setIsCollapsed(!isCollapsed);
        }}
      >
        <TextComponent type={2}>{header.toUpperCase()}</TextComponent>
        <TextComponent type={2} className="my-auto">
          {isCollapsed ? (
            <FiPlus size={22} style={{ display: 'block' }} />
          ) : (
            <FiMinus size={22} style={{ display: 'block' }} />
          )}
        </TextComponent>
      </StyledToggle>
      <StyledHr className="my-0" />
      <Collapse in={!isCollapsed}>
        <Row className={`mx-auto mt-1 ${styles.body_text}`}>{body}</Row>
      </Collapse>
    </>
  );
};

export default CollapsableText;
