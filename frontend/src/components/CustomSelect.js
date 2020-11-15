import React, { useContext } from 'react';
import { StyledSelect } from './StyledComponents';
import { ThemeContext } from 'styled-components';
import makeAnimated from 'react-select/animated';
import chroma from 'chroma-js';

// Makes Select forms animated
const animatedComponents = makeAnimated();

/**
 * Custom Component for React-Select
 * @prop useColors - boolean | should we use the color version of styles?
 */

function CustomSelect({ useColors = false, ...props }) {
  const theme = useContext(ThemeContext);
  const select_styles = selectStyles(theme);
  const select_styles_color = colorOptionStyles(theme);
  return (
    <StyledSelect
      classNamePrefix={'Select'}
      components={animatedComponents}
      styles={useColors ? select_styles_color : select_styles}
      {...props}
    />
  );
}

export default CustomSelect;

const colorOptionStyles = (theme) => {
  return {
    control: (styles) => ({
      ...styles,
      backgroundColor: 'white',
      borderRadius: '8px',
      cursor: 'pointer',
      border: 'solid 2px rgba(0,0,0,0.1)',
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
          ...styles[':active'],
          backgroundColor:
            !isDisabled && (isSelected ? data.color : color.alpha(0.5).css()),
        },
      };
    },
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

const selectStyles = (theme) => {
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
    option: (base, { isDisabled, isFocused, isSelected }) => ({
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
        ...base[':active'],
        backgroundColor: !isDisabled && '#85c2ff',
      },
    }),
  };
};
