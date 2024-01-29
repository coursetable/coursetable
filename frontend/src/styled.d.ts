import 'styled-components';

// Based on https://styled-components.com/docs/api#typescript.
declare module 'styled-components' {
  export interface DefaultTheme {
    icon: string;
    iconFocus: string;
    ratingAlpha: number;
  }
}
