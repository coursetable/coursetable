import React from 'react';
import { DropdownButton, Dropdown } from 'react-bootstrap';
import { useUser } from '../user';

import './DropdownShared.css';

function FBDropdown({ cur_season, setFbPerson, cur_person }) {
  const { user } = useUser();
  const containsCurSeason = (worksheet) => {
    for (let i = 0; i < worksheet.length; i++) {
      if (worksheet[i][0] === cur_season) return true;
    }
    return false;
  };

  let friend_options = [
    <Dropdown.Item key={'me'} eventKey={'me'}>
      Me
    </Dropdown.Item>,
  ];
  const friendInfo =
    user.fbLogin && user.fbWorksheets ? user.fbWorksheets.friendInfo : {};
  for (let friend in friendInfo) {
    if (containsCurSeason(user.fbWorksheets.worksheets[friend]))
      friend_options.push(
        <Dropdown.Item key={friend} eventKey={friend}>
          {friendInfo[friend].name}
        </Dropdown.Item>
      );
  }

  const handleSelect = (fb_person) => {
    setFbPerson(fb_person);
  };

  return (
    <div className="container p-0 m-0">
      <DropdownButton
        variant="primary"
        title={
          cur_person === 'me'
            ? 'Me'
            : user.fbWorksheets.friendInfo[cur_person].name
        }
        onSelect={handleSelect}
      >
        {friend_options}
      </DropdownButton>
    </div>
  );
}

export default FBDropdown;
