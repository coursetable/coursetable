// @ts-nocheck
/* eslint-disable react/react-in-jsx-scope */
import React, { useMemo } from 'react';
import { DefaultTheme, useTheme } from 'styled-components';
import makeAnimated from 'react-select/animated';
import chroma from 'chroma-js';
import Select, {
  OptionTypeBase,
  Props as SelectProps,
  StylesConfig,
  Theme,
  mergeStyles,
} from 'react-select';
import { ThemeConfig } from 'react-select/src/theme';

// Styles for the select indicators
const indicatorStyles = (
  theme: DefaultTheme,
  isMulti: boolean,
): StylesConfig => {
  const icon_focus = chroma(theme.icon_focus);
  const icon = chroma(theme.icon);
  const new_icon_focus =
    theme.theme === 'light' ? icon_focus.darken() : icon_focus.brighten();
  const new_icon = theme.theme === 'light' ? icon.darken() : icon.brighten();

  return {
    clearIndicator: (base, state) => {
      return {
        ...base,
        color: state.isFocused ? icon_focus.css() : icon.css(),
        ':hover': {
          ...(base as any)[':hover'],
          color: state.isFocused ? new_icon_focus.css() : new_icon.css(),
        },
      };
    },
    dropdownIndicator: (base, state) => {
      return {
        ...base,
        display: isMulti && state.hasValue ? 'none' : 'flex',
        color: state.isFocused ? icon_focus.css() : icon.css(),
        ':hover': {
          ...(base as any)[':hover'],
          color: state.isFocused ? new_icon_focus.css() : new_icon.css(),
        },
      };
    },
    indicatorSeparator: (base) => ({
      ...base,
      display: 'none',
    }),
  };
};

// Styles for default select
const defaultStyles = (theme: DefaultTheme): StylesConfig => {
  return {
    control: (base, { isDisabled }) => ({
      ...base,
      cursor: isDisabled ? 'not-allowed' : 'pointer',
      backgroundColor: isDisabled ? theme.disabled : theme.select,
      borderColor: 'rgba(0, 0, 0, 0.1)',
      borderWidth: '2px',
      transition: 'none',
      userSelect: 'none',
    }),
    menu: (base) => ({
      ...base,
      paddingTop: 0,
      marginTop: 0,
      borderRadius: '8px',
      boxShadow:
        '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    }),
    menuList: (base) => ({
      ...base,
      paddingTop: 0,
      paddingBottom: 0,
      borderRadius: '8px',
    }),
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
    multiValue: (base) => {
      return {
        ...base,
      };
    },
    multiValueLabel: (base) => {
      return {
        ...base,
      };
    },
    option: (base, { isSelected }) => ({
      ...base,
      cursor: 'pointer',
      color: isSelected && 'white',
    }),
    singleValue: (base, { isDisabled }) => ({
      ...base,
      color: isDisabled && theme.text[2],
    }),
  };
};

// Styles for popout select
const popoutStyles = (theme: DefaultTheme, width: number): StylesConfig => {
  return {
    control: (base, { isDisabled }) => ({
      ...base,
      cursor: isDisabled ? 'not-allowed' : 'pointer',
      backgroundColor: isDisabled ? theme.disabled : theme.select,
      borderColor: 'rgba(0, 0, 0, 0.1)',
      minWidth: width,
      margin: 8,
    }),
    dropdownIndicator: (base) => {
      return {
        ...base,
        display: 'none',
      };
    },
    menu: () => ({ boxShadow: 'inset 0 1px 0 rgba(0, 0, 0, 0.1)' }),
    option: (base) => ({
      ...base,
      cursor: 'pointer',
    }),
  };
};

// Styles for skills/areas select
const colorStyles = (): StylesConfig => {
  return {
    multiValue: (base, { data }) => {
      const color = chroma(data.color);
      return {
        ...base,
        backgroundColor: color.alpha(0.16).css(),
      };
    },
    multiValueLabel: (base, { data }) => ({
      ...base,
      color: data.color,
      fontWeight: 'bold',
    }),
    multiValueRemove: (base, { data }) => ({
      ...base,
      color: data.color,
      ':hover': {
        backgroundColor: data.color,
        color: 'white',
      },
    }),
    option: (base, { data, isDisabled, isFocused, isSelected }) => {
      const color = chroma(data.color);
      return {
        ...base,
        fontWeight: 'bold',
        backgroundColor: isDisabled
          ? null
          : isSelected
          ? data.color
          : isFocused
          ? color.alpha(0.1).css()
          : null,
        color: isDisabled
          ? '#ccc'
          : isSelected
          ? chroma.contrast(color, 'white') > 2
            ? 'white'
            : 'black'
          : data.color,

        ':active': {
          ...(base as any)[':active'],
          backgroundColor:
            !isDisabled && (isSelected ? data.color : color.alpha(0.5).css()),
        },
      };
    },
  };
};

type Props = {
  popout?: boolean;
  useColors?: boolean;
  isMulti?: boolean;
};

/**
 * Custom Component for React-Select
 * @prop popout - rendering on a popout?
 * @prop useColors - use the color styles?
 * @prop isMulti - multi select?
 */
function CustomSelect<T extends OptionTypeBase>({
  popout = false,
  useColors = false,
  isMulti = false,
  ...props
}: SelectProps<T, boolean> & Props) {
  const globalTheme = useTheme();

  // All the default theme colors
  const themeStyles: ThemeConfig = (theme: Theme): Theme => ({
    ...theme,
    borderRadius: 8,
    colors: {
      ...theme.colors,
      // primary: '', // border :focus & optionBackground :selected
      // primary75: '', //
      primary50: '#85c2ff', // optionBackground :focus
      primary25: globalTheme.select_hover, // optionBackground :hover
      // danger: '', // selectedOptionClear :hover
      // dangerLight: '', // selectedOptionClearBackground :hover
      neutral0: globalTheme.select, // allBackground & optionText :selected
      neutral10: globalTheme.multivalue, // selectedOptionBackground & disabledBorder
      // neutral20: 'rgba(0, 0, 0, 0.1)', // border & dropdownIcon & clearIcon
      neutral30: 'hsl(0, 0%, 70%)', // border :hover
      // neutral40: '', // dropdownIcon :hover & clearIcon :hover & noOptionsText
      // neutral50: '', // placeholder
      neutral60: globalTheme.text[0], // dropdownIconFocus & clearIconFocus
      // neutral70: '', //
      neutral80: globalTheme.text[0], // selectedOtionText & dropdownIconFocus :hover & clearIconFocus :hover
      // neutral90: '', //
    },
  });

  // Makes Select forms animated
  const animatedComponents = useMemo(() => makeAnimated<T>(), []);

  // Configure styles
  let styles: StylesConfig;
  if (popout) {
    styles = mergeStyles(
      indicatorStyles(globalTheme, isMulti),
      popoutStyles(globalTheme, 400),
    );
  } else {
    styles = mergeStyles(
      indicatorStyles(globalTheme, isMulti),
      defaultStyles(globalTheme),
    );
  }
  if (useColors) {
    styles = mergeStyles(styles, colorStyles());
  }

  return (
    <Select<T>
      {...props}
      isMulti={isMulti}
      styles={styles}
      components={animatedComponents}
      theme={themeStyles}
    />
  );
}

export default CustomSelect;
