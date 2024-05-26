import React, { forwardRef } from 'react';
import clsx from 'clsx';
import { FormControl, Popover } from 'react-bootstrap';
import type chroma from 'chroma-js';
import { useTheme } from '../contexts/themeContext';
import styles from './Typography.module.css';

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

export function TextComponent({
  type,
  small,
  as: As = 'span',
  className,
  ...props
}: {
  readonly type?: 'primary' | 'secondary' | 'tertiary';
  readonly small?: boolean;
  readonly as?: React.ElementType;
} & React.ComponentProps<'span'>) {
  return (
    <As
      {...props}
      className={clsx(
        styles.text,
        type === 'secondary'
          ? styles.secondaryText
          : type === 'tertiary'
            ? styles.tertiaryText
            : undefined,
        small && styles.smallText,
        className,
      )}
    />
  );
}

export const Input = forwardRef(
  ({ className, ...props }: React.ComponentProps<typeof FormControl>, ref) => (
    <FormControl
      {...props}
      ref={ref}
      className={clsx(styles.input, className)}
    />
  ),
);

export const InfoPopover = forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof Popover>
>(({ className, ...props }, ref) => (
  <Popover
    {...props}
    ref={ref}
    className={clsx(styles.infoPopover, className)}
  />
));

// Rating bubbles in search results list item and modal
export const RatingBubble = forwardRef<
  HTMLSpanElement,
  (
    | {
        readonly rating: number | null | undefined;
        readonly colorMap: chroma.Scale;
        readonly color?: never;
      }
    | {
        readonly rating?: never;
        readonly colorMap?: never;
        readonly color: chroma.Color;
      }
  ) &
    Omit<React.ComponentProps<'span'>, 'color'>
>(({ rating, colorMap, className, style, color, ...props }, ref) => {
  const { theme } = useTheme();
  return (
    <span
      {...props}
      ref={ref}
      className={clsx(
        styles.ratingBubble,
        rating && styles.hasRating,
        className,
      )}
      style={{
        ...style,
        backgroundColor: (color ?? (rating ? colorMap(rating) : undefined))
          ?.alpha(theme === 'light' ? 1 : 0.75)
          .css(),
      }}
    />
  );
});

// Primary Color link
export const LinkLikeText = forwardRef<
  HTMLButtonElement,
  React.ComponentProps<'button'>
>(({ className, ...props }, ref) => (
  <button
    type="button"
    ref={ref}
    {...props}
    className={clsx(styles.linkText, className)}
  />
));
