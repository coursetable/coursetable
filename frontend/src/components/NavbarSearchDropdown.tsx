import React, { useLayoutEffect, useRef } from 'react';
import { Collapse } from 'react-bootstrap';
import { VscTriangleDown } from 'react-icons/vsc';
import styled from 'styled-components';
import { useComponentVisibleDropdown } from '../utilities';
// import styles from './NavbarSearchDropdown.module.css';
import { SurfaceComponent } from './StyledComponents';

const StyledToggle = styled.div`
  width: auto;
  height: 100%;
  cursor: pointer;
  padding: 1rem 0.5rem;
  color: ${({ theme }) => theme.text[1]};
  font-weight: 400;
  font-size: 14px;

  &:hover {
    color: ${({ theme }) => theme.primary};
  }
`;

const StyledDropdown = styled(SurfaceComponent)`
  position: absolute;
  top: 100px;
  z-index: 1000;
  box-shadow: 0 2px 6px 0px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  transform: translate(0px, -10px);
`;

const StyledCollapse = styled(Collapse)`
  padding: 4px;
  width: 300px;
  height: ${(36 + 300 + 20).toString()}px;
`;

type Props = {
  children: React.ReactNode;
  name: string;
  placeholder: string;
  toggleText: string;
  setActiveDropdown: (dropdown: string) => void;
  ref_select?: React.MutableRefObject<any>;
};

/**
 * Renders the dropdown
 */
export const NavbarSearchDropdown: React.FC<Props> = ({
  children,
  name,
  placeholder,
  toggleText,
  setActiveDropdown,
  ref_select,
}) => {
  // // Handle clicks that affect active dropdown
  // const handleActiveDropdown = (visible: boolean) => {
  //   if (visible) {
  //     setActiveDropdown('');
  //   } else {
  //     setActiveDropdown(name);
  //     console.log(ref_select);
  //     if (ref_select && ref_select.current) {
  //       // e.preventDefault();
  //       ref_select.current.focus();
  //       console.log('focused');
  //     }
  //   }
  // };

  // Ref to detect outside clicks for profile dropdown
  const {
    ref_toggle,
    ref_dropdown,
    isComponentVisible,
    setIsComponentVisible,
  } = useComponentVisibleDropdown<HTMLDivElement>(false);

  const firstUpdate = useRef(true);
  useLayoutEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
    } else {
      console.log(ref_select);
      if (ref_select) {
        ref_select.current.focus();
        console.log('focused');
      }
    }
  }, [ref_select, isComponentVisible]);

  // const handleClick = () => {
  //   console.log(ref_select);
  //   if (ref_select) {
  //     ref_select.current.focus();
  //   }
  //   console.log('focused');
  // };

  // Handle toggle click
  const handleToggleClick = () => {
    setIsComponentVisible(!isComponentVisible);
    console.log('toggle click:', isComponentVisible);
  };

  console.log('rendering dropdown:', isComponentVisible);

  // if (isComponentVisible) {
  //   handleClick();
  // }

  return (
    <>
      <StyledToggle ref={ref_toggle} onClick={handleToggleClick}>
        {toggleText || placeholder}
        <VscTriangleDown className="ml-1" />
      </StyledToggle>
      <StyledDropdown layer={1} ref={ref_dropdown}>
        <StyledCollapse in={isComponentVisible}>
          {/* This wrapper div is important for making the collapse animation smooth */}
          <div>{children}</div>
        </StyledCollapse>
      </StyledDropdown>
    </>
  );
};
