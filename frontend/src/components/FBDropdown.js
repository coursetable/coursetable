import React from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';

import './DropdownShared.css';

function FBDropdown(props) {
  return (
    <div className="container p-0 m-0">
      <DropdownButton variant="primary" title={'Facebook Select'} />
    </div>
  );
}

export default FBDropdown;
