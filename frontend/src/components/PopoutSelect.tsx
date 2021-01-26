import React from 'react';
import { Props as SelectProps } from 'react-select';
import CustomSelect from './CustomSelect';
// import { BiSearchAlt2 } from 'react-icons/bi';

// const DropdownIndicator = (
//   props: ElementConfig<typeof components.DropdownIndicator>
// ) => {
//   return (
//     <components.DropdownIndicator {...props}>
//       <BiSearchAlt2 />
//     </components.DropdownIndicator>
//   );
// };

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
