import React from 'react';
import styled from 'styled-components';
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';
import { IoClose } from 'react-icons/io5';
import chroma from 'chroma-js';

import {
  breakpoints,
  useComponentVisibleDropdown,
} from '../../utilities/display';
import { isOption, type Option } from '../../contexts/searchContext';

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

type Props = {
  readonly children: React.ReactNode;
  readonly buttonText: string;
  readonly onReset?: () => void;
  readonly arrowIcon?: boolean;
  readonly clearIcon?: boolean;
  readonly selectedOptions?:
    | number
    | Option<string | number>[]
    | Option<string | number>
    | null;
  readonly maxDisplayOptions?: number;
  readonly displayOptionLabel?: boolean;
  readonly className?: string;
  readonly dataTutorial?: number;
};

function getText(
  selectedOptions: Props['selectedOptions'],
  maxDisplayOptions: number,
  displayOptionLabel: boolean | undefined,
): undefined | string | JSX.Element[] {
  if (!selectedOptions) return undefined;
  if (Array.isArray(selectedOptions)) {
    if (selectedOptions.length === 0) return undefined;
    const topOptions = selectedOptions.slice(0, maxDisplayOptions);
    const text = topOptions.map((option, index) => {
      const optionLabel = displayOptionLabel ? option.label : option.value;
      const span = <span style={{ color: option.color }}>{optionLabel}</span>;
      if (index < topOptions.length - 1)
        return <React.Fragment key={index}>{span}, </React.Fragment>;
      if (
        index === topOptions.length - 1 &&
        selectedOptions.length > maxDisplayOptions
      ) {
        return (
          <React.Fragment key={index}>
            {span} + {selectedOptions.length - maxDisplayOptions}
          </React.Fragment>
        );
      }
      return <React.Fragment key={index}>{span}</React.Fragment>;
    });
    return text;
  } else if (isOption(selectedOptions)) {
    return displayOptionLabel
      ? selectedOptions.label
      : String(selectedOptions.value);
  }
  return selectedOptions !== 0 ? `Advanced: ${selectedOptions}` : undefined;
}

export function Popout({
  children,
  buttonText,
  onReset,
  arrowIcon = true,
  clearIcon = true,
  selectedOptions,
  maxDisplayOptions = 3,
  displayOptionLabel,
  className,
  dataTutorial,
}: Props) {
  // Ref to detect outside clicks for popout button and dropdown
  const { toggleRef, dropdownRef, isComponentVisible, setIsComponentVisible } =
    useComponentVisibleDropdown<HTMLDivElement>(false);
  const text = getText(selectedOptions, maxDisplayOptions, displayOptionLabel);

  // Popout button styles for open and active states
  const buttonStyles = (open: boolean) => {
    if (open) {
      return {
        backgroundColor: 'var(--color-button-active)',
        color: 'var(--color-primary-hover)',
      };
    }
    if (text) {
      return {
        color: 'var(--color-primary-hover)',
      };
    }
    return undefined;
  };

  return (
    <PopoutWrapper
      data-tutorial={dataTutorial ? `catalog-${dataTutorial}-observe` : ''}
    >
      {/* Popout Button */}
      <StyledButton
        onClick={() => setIsComponentVisible(!isComponentVisible)}
        style={buttonStyles(isComponentVisible)}
        ref={toggleRef}
        className={className}
        data-tutorial={dataTutorial ? `catalog-${dataTutorial}` : ''}
      >
        {text ?? buttonText}
        {text && clearIcon ? (
          <ClearIcon
            className="ml-1"
            onClick={(e) => {
              // Prevent parent popout button onClick from firing and opening
              // dropdown
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
        ) : null}
      </StyledButton>
      {/* Dropdown */}
      {isComponentVisible ? (
        <Dropdown ref={dropdownRef}>{children}</Dropdown>
      ) : null}
    </PopoutWrapper>
  );
}
