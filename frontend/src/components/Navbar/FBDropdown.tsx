import React from 'react';
import { DropdownButton, Dropdown } from 'react-bootstrap';
import { NetId } from '../../utilities/common';
import { useUser } from '../../user';
import { useWorksheet } from '../../worksheetContext';

import './DropdownShared.css';

type Person = NetId | 'me';

/**
 * Render FB Dropdown in mobile view.
 *
 * We include every friend in this list, even if they haven't selected
 * any classes in this season. In the list, we include the number of
 * listings they have in their worksheet in the given semester.
 */
const FBDropdown: React.VFC = () => {
  // Fetch user context data
  const { user } = useUser();

  const { cur_season, fb_person, handleFBPersonChange } = useWorksheet();

  // Generate friend netId list, sorted by name.
  const friendInfo = (user.fbLogin && user.fbWorksheets?.friendInfo) || {};
  let friends = Object.keys(friendInfo);
  friends.sort((a, b) => {
    return friendInfo[a].name.toLowerCase() < friendInfo[b].name.toLowerCase()
      ? -1
      : 1;
  });
  friends = ['me', ...friends];

  const friendWorksheets =
    (user.fbLogin && user?.fbWorksheets?.worksheets) || {};

  const DropdownItem: React.VFC<{ person: Person }> = ({ person }) => {
    let text: string;
    if (person === 'me') {
      text = 'Me';
    } else {
      const { name } = friendInfo[person];
      const count_in_season = (friendWorksheets[person] ?? []).filter(
        (worksheet) => worksheet[0] === cur_season
      ).length;
      text = `${name} (${count_in_season})`;
    }
    return (
      <Dropdown.Item
        key={person}
        eventKey={person}
        className="d-flex"
        // Styling if this is the current person
        style={{
          backgroundColor: person === fb_person ? '#007bff' : '',
          color: person === fb_person ? 'white' : 'black',
        }}
      >
        <div className="mx-auto">{text}</div>
      </Dropdown.Item>
    );
  };

  const friend_options = friends.map((person) => (
    <DropdownItem key={person} person={person} />
  ));

  // Set FB person on click
  const handleSelect = (fb_person: Person | null) => {
    if (fb_person) {
      handleFBPersonChange(fb_person);
    }
  };

  return (
    <div className="container p-0 m-0">
      <DropdownButton
        variant="primary"
        title={fb_person === 'me' ? 'Me' : friendInfo[fb_person].name}
        onSelect={handleSelect}
      >
        {friend_options}
      </DropdownButton>
    </div>
  );
};

export default FBDropdown;
