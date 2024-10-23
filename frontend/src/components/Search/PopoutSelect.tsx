import React from 'react';
import CustomSelect from './CustomSelect';
import type { Option } from '../../contexts/searchContext';

export function PopoutSelect<
  T extends Option<number | string>,
  IsMulti extends boolean,
>({
  isMulti = false as IsMulti,
  isSearchable = true,
  showControl = true,
  isClearable = isMulti, // Multi-selects are clearable by default
  ...props
}: React.ComponentProps<typeof CustomSelect<T, IsMulti>>) {
  return (
    <CustomSelect<T, IsMulti>
      popout
      {...props}
      isMulti={isMulti}
      showControl={showControl}
      // This is not DOM auto focus
      // eslint-disable-next-line jsx-a11y/no-autofocus
      autoFocus
      backspaceRemovesValue={false}
      controlShouldRenderValue
      isClearable={isClearable}
      isSearchable={isSearchable}
      menuIsOpen
      tabSelectsValue={false}
      closeMenuOnSelect={!isMulti}
    />
  );
}
