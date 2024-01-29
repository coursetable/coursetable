import React from 'react';
import styled from 'styled-components';
import clsx from 'clsx';
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';
import { IoClose } from 'react-icons/io5';
import chroma from 'chroma-js';

import {
  breakpoints,
  useComponentVisibleDropdown,
} from '../../utilities/display';
import { isOption, type Option } from '../../contexts/searchContext';
import styles from './Popout.module.css';

// Popout button
const StyledButton = styled.div`
  ${breakpoints('font-size', 'px', [{ 1320: 12 }])};
`;

// Clear filter button
const ClearIcon = styled(IoClose)`
  &:hover {
    color: ${({ theme }) =>
      theme.theme === 'light'
        ? chroma(theme.iconFocus).darken().css()
        : chroma(theme.iconFocus).brighten().css()};
  }
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
    <div
      data-tutorial={dataTutorial ? `catalog-${dataTutorial}-observe` : ''}
      className={styles.wrapper}
    >
      {/* Popout Button */}
      <StyledButton
        onClick={() => setIsComponentVisible(!isComponentVisible)}
        style={buttonStyles(isComponentVisible)}
        ref={toggleRef}
        className={clsx(className, styles.button)}
        data-tutorial={dataTutorial ? `catalog-${dataTutorial}` : ''}
      >
        {text ?? buttonText}
        {text && clearIcon ? (
          <ClearIcon
            className={clsx(styles.clearIcon, 'ml-1')}
            onClick={(e) => {
              // Prevent parent popout button onClick from firing and opening
              // dropdown
              e.stopPropagation();
              onReset?.();
            }}
          />
        ) : arrowIcon ? (
          isComponentVisible ? (
            <IoMdArrowDropdown className={clsx(styles.arrowIcon, 'ml-1')} />
          ) : (
            <IoMdArrowDropup className={clsx(styles.arrowIcon, 'ml-1')} />
          )
        ) : null}
      </StyledButton>
      {/* Dropdown */}
      {isComponentVisible ? (
        <div className={styles.dropdown} ref={dropdownRef}>
          {children}
        </div>
      ) : null}
    </div>
  );
}
