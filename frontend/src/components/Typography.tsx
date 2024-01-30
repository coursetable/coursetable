import React, { forwardRef } from 'react';
import clsx from 'clsx';
import { FormControl, Popover } from 'react-bootstrap';
import type chroma from 'chroma-js';
import { useTheme } from '../contexts/themeContext';
import styles from './Typography.module.css';

// Div used to color the background of surface components
export function SurfaceComponent({
  elevated,
  className,
  ...props
}: {
  readonly elevated?: boolean;
} & React.ComponentProps<'div'>) {
  return (
    <div
      {...props}
      className={clsx(
        styles.surface,
        elevated && styles.surfaceElevated,
        className,
      )}
    />
  );
}

// Span used to color text. Type is an int that represents primary (0) or
// secondary (1) color
export function TextComponent({
  type,
  small,
  className,
  ...props
}: {
  readonly type?: 'primary' | 'secondary' | 'tertiary';
  readonly small?: boolean;
} & React.ComponentProps<'span'>) {
  return (
    <span
      {...props}
      className={clsx(
        styles.text,
        type === 'secondary'
          ? styles.secondaryText
          : type === 'tertiary'
            ? styles.tertiaryText
            : styles.primaryText,
        small && styles.smallText,
        className,
      )}
    />
  );
}

// FormControl for any typed inputs
export const Input = forwardRef(
  ({ className, ...props }: React.ComponentProps<typeof FormControl>, ref) => (
    <FormControl
      {...props}
      ref={ref}
      className={clsx(styles.input, className)}
    />
  ),
);

// Hr tag used to divide stuff in search form and footer
export function Hr({ className, ...props }: React.ComponentProps<'hr'>) {
  return <hr {...props} className={clsx(styles.hr, className)} />;
}

// Popovers in search results item, prof popover in modal, and worksheet
// calendar
export const InfoPopover = forwardRef(
  ({ className, ...props }: React.ComponentProps<typeof Popover>, ref) => (
    <Popover
      {...props}
      ref={ref}
      className={clsx(styles.infoPopover, className)}
    />
  ),
);

// Rating bubbles in search results list item and modal
export function RatingBubble({
  rating,
  colorMap,
  className,
  style,
  ...props
}: {
  readonly rating: number | null;
  readonly colorMap: chroma.Scale;
} & React.ComponentProps<'div'>) {
  const { theme } = useTheme();
  return (
    <div
      {...props}
      className={clsx(
        styles.ratingBubble,
        rating && styles.hasRating,
        className,
      )}
      style={{
        ...style,
        backgroundColor: rating
          ? colorMap(rating)
              .alpha(theme === 'light' ? 1 : 0.75)
              .css()
          : undefined,
      }}
    />
  );
}

// Primary Color link
export function LinkLikeText({
  className,
  ...props
}: React.ComponentProps<'span'>) {
  return <span {...props} className={clsx(styles.linkText, className)} />;
}

// Show Primary color on hover
export function HoverText({
  className,
  ...props
}: React.ComponentProps<'span'>) {
  return <span {...props} className={clsx(styles.hoverText, className)} />;
}
