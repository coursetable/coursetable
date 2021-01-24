import React from 'react';
import Select, { StylesConfig, Props as SelectProps } from 'react-select';

const selectStyles = (width: number): StylesConfig => {
  return {
    control: (provided) => ({ ...provided, minWidth: width, margin: 8 }),
    menu: () => ({ boxShadow: 'inset 0 1px 0 rgba(0, 0, 0, 0.1)' }),
  };
};

export const PopoutSelect: React.FC<SelectProps> = ({ ...props }) => {
  return (
    <Select
      {...props}
      styles={selectStyles(300)}
      autoFocus
      backspaceRemovesValue={false}
      // components={{ DropdownIndicator, IndicatorSeparator: null }}
      controlShouldRenderValue
      hideSelectedOptions={false}
      isClearable
      menuIsOpen
      tabSelectsValue={false}
      closeMenuOnSelect={false}
    />
  );
};
