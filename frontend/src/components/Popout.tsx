import React, { useCallback, useEffect, useState } from 'react';

import styled, { useTheme } from 'styled-components';

import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';
import { IoClose } from 'react-icons/io5';
import { breakpoints, useComponentVisibleDropdown } from '../utilities';
import chroma from 'chroma-js';

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
  margin-top: 6px;
  margin-bottom: 6px;
  margin-right: 6px;
  font-weight: 400;
  font-size: 14px;
  ${breakpoints('font-size', 'px', [{ 1320: 12 }])};
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

const CloseIcon = styled(IoClose)`
  z-index: 1000;
  cursor: pointer;
  color: ${({ theme }) => theme.icon_focus};
  &:hover {
    color: ${({ theme }) =>
      theme.theme === 'light'
        ? chroma(theme.icon_focus).darken().css()
        : chroma(theme.icon_focus).brighten().css()};
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
  onReset: () => void;
  arrowIcon?: boolean;
  select_options?:
    | Option[]
    | Record<string, Record<string, Option[] | boolean>>;
  className?: string;
};

export const Popout: React.FC<Props> = ({
  children,
  buttonText,
  type,
  onReset,
  arrowIcon = true,
  select_options,
  className,
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

  const [toggleText, setToggleText] = useState(buttonText);
  const [active, setActive] = useState(false);

  const buttonStyles = (open: boolean) => {
    if (open) {
      return {
        backgroundColor: theme.button_active,
        color: theme.primary_hover,
      };
    }
    if (active) {
      return {
        color: theme.primary_hover,
      };
    }
    return undefined;
  };

  useEffect(() => {
    // Dynamically set popout button text based on selected options
    if (select_options) {
      if (Array.isArray(select_options) && select_options.length > 0) {
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
        setActive(true);
      } else if (
        select_options !== null &&
        typeof select_options === 'object' &&
        type === 'advanced'
      ) {
        let activeFilters = 0;
        for (const [key, value] of Object.entries(select_options)) {
          for (const optionValue of Object.values(value)) {
            if (
              key === 'selects' &&
              Array.isArray(optionValue) &&
              optionValue.length > 0
            ) {
              activeFilters++;
            } else if (
              key === 'toggles' &&
              typeof optionValue === 'boolean' &&
              optionValue
            ) {
              activeFilters++;
            }
          }
        }
        const text =
          activeFilters > 0 ? `Advanced: ${activeFilters}` : buttonText;
        setToggleText(text);
        setActive(activeFilters > 0);
      } else {
        setToggleText(buttonText);
        setActive(false);
      }
    } else {
      setToggleText(buttonText);
      setActive(false);
    }
  }, [select_options, buttonText, type]);

  const onClose = useCallback(
    (e) => {
      e.stopPropagation();
      onReset();
    },
    [onReset]
  );

  return (
    <Dropdown>
      <StyledButton
        onClick={toggleOpen}
        style={buttonStyles(isComponentVisible)}
        ref={ref_toggle}
        className={className}
      >
        {toggleText}
        {active ? (
          <CloseIcon className="ml-1" onClick={onClose} />
        ) : arrowIcon ? (
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
