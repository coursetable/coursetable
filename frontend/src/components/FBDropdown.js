import React from 'react';
import { DropdownButton, Dropdown } from 'react-bootstrap';
import { useUser } from '../user';

import './DropdownShared.css';

/**
 * Render FB Dropdown in mobile view
 * @prop cur_season - string that holds the current season code
 * @prop setFbPerson - function to switch to a FB friend's worksheet
 * @prop cur_person - string that holds the current person who's worksheet you are viewing
 */

function FBDropdown({ cur_season, setFbPerson, cur_person }) {
  // Fetch user context data
  const { user } = useUser();
  // Does worksheet contain courses from current season
  const containsCurSeason = (worksheet) => {
    // Make sure worksheet is valid
    if (!worksheet) return false;
    for (let i = 0; i < worksheet.length; i++) {
      if (worksheet[i][0] === cur_season) return true;
    }
    return false;
  };

  // Holds HTML for the FB friends
  let friend_options = [
    <Dropdown.Item key={'me'} eventKey={'me'} className="d-flex">
      <div className="mx-auto">Me</div>
    </Dropdown.Item>,
  ];
  // FB friend names
  const friendInfo =
    user.fbLogin && user.fbWorksheets ? user.fbWorksheets.friendInfo : {};
  // FB friend worksheets
  const friendWorksheets =
    user.fbLogin && user.fbWorksheets ? user.fbWorksheets.worksheets : {};
  // Add to friend_option list if their worksheet contains a course in the current season
  for (let friend in friendInfo) {
    if (containsCurSeason(friendWorksheets[friend]))
      friend_options.push(
        <Dropdown.Item key={friend} eventKey={friend} className="d-flex">
          <div className="mx-auto">{friendInfo[friend].name}</div>
        </Dropdown.Item>
      );
  }

  // Set FB person on click
  const handleSelect = (fb_person) => {
    setFbPerson(fb_person);
  };

  return (
    <div className="container p-0 m-0">
      <DropdownButton
        variant="primary"
        title={cur_person === 'me' ? 'Me' : friendInfo[cur_person].name}
        onSelect={handleSelect}
      >
        {friend_options}
      </DropdownButton>
    </div>
  );
}

export default FBDropdown;
