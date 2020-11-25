import 'styled-components';

// From https://styled-components.com/docs/api#typescript.
declare module 'styled-components' {
  export interface DefaultTheme {
    theme: string;
    text: [string, string, string];
    background: string;
    surface: [string, string];
    banner: string;
    border: string;
    select: string;
    select_hover: string;
    multivalue: string;
    hidden: string;
    rating_alpha: number;
    primary: string;
    primary_hover: string;
  }
}
