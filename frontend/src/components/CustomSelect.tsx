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
function indicatorStyles<T extends OptionTypeBase, IsMulti extends boolean>(
  theme: DefaultTheme,
  isMulti: IsMulti,
): StylesConfig<T, IsMulti> {
  const icon_focus = chroma(theme.icon_focus);
  const icon = chroma(theme.icon);
  const new_icon_focus =
    theme.theme === 'light' ? icon_focus.darken() : icon_focus.brighten();
  const new_icon = theme.theme === 'light' ? icon.darken() : icon.brighten();

  return {
    clearIndicator: (base, state) => ({
      ...base,
      color: state.isFocused ? icon_focus.css() : icon.css(),
      ':hover': {
        ...(base as any)[':hover'],
        color: state.isFocused ? new_icon_focus.css() : new_icon.css(),
      },
    }),
    dropdownIndicator: (base, state) => ({
      ...base,
      display: isMulti && state.hasValue ? 'none' : 'flex',
      color: state.isFocused ? icon_focus.css() : icon.css(),
      ':hover': {
        ...(base as any)[':hover'],
        color: state.isFocused ? new_icon_focus.css() : new_icon.css(),
      },
    }),
    indicatorSeparator: (base) => ({
      ...base,
      display: 'none',
    }),
  };
}

// Styles for default select
function defaultStyles<T extends OptionTypeBase>(
  theme: DefaultTheme,
): StylesConfig<T, boolean> {
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
    multiValue: (base) => ({ ...base }),
    multiValueLabel: (base) => ({ ...base }),
    option: (base, { isSelected }) => ({
      ...base,
      cursor: 'pointer',
      color: isSelected ? 'white' : undefined,
    }),
    singleValue: (base, { isDisabled }) => ({
      ...base,
      color: isDisabled ? theme.text[2] : undefined,
    }),
  };
}

// Styles for popout select
function popoutStyles(
  theme: DefaultTheme,
  width: number,
): StylesConfig<OptionTypeBase, boolean> {
  return {
    control: (base, { isDisabled }) => ({
      ...base,
      cursor: isDisabled ? 'not-allowed' : 'pointer',
      backgroundColor: isDisabled ? theme.disabled : theme.select,
      borderColor: 'rgba(0, 0, 0, 0.1)',
      minWidth: width,
      margin: 8,
    }),
    dropdownIndicator: (base) => ({
      ...base,
      display: 'none',
    }),
    menu: () => ({ boxShadow: 'inset 0 1px 0 rgba(0, 0, 0, 0.1)' }),
    option: (base) => ({
      ...base,
      cursor: 'pointer',
    }),
  };
}

// Styles for skills/areas select
function colorStyles(): StylesConfig<OptionTypeBase, boolean> {
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
}

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
function CustomSelect<
  T extends OptionTypeBase,
  IsMulti extends boolean = false,
>({
  popout = false,
  useColors = false,
  isMulti = false as IsMulti,
  components,
  ...props
}: SelectProps<T, IsMulti> & Props) {
  const globalTheme = useTheme();

  // All the default theme colors
  const themeStyles: ThemeConfig = (theme: Theme): Theme => ({
    ...theme,
    borderRadius: 8,
    colors: {
      ...theme.colors,
      primary50: '#85c2ff', // optionBackground :focus
      primary25: globalTheme.select_hover, // optionBackground :hover
      neutral0: globalTheme.select, // allBackground & optionText :selected
      neutral10: globalTheme.multivalue, // selectedOptionBackground & disabledBorder
      neutral30: 'hsl(0, 0%, 70%)', // border :hover
      neutral60: globalTheme.text[0], // dropdownIconFocus & clearIconFocus
      neutral80: globalTheme.text[0], // selectedOtionText & dropdownIconFocus :hover & clearIconFocus :hover
    },
  });

  // Makes Select forms animated
  const animatedComponents = useMemo(
    () => components ?? makeAnimated<T, IsMulti>(),
    [components],
  );

  // Configure styles
  let styles = mergeStyles(
    indicatorStyles(globalTheme, isMulti),
    popout ? popoutStyles(globalTheme, 400) : defaultStyles(globalTheme),
  );
  if (useColors) {
    styles = mergeStyles(styles, colorStyles());
  }

  return (
    <Select<T, IsMulti>
      {...props}
      isMulti={isMulti}
      styles={styles as StylesConfig<T, IsMulti>}
      components={animatedComponents}
      theme={themeStyles}
    />
  );
}

export default CustomSelect;
