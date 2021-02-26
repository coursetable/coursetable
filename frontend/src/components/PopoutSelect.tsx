import React from 'react';
import { Props as SelectProps } from 'react-select';
import CustomSelect from './CustomSelect';

/**
 * Popout select component for select filters in popout dropdowns
 */
export const PopoutSelect: React.FC<SelectProps> = ({ ...props }) => {
  return (
    <CustomSelect
      popout
      {...props}
      autoFocus
      backspaceRemovesValue={false}
      controlShouldRenderValue
      hideSelectedOptions
      isClearable
      menuIsOpen
      tabSelectsValue={false}
      closeMenuOnSelect={false}
    />
  );
};
