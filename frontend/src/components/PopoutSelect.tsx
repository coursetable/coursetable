import React from 'react';
import { Props as SelectProps } from 'react-select';
import CustomSelect from './CustomSelect';

export const PopoutSelect: React.FC<SelectProps> = ({ ...props }) => {
  return (
    <CustomSelect
      popout
      {...props}
      autoFocus
      backspaceRemovesValue={false}
      // components={{ DropdownIndicator, IndicatorSeparator: null }}
      controlShouldRenderValue
      hideSelectedOptions
      isClearable
      menuIsOpen
      tabSelectsValue={false}
      closeMenuOnSelect={false}
    />
  );
};
