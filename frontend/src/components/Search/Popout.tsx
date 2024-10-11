import React from 'react';
import clsx from 'clsx';
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';
import { IoClose } from 'react-icons/io5';

import type { Option } from '../../contexts/searchContext';
import { useComponentVisibleDropdown } from '../../utilities/display';
import styles from './Popout.module.css';

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
  readonly notifications?: number;
  readonly colors?: { [optionValue: string]: string };
  readonly dataTutorial?: number;
};

function getText(
  selectedOptions: Props['selectedOptions'],
  maxDisplayOptions: number,
  displayOptionLabel: boolean | undefined,
  colors: { [optionValue: string]: string } | undefined,
): undefined | string | React.JSX.Element[] {
  if (!selectedOptions) return undefined;
  if (Array.isArray(selectedOptions)) {
    if (selectedOptions.length === 0) return undefined;
    const topOptions = selectedOptions.slice(0, maxDisplayOptions);
    const text = topOptions.map((option, index) => {
      const optionLabel = displayOptionLabel ? option.label : option.value;
      const color = colors?.[option.value];
      const span = color ? (
        <span style={{ color }}>{optionLabel}</span>
      ) : (
        optionLabel
      );
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
  } else if (typeof selectedOptions === 'object') {
    return displayOptionLabel
      ? selectedOptions.label
      : String(selectedOptions.value);
  }
  return selectedOptions !== 0 ? `Advanced: ${selectedOptions}` : undefined;
}

function NotificationIcon({ count }: { readonly count: number }) {
  return (
    <div className={styles.notificationIcon}>
      <span>{count}</span>
    </div>
  );
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
  notifications,
  colors,
  dataTutorial,
}: Props) {
  // Ref to detect outside clicks for popout button and dropdown
  const { toggleRef, dropdownRef, isComponentVisible, setIsComponentVisible } =
    useComponentVisibleDropdown<HTMLButtonElement, HTMLDivElement>(false);
  const text = getText(
    selectedOptions,
    maxDisplayOptions,
    displayOptionLabel,
    colors,
  );

  // Popout button styles for open and active states
  const buttonStyles = (open: boolean) => {
    if (open) {
      return {
        backgroundColor: 'var(--color-surface-active)',
        color: 'var(--color-primary)',
      };
    }
    if (text) {
      return {
        color: 'var(--color-primary)',
      };
    }
    return undefined;
  };

  // eslint-disable-next-line no-useless-assignment
  const ArrowIcon = isComponentVisible ? IoMdArrowDropdown : IoMdArrowDropup;

  return (
    <div
      data-tutorial={dataTutorial ? `catalog-${dataTutorial}-observe` : ''}
      className={styles.wrapper}
    >
      {/* Popout Button */}
      <button
        type="button"
        onClick={() => setIsComponentVisible(!isComponentVisible)}
        style={buttonStyles(isComponentVisible)}
        ref={toggleRef}
        className={clsx(className, styles.button)}
        data-tutorial={dataTutorial ? `catalog-${dataTutorial}` : ''}
      >
        {text ?? buttonText}
        {text && clearIcon ? (
          <IoClose
            className={clsx(styles.clearIcon, 'ms-1')}
            onClick={(e) => {
              // Prevent parent popout button onClick from firing and opening
              // dropdown
              e.stopPropagation();
              onReset?.();
            }}
          />
        ) : arrowIcon ? (
          <ArrowIcon className={clsx(styles.arrowIcon, 'ms-1')} />
        ) : null}
        {notifications ? <NotificationIcon count={notifications} /> : null}
      </button>
      {/* Dropdown */}
      {isComponentVisible ? (
        <div className={styles.dropdown} ref={dropdownRef}>
          {children}
        </div>
      ) : null}
    </div>
  );
}
