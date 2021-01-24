import React, { useState } from 'react';
import { Button } from 'react-bootstrap';

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
  background: #ffffff;
  border-radius: 4px;
  box-shadow: 0 0 0 1px ${shadow}, 0 4px 11px ${shadow};
  margin-top: 8px;
  position: absolute;
  z-index: 1000;
`;

const StyledButton = styled(Button)`
  padding: 0 8px;
  margin: 6px 0;
  font-weight: 400;
  font-size: 14px;
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
      <StyledButton variant="light" onClick={toggleOpen}>
        {buttonText}
        <IoMdArrowDropdown className="ml-1" />
      </StyledButton>
      {isOpen ? <Menu>{children}</Menu> : null}
      {isOpen ? <Blanket onClick={toggleOpen} /> : null}
    </Dropdown>
  );
};
