/* eslint-disable react/react-in-jsx-scope */
import { useMemo } from 'react';
import { DefaultTheme, useTheme } from 'styled-components';
import makeAnimated from 'react-select/animated';
import chroma from 'chroma-js';
import Select, {
  OptionTypeBase,
  Props as SelectProps,
  StylesConfig,
  Theme,
} from 'react-select';
import { ThemeConfig } from 'react-select/src/theme';

const defaultStyles = (theme: DefaultTheme): StylesConfig => {
  return {
    control: (base, { isDisabled }) => ({
      ...base,
      cursor: isDisabled ? 'not-allowed' : 'pointer',
      backgroundColor: isDisabled ? theme.disabled : theme.select,
      borderColor: 'rgba(0, 0, 0, 0.1)',
      borderWidth: '2px',
      transition:
        'background-color 0.2s linear, border 0.2s linear, color 0.2s linear',
    }),
    menu: (base) => ({
      ...base,
      paddingTop: 0,
      marginTop: 0,
      boxShadow:
        '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    }),
    menuList: (base) => ({
      ...base,
      paddingTop: 0,
      paddingBottom: 0,
    }),
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
    multiValue: (base) => {
      return {
        ...base,
        transition: '0.2s linear',
      };
    },
    multiValueLabel: (base) => {
      return {
        ...base,
        transition: '0.2s linear',
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
      transition: 'color 0.2s linear',
    }),
  };
};

const popoutStyles = (width: number): StylesConfig => {
  return {
    control: (base, { isDisabled }) => ({
      ...base,
      cursor: isDisabled ? 'not-allowed' : 'pointer',
      minWidth: width,
      margin: 8,
    }),
    menu: () => ({ boxShadow: 'inset 0 1px 0 rgba(0, 0, 0, 0.1)' }),
    option: (base) => ({
      ...base,
      cursor: 'pointer',
    }),
  };
};

const colorStyles = (theme: DefaultTheme): StylesConfig => {
  return {
    control: (base, { isDisabled }) => ({
      ...base,
      cursor: isDisabled ? 'not-allowed' : 'pointer',
      backgroundColor: isDisabled ? theme.disabled : theme.select,
      borderColor: 'rgba(0, 0, 0, 0.1)',
      borderWidth: '2px',
      transition:
        'background-color 0.2s linear, border 0.2s linear, color 0.2s linear',
    }),
    menu: (base) => ({
      ...base,
      paddingTop: 0,
      marginTop: 0,
      boxShadow:
        '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    }),
    menuList: (base) => ({
      ...base,
      paddingTop: 0,
      paddingBottom: 0,
    }),
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
    multiValue: (base, { data }) => {
      const color = chroma(data.color);
      return {
        ...base,
        backgroundColor: color.alpha(0.16).css(),
        transition: '0.2s linear',
      };
    },
    multiValueLabel: (base, { data }) => ({
      ...base,
      color: data.color,
      fontWeight: 'bold',
      transition: '0.2s linear',
    }),
    multiValueRemove: (base, { data }) => ({
      ...base,
      color: data.color,
      ':hover': {
        backgroundColor: data.color,
        color: 'white',
      },
      transition: '0.2s linear',
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
        cursor: isDisabled ? 'not-allowed' : 'pointer',

        ':active': {
          ...(base as any)[':active'],
          backgroundColor:
            !isDisabled && (isSelected ? data.color : color.alpha(0.5).css()),
        },
      };
    },
    singleValue: (base, { isDisabled }) => ({
      ...base,
      color: isDisabled && theme.text[2],
      transition: 'color 0.2s linear',
    }),
  };
};

type Props = {
  useColors?: boolean;
  popout?: boolean;
};

/**
 * Custom Component for React-Select
 * @prop useColors - boolean | should we use the color version of styles?
 */
function CustomSelect<T extends OptionTypeBase>({
  useColors = false,
  popout = false,
  ...props
}: SelectProps<T> & Props) {
  const globalTheme = useTheme();

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
      neutral20: 'rgba(0, 0, 0, 0.1)', // border & dropdownIcon & clearIcon
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

  let styles: StylesConfig;
  if (popout) {
    styles = popoutStyles(300);
  } else if (useColors) {
    styles = colorStyles(globalTheme);
  } else {
    styles = defaultStyles(globalTheme);
  }

  return (
    <Select<T>
      {...props}
      styles={styles}
      components={animatedComponents}
      theme={themeStyles}
    />
  );
}

export default CustomSelect;
