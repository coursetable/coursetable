import React from 'react';
import { DefaultTheme, useTheme } from 'styled-components';
import makeAnimated from 'react-select/animated';
import chroma from 'chroma-js';
import Select, {
  OptionTypeBase,
  Props as SelectProps,
  StylesConfig,
} from 'react-select';
import { StylesConfigFunction } from 'react-select/src/styles';

// Makes Select forms animated
const animatedComponents = makeAnimated();

interface Props extends SelectProps<OptionTypeBase> {
  useColors: boolean;
}

/**
 * Custom Component for React-Select
 * @prop useColors - boolean | should we use the color version of styles?
 */
const CustomSelect: React.FC<Props> = ({ useColors = false, ...props }) => {
  const theme = useTheme();
  const select_styles = selectStyles(theme);
  const select_styles_color = colorOptionStyles(theme);
  return (
    <Select
      classNamePrefix={'Select'}
      components={animatedComponents}
      styles={useColors ? select_styles_color : select_styles}
      {...props}
    />
  );
};

export default CustomSelect;

const colorOptionStyles = (theme: DefaultTheme): StylesConfig => {
  return {
    control: (styles) => ({
      ...styles,
      borderRadius: '8px',
      cursor: 'pointer',
      backgroundColor: theme.select,
      border:
        theme.theme === 'light'
          ? '2px solid hsl(0, 0%, 90%)'
          : '2px solid ' + theme.select,
      transition: 'background-color 0.2s linear, border 0.2s linear',
    }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      const color = chroma(data.color);
      return {
        ...styles,
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
          ...(styles as any)[':active'],
          backgroundColor:
            !isDisabled && (isSelected ? data.color : color.alpha(0.5).css()),
        },
      };
    },
    singleValue: (base) => ({
      ...base,
      transition: 'color 0.2s linear',
    }),
    input: (base) => ({
      ...base,
      color: theme.text[0],
    }),
    multiValue: (styles, { data }) => {
      const color = chroma(data.color);
      return {
        ...styles,
        backgroundColor: color.alpha(0.16).css(),
        borderRadius: '6px',
      };
    },
    multiValueLabel: (styles, { data }) => ({
      ...styles,
      color: data.color,
      fontWeight: 'bold',
    }),
    multiValueRemove: (styles, { data }) => ({
      ...styles,
      color: data.color,
      borderRadius: '6px',
      ':hover': {
        backgroundColor: data.color,
        color: 'white',
      },
    }),
    menuPortal: (base) => ({ ...base, zIndex: 9999, borderRadius: '8px' }),
    menu: (base) => ({
      ...base,
      paddingTop: 0,
      marginTop: 0,
      borderRadius: '8px',
      backgroundColor: theme.select,
      boxShadow:
        '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    }),
    menuList: (base) => ({
      ...base,
      paddingTop: 0,
      paddingBottom: 0,
      borderRadius: '8px',
    }),
  };
};

const selectStyles = (theme: DefaultTheme): StylesConfig => {
  return {
    multiValue: (styles) => {
      return {
        ...styles,
        borderRadius: '6px',
        backgroundColor: theme.multivalue,
        transition: '0.2s linear',
      };
    },
    multiValueLabel: (styles) => {
      return {
        ...styles,
        color: theme.text[0],
        transition: '0.2s linear',
      };
    },
    multiValueRemove: (styles) => {
      return {
        ...styles,
        borderRadius: '6px',
      };
    },
    control: (base) => ({
      ...base,
      borderRadius: '8px',
      cursor: 'pointer',
      border: 'solid 2px rgba(0,0,0,0.1)',
      backgroundColor: theme.select,
      transition: 'background-color 0.2s linear, border 0.2s linear',
    }),
    singleValue: (base, { isDisabled }) => ({
      ...base,
      color: isDisabled ? theme.text[2] : theme.text[0],
      transition: 'color 0.2s linear',
    }),
    input: (base) => ({
      ...base,
      color: theme.text[0],
    }),
    menuPortal: (base) => ({ ...base, zIndex: 9999, borderRadius: '8px' }),
    menu: (base) => ({
      ...base,
      paddingTop: 0,
      marginTop: 0,
      borderRadius: '8px',
      backgroundColor: theme.select,
      boxShadow:
        '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    }),
    menuList: (base) => ({
      ...base,
      paddingTop: 0,
      paddingBottom: 0,
      borderRadius: '8px',
    }),
    option: ((base, { isDisabled, isFocused, isSelected }) => ({
      ...base,
      cursor: 'pointer',
      backgroundColor: isDisabled
        ? null
        : isSelected
        ? '#007cff'
        : isFocused
        ? theme.select_hover
        : null,
      color: isSelected ? 'white' : theme.text[0],
      ':active': {
        ...(base as any)[':active'],
        backgroundColor: !isDisabled && '#85c2ff',
      },
    })) as StylesConfigFunction,
  };
};
