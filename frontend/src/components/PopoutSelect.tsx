import React from 'react';
import { Props as SelectProps } from 'react-select';
import CustomSelect from './CustomSelect';

/**
 * Popout select component for select filters in popout dropdowns
 */
export const PopoutSelect: React.FC<SelectProps> = ({ isMulti, ...props }) => {
  return (
    <CustomSelect
      popout
      {...props}
      isMulti={isMulti}
      autoFocus
      backspaceRemovesValue={false}
      controlShouldRenderValue
      hideSelectedOptions={isMulti}
      isClearable={isMulti}
      menuIsOpen
      tabSelectsValue={false}
      closeMenuOnSelect={!isMulti}
    />
  );
};
