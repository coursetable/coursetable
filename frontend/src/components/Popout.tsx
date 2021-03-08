import React, { useCallback, useEffect, useState } from 'react';

import styled, { useTheme } from 'styled-components';

import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';
import { IoClose } from 'react-icons/io5';
import { breakpoints, useComponentVisibleDropdown } from '../utilities';
import chroma from 'chroma-js';

// Entire popout component
const PopoutWrapper = styled.div`
  position: relative;
`;

// Actual part that drops down
const shadow = 'hsla(218, 50%, 10%, 0.1)';
const Dropdown = styled.div`
  background-color: ${({ theme }) => theme.select};
  border-radius: 4px;
  box-shadow: 0 0 0 1px ${shadow}, 0 4px 11px ${shadow};
  margin-top: 8px;
  position: absolute;
  z-index: 1000;
`;

// Popout button
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

// Clear filter button
const ClearIcon = styled(IoClose)`
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
  data_tutorial?: number;
};

/**
 * Popout component for filters in the navbar search
 * @prop children
 * @prop buttonText - default placeholder for popout button
 * @prop type - type of filter
 * @prop onReset - reset filter function
 * @prop arrowIcon - whether there is an arrow icon in the popout button
 * @prop select_options - selected options for filter
 * @prop className - additional styles for popout button
 * @prop data_tutorial - tutorial step number
 */
export const Popout: React.FC<Props> = ({
  children,
  buttonText,
  type,
  onReset,
  arrowIcon = true,
  select_options,
  className,
  data_tutorial,
}) => {
  // Ref to detect outside clicks for popout button and dropdown
  const {
    ref_toggle,
    ref_dropdown,
    isComponentVisible,
    setIsComponentVisible,
  } = useComponentVisibleDropdown<HTMLDivElement>(false);

  // Open popout handler
  const toggleOpen = () => {
    setIsComponentVisible(!isComponentVisible);
  };

  const theme = useTheme();

  // Dynamic text state for active popout button
  const [toggleText, setToggleText] = useState(buttonText);
  // Active state
  const [active, setActive] = useState(false);

  // Popout button styles for open and active states
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

  // Dynamically set popout button text based on selected options
  useEffect(() => {
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

  // Clear filter handler
  const onClear = useCallback(
    (e) => {
      // Prevent parent popout button onClick from firing and opening dropdown
      e.stopPropagation();
      onReset();
    },
    [onReset]
  );

  return (
    <PopoutWrapper
      data-tutorial={data_tutorial ? `catalog-${data_tutorial}-observe` : ''}
    >
      {/* Popout Button */}
      <StyledButton
        onClick={toggleOpen}
        style={buttonStyles(isComponentVisible)}
        ref={ref_toggle}
        className={className}
        data-tutorial={data_tutorial ? `catalog-${data_tutorial}` : ''}
      >
        {toggleText}
        {active ? (
          <ClearIcon className="ml-1" onClick={onClear} />
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
      {/* Dropdown */}
      {isComponentVisible ? (
        <Dropdown ref={ref_dropdown}>{children}</Dropdown>
      ) : null}
    </PopoutWrapper>
  );
};
