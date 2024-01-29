import 'styled-components';

// Based on https://styled-components.com/docs/api#typescript.
declare module 'styled-components' {
  export interface DefaultTheme {
    theme: string;
    text: [string, string, string];
    background: string;
    surface: [string, string];
    banner: string;
    border: string;
    select: string;
    selectHover: string;
    hidden: string;
    disabled: string;
    buttonHover: string;
    buttonActive: string;
    icon: string;
    iconFocus: string;
    ratingAlpha: number;
    primary: string;
    primaryLight: string;
    primaryHover: string;
    transDur: string;
  }
}
