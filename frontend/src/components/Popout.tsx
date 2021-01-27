import React, { useEffect, useState } from 'react';

import styled, { useTheme } from 'styled-components';

import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';
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
  user-select: none;
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

type Option = {
  label: string;
  value: string;
  color?: string;
};

type Props = {
  children: React.ReactNode;
  buttonText: string;
  type: string;
  arrowIcon?: boolean;
  select_options?: Option[];
};

export const Popout: React.FC<Props> = ({
  children,
  buttonText,
  type,
  arrowIcon = true,
  select_options,
}) => {
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

  const [toggleText, setToggleText] = useState(buttonText);

  useEffect(() => {
    if (select_options && select_options.length > 0) {
      const options = select_options.map((option) => {
        if (type === 'season') {
          return option.label;
        }
        return option.value;
      });
      let text;
      if (type === 'season') {
        text =
          options.length > 1
            ? `${options[0]} + ${options.length - 1}`
            : options[0];
      } else {
        text =
          options.length > 3
            ? `${options[0]}, ${options[1]}, ${options[2]} + ${
                options.length - 3
              }`
            : options.length === 3
            ? `${options[0]}, ${options[1]}, ${options[2]}`
            : options.length === 2
            ? `${options[0]}, ${options[1]}`
            : options[0];
      }
      setToggleText(text);
    } else {
      setToggleText(buttonText);
    }
  }, [select_options, buttonText, type]);

  return (
    <Dropdown>
      <StyledButton
        onClick={toggleOpen}
        style={buttonStyles(isComponentVisible)}
        ref={ref_toggle}
      >
        {toggleText}
        {arrowIcon ? (
          isComponentVisible ? (
            <IoMdArrowDropup className="ml-1" />
          ) : (
            <IoMdArrowDropdown className="ml-1" />
          )
        ) : (
          <></>
        )}
      </StyledButton>
      {isComponentVisible ? <Menu ref={ref_dropdown}>{children}</Menu> : null}
    </Dropdown>
  );
};
