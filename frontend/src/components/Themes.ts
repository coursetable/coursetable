import type { DefaultTheme } from 'styled-components';

/**
 * CAUTION: Some unrelated elements/components may depend on certain colors
 * below. When altering the values below, ensure that it is only for the element
 * you want and search for all of that color's uses throughout the codebase.
 */

export const lightTheme: DefaultTheme = {
  icon: 'rgb(204, 204, 204)', // Icon color
  iconFocus: 'rgb(102, 102, 102)', // Icon focus color
  ratingAlpha: 1, // Rating bubble's opacity
};
export const darkTheme: DefaultTheme = {
  icon: 'rgb(102, 102, 102)', // Icon color
  iconFocus: 'rgb(204, 204, 204)', // Icon focus color
  ratingAlpha: 0.75, // Rating bubble's opacity
};
