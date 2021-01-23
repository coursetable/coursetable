import React from 'react';
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
}) => {
  // Handle clicks that affect active dropdown
  const handleActiveDropdown = (visible: boolean) => {
    if (visible) {
      setActiveDropdown('');
    } else {
      setActiveDropdown(name);
    }
  };

  // Ref to detect outside clicks for profile dropdown
  const {
    ref_toggle,
    ref_dropdown,
    isComponentVisible,
    setIsComponentVisible,
  } = useComponentVisibleDropdown<HTMLDivElement>(false, handleActiveDropdown);

  console.log('rendering dropdown:', isComponentVisible);

  return (
    <>
      <StyledToggle
        ref={ref_toggle}
        onClick={() => {
          handleActiveDropdown(isComponentVisible);
          setIsComponentVisible(!isComponentVisible);
          console.log(isComponentVisible);
        }}
      >
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
