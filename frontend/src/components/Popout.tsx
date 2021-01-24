import React from 'react';

// import { BiSearchAlt2 } from 'react-icons/bi';
import styled, { useTheme } from 'styled-components';

import { IoMdArrowDropdown } from 'react-icons/io';
import { useComponentVisibleDropdown } from '../utilities';

const Dropdown = styled.div`
  position: relative;
`;

const shadow = 'hsla(218, 50%, 10%, 0.1)';

const Menu = styled.div`
  background-color: ${({ theme }) => theme.select};
  border-radius: 4px;
  box-shadow: 0 0 0 1px ${shadow}, 0 4px 11px ${shadow};
  margin-top: 8px;
  position: absolute;
  z-index: 1000;
`;

const StyledButton = styled.div`
  background-color: ${({ theme }) => theme.surface[0]};
  color: ${({ theme }) => theme.text[0]};
  border: 0;
  padding: 6px 8px;
  margin: 6px 0;
  font-weight: 400;
  font-size: 14px;
  border-radius: 4px;
  transition: background-color 0.2s linear, border 0.2s linear,
    color 0.2s linear;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.button_hover};
    color: ${({ theme }) => theme.primary_hover};
  }

  &:active {
    background-color: ${({ theme }) => theme.button_active};
    color: ${({ theme }) => theme.primary_hover};
  }
`;

// const DropdownIndicator = (
//   props: ElementConfig<typeof components.DropdownIndicator>
// ) => {
//   return (
//     <components.DropdownIndicator {...props}>
//       <BiSearchAlt2 />
//     </components.DropdownIndicator>
//   );
// };

type Props = {
  children: React.ReactNode;
  buttonText: string;
};

export const Popout: React.FC<Props> = ({ children, buttonText }) => {
  // Ref to detect outside clicks for popout and button
  const {
    ref_toggle,
    ref_dropdown,
    isComponentVisible,
    setIsComponentVisible,
  } = useComponentVisibleDropdown<HTMLDivElement>(false);

  const toggleOpen = () => {
    setIsComponentVisible(!isComponentVisible);
  };

  const theme = useTheme();

  const buttonStyles = (isComponentVisible: boolean) => {
    if (isComponentVisible) {
      return {
        backgroundColor: theme.button_active,
        color: theme.primary_hover,
      };
    }
    return undefined;
  };

  return (
    <Dropdown>
      <StyledButton
        onClick={toggleOpen}
        style={buttonStyles(isComponentVisible)}
        ref={ref_toggle}
      >
        {buttonText}
        <IoMdArrowDropdown className="ml-1" />
      </StyledButton>
      {isComponentVisible ? <Menu ref={ref_dropdown}>{children}</Menu> : null}
    </Dropdown>
  );
};
