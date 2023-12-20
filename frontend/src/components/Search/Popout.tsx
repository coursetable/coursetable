import React, { useEffect, useState } from 'react';

import styled, { useTheme } from 'styled-components';

import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';
import { IoClose } from 'react-icons/io5';
import { breakpoints, useComponentVisibleDropdown } from '../../utilities';
import chroma from 'chroma-js';
import { isOption } from '../../contexts/searchContext';

// Entire popout component
const PopoutWrapper = styled.div`
  position: relative;
`;

// Actual part that drops down
const shadow = 'hsla(218, 50%, 10%, 0.1)';
const Dropdown = styled.div`
  background-color: ${({ theme }) => theme.select};
  border-radius: 4px;
  box-shadow:
    0 0 0 1px ${shadow},
    0 4px 11px ${shadow};
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
  transition:
    border-color ${({ theme }) => theme.transDur},
    background-color ${({ theme }) => theme.transDur},
    color ${({ theme }) => theme.transDur};

  &:hover {
    background-color: ${({ theme }) => theme.buttonHover};
    color: ${({ theme }) => theme.primaryHover};
  }

  &:active {
    background-color: ${({ theme }) => theme.buttonActive};
    color: ${({ theme }) => theme.primaryHover};
  }
`;

// Clear filter button
const ClearIcon = styled(IoClose)`
  z-index: 1000;
  cursor: pointer;
  color: ${({ theme }) => theme.iconFocus};
  transition: color ${({ theme }) => theme.transDur};
  &:hover {
    color: ${({ theme }) =>
      theme.theme === 'light'
        ? chroma(theme.iconFocus).darken().css()
        : chroma(theme.iconFocus).brighten().css()};
  }
`;

// Down icon
const DownIcon = styled(IoMdArrowDropdown)`
  color: ${({ theme }) => theme.iconFocus};
  transition: color ${({ theme }) => theme.transDur};
`;

// Up icon
const UpIcon = styled(IoMdArrowDropup)`
  color: ${({ theme }) => theme.iconFocus};
  transition: color ${({ theme }) => theme.transDur};
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
  isDisabled?: boolean;
  onReset?: () => void;
  arrowIcon?: boolean;
  clearIcon?: boolean;
  select_options?:
    | Option[]
    | Record<string, Record<string, Option[] | boolean>>
    | Option
    | null;
  className?: string;
  data_tutorial?: number;
  disabledButtonText?: string;
};

/**
 * Popout component for filters in the navbar search
 * @prop children
 * @prop buttonText - default placeholder for popout button
 * @prop type - type of filter
 * @prop isDisabled - whether or not popout is disabled
 * @prop onReset - reset filter function
 * @prop arrowIcon - whether there is an arrow icon in the popout button
 * @prop clearIcon - whether there is an clear icon in the popout button
 * @prop select_options - selected option(s) for filter
 * @prop className - additional styles for popout button
 * @prop data_tutorial - tutorial step number
 * @prop disabledButtonText - default placeholder for disabled popout button
 */
export function Popout({
  children,
  buttonText,
  type,
  isDisabled = false,
  onReset,
  arrowIcon = true,
  clearIcon = true,
  select_options,
  className,
  data_tutorial,
  disabledButtonText,
}: Props) {
  // Ref to detect outside clicks for popout button and dropdown
  const { toggleRef, dropdownRef, isComponentVisible, setIsComponentVisible } =
    useComponentVisibleDropdown<HTMLDivElement>(false);
  const theme = useTheme();

  // Dynamic text state for active popout button
  const [toggleText, setToggleText] = useState<string | JSX.Element[]>(
    buttonText,
  );
  // Active state
  const [active, setActive] = useState(false);

  // Popout button styles for open and active states
  const buttonStyles = (open: boolean) => {
    if (open) {
      return {
        backgroundColor: theme.buttonActive,
        color: theme.primaryHover,
      };
    }
    if (active) {
      return {
        color: theme.primaryHover,
      };
    }
    return undefined;
  };

  // Dynamically set popout button text based on selected options
  useEffect(() => {
    if (isDisabled && disabledButtonText) {
      setToggleText(disabledButtonText);
      setActive(false);
    } else if (select_options) {
      if (Array.isArray(select_options) && select_options.length > 0) {
        const maxOptions = type === 'season' ? 1 : 3;
        const topOptions = select_options.slice(0, maxOptions);
        const text = topOptions.map((option, index) => {
          const optionLabel = type === 'season' ? option.label : option.value;
          const colorStyle =
            type === 'skills/areas' ? { color: option.color } : undefined;
          const span = (
            <span style={colorStyle} key={optionLabel}>
              {optionLabel}
            </span>
          );
          if (topOptions.length > 1 && index < maxOptions - 1) {
            return <>{span}, </>;
          }
          if (select_options.length > maxOptions) {
            return (
              <>
                {span} + {select_options.length - maxOptions}
              </>
            );
          }
          return span;
        });
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
            } else if (key === 'ranges' && optionValue) {
              activeFilters++;
            } else if (
              key === 'toggles' &&
              typeof optionValue === 'boolean' &&
              optionValue
            ) {
              activeFilters++;
            } else if (key === 'sorts' && optionValue) {
              activeFilters++;
            }
          }
        }
        const text =
          activeFilters > 0 ? `Advanced: ${activeFilters}` : buttonText;
        setToggleText(text);
        setActive(activeFilters > 0);
      } else if (
        select_options !== null &&
        typeof select_options === 'object' &&
        !Array.isArray(select_options) &&
        isOption(select_options)
      ) {
        setToggleText(select_options.label);
        setActive(true);
      } else {
        setToggleText(buttonText);
        setActive(false);
      }
    } else {
      setToggleText(buttonText);
      setActive(false);
    }
  }, [select_options, buttonText, type, disabledButtonText, isDisabled]);

  return (
    <PopoutWrapper
      data-tutorial={data_tutorial ? `catalog-${data_tutorial}-observe` : ''}
    >
      {/* Popout Button */}
      <StyledButton
        onClick={() => setIsComponentVisible(!isComponentVisible)}
        style={buttonStyles(isComponentVisible)}
        ref={toggleRef}
        className={className}
        data-tutorial={data_tutorial ? `catalog-${data_tutorial}` : ''}
      >
        {toggleText}
        {active && clearIcon ? (
          <ClearIcon
            className="ml-1"
            onClick={(e) => {
              // Prevent parent popout button onClick from firing and opening dropdown
              e.stopPropagation();
              onReset?.();
            }}
          />
        ) : arrowIcon ? (
          isComponentVisible ? (
            <DownIcon className="ml-1" />
          ) : (
            <UpIcon className="ml-1" />
          )
        ) : (
          <></>
        )}
      </StyledButton>
      {/* Dropdown */}
      {isComponentVisible ? (
        <Dropdown ref={dropdownRef}>{children}</Dropdown>
      ) : null}
    </PopoutWrapper>
  );
}
