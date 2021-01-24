import React, { useState } from 'react';

// import { BiSearchAlt2 } from 'react-icons/bi';
import styled from 'styled-components';

import { IoMdArrowDropdown } from 'react-icons/io';

const Dropdown = styled.div`
  position: relative;
`;

const Blanket = styled.div`
  bottom: 0;
  left: 0;
  top: 0;
  right: 0;
  position: fixed;
  z-index: 1;
`;

const shadow = 'hsla(218, 50%, 10%, 0.1)';

const Menu = styled.div`
  background: ${({ theme }) => theme.select};
  border-radius: 4px;
  box-shadow: 0 0 0 1px ${shadow}, 0 4px 11px ${shadow};
  margin-top: 8px;
  position: absolute;
  z-index: 1000;
`;

const StyledButton = styled.div`
  background: ${({ theme }) => theme.surface[0]};
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
    background: ${({ theme }) => theme.disabled};
    color: ${({ theme }) => theme.primary_hover};
  }

  &:active {
    background: ${({ theme }) => theme.hidden};
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
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Dropdown>
      <StyledButton onClick={toggleOpen}>
        {buttonText}
        <IoMdArrowDropdown className="ml-1" />
      </StyledButton>
      {isOpen ? <Menu>{children}</Menu> : null}
      {isOpen ? <Blanket onClick={toggleOpen} /> : null}
    </Dropdown>
  );
};
