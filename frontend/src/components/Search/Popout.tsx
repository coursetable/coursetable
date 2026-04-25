import React, { useEffect, useId, useState } from 'react';
import clsx from 'clsx';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';
import { IoClose } from 'react-icons/io5';
import type { Option } from '../../search/searchTypes';
import { useComponentVisibleDropdown } from '../../utilities/display';
import styles from './Popout.module.css';

type Props = {
  readonly children: React.ReactNode;
  readonly buttonText: string;
  readonly onOpenChange?: (open: boolean) => void;
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
  readonly wrapperClassName?: string;
  readonly dropdownClassName?: string;
  readonly notifications?: number;
  readonly colors?: { [optionValue: string]: string };
  readonly dataTutorial?: number;
  readonly Icon?: React.JSX.Element;
  readonly betaTooltip?: string;
  readonly fullWidth?: boolean;
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
  onOpenChange,
  onReset,
  arrowIcon = true,
  clearIcon = true,
  selectedOptions,
  maxDisplayOptions = 3,
  displayOptionLabel,
  className,
  wrapperClassName,
  dropdownClassName,
  notifications,
  colors,
  dataTutorial,
  Icon,
  betaTooltip,
  fullWidth,
}: Props) {
  const betaTooltipId = useId();
  // Ref to detect outside clicks for popout button and dropdown
  const { toggleRef, dropdownRef, isComponentVisible, setIsComponentVisible } =
    useComponentVisibleDropdown<HTMLButtonElement, HTMLDivElement>(false);

  useEffect(() => {
    onOpenChange?.(isComponentVisible);
  }, [isComponentVisible, onOpenChange]);

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

  const ArrowIcon = isComponentVisible ? IoMdArrowDropdown : IoMdArrowDropup;
  const [dropdownXOffset, setDropdownXOffset] = useState(0);

  useEffect(() => {
    // Avoid the dropdown going out of the viewport. By default it's left-
    // aligned with the trigger button, but we may have to left-shift it.
    // Note: we only reposition the dropdown once when it becomes visible.
    // this is on purpose: when resizing the window, the resize event fires
    // before reflow happens, so the dropdown tends to flicker and become
    // unstable.
    if (!isComponentVisible) {
      setDropdownXOffset(0);
      return;
    }
    if (!dropdownRef.current) return;
    const dropdownRect = dropdownRef.current.getBoundingClientRect();
    // Cancel the effect of the existing x-shift
    const realLeft = dropdownRect.left - dropdownXOffset;
    const realRight = dropdownRect.right - dropdownXOffset;
    if (realRight > window.innerWidth)
      setDropdownXOffset(Math.max(-realLeft, window.innerWidth - realRight));
    else setDropdownXOffset(0);
  }, [isComponentVisible, dropdownXOffset, dropdownRef]);

  const triggerButton = (
    <button
      type="button"
      onClick={() => setIsComponentVisible(!isComponentVisible)}
      style={buttonStyles(isComponentVisible)}
      ref={toggleRef}
      className={clsx(
        className,
        styles.button,
        betaTooltip && styles.buttonWithBeta,
        fullWidth && styles.buttonFullWidth,
      )}
      data-tutorial={dataTutorial ? `catalog-${dataTutorial}` : ''}
    >
      {Icon ?? null}
      <div>{text ?? buttonText}</div>

      {text && clearIcon ? (
        <IoClose
          className={styles.clearIcon}
          onClick={(e) => {
            // Prevent parent popout onClick from toggling the dropdown
            e.stopPropagation();
            onReset?.();
          }}
        />
      ) : arrowIcon ? (
        <ArrowIcon className={styles.arrowIcon} />
      ) : null}
      {notifications ? <NotificationIcon count={notifications} /> : null}
      {betaTooltip ? (
        <span className={styles.betaIndicator} aria-hidden="true" />
      ) : null}
    </button>
  );

  return (
    <div
      data-tutorial={
        dataTutorial ? `catalog-${dataTutorial}-observe` : undefined
      }
      className={clsx(
        styles.wrapper,
        fullWidth && styles.wrapperFullWidth,
        wrapperClassName,
      )}
    >
      {betaTooltip ? (
        <OverlayTrigger
          placement="top"
          overlay={<Tooltip id={betaTooltipId}>{betaTooltip}</Tooltip>}
        >
          {triggerButton}
        </OverlayTrigger>
      ) : (
        triggerButton
      )}
      {isComponentVisible ? (
        <div
          className={clsx(
            styles.dropdown,
            fullWidth && styles.dropdownFullWidth,
            dropdownClassName,
          )}
          ref={dropdownRef}
          style={
            dropdownXOffset
              ? { transform: `translateX(${dropdownXOffset}px)` }
              : undefined
          }
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}
