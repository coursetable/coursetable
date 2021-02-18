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
    select_hover: string;
    multivalue: string;
    hidden: string;
    disabled: string;
    button_hover: string;
    button_active: string;
    icon: string;
    icon_focus: string;
    rating_alpha: number;
    primary: string;
    primary_hover: string;
    row_odd: string;
  }
}
