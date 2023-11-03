import React from 'react';
import { DropdownButton, Dropdown } from 'react-bootstrap';
import { NetId } from '../../utilities/common';
import { useUser } from '../../contexts/userContext';
import { useWorksheet } from '../../contexts/worksheetContext';

import './DropdownShared.css';

type Person = NetId | 'me';

/**
 * Render FB Dropdown in mobile view.
 *
 * We include every friend in this list, even if they haven't selected
 * any classes in this season. In the list, we include the number of
 * listings they have in their worksheet in the given semester.
 */
function FBDropdown() {
  // Fetch user context data
  const { user } = useUser();

  const { curSeason, fbPerson, handleFBPersonChange } = useWorksheet();

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

  const DropdownItem = ({ person }: { person: Person }) => {
    let text: string;
    if (person === 'me') {
      text = 'Me';
    } else {
      const { name } = friendInfo[person];
      const countInSeason = (friendWorksheets[person] ?? []).filter(
        (worksheet) => worksheet[0] === curSeason,
      ).length;
      text = `${name} (${countInSeason})`;
    }
    return (
      <Dropdown.Item
        key={person}
        eventKey={person}
        className="d-flex"
        // Styling if this is the current person
        style={{
          backgroundColor: person === fbPerson ? '#007bff' : '',
          color: person === fbPerson ? 'white' : 'black',
        }}
      >
        <div className="mx-auto">{text}</div>
      </Dropdown.Item>
    );
  };

  return (
    <div className="container p-0 m-0">
      <DropdownButton
        variant="primary"
        title={fbPerson === 'me' ? 'Me' : friendInfo[fbPerson].name}
        onSelect={(fbPerson) => {
          if (fbPerson) {
            handleFBPersonChange(fbPerson);
          }
        }}
      >
        {friends.map((person) => (
          <DropdownItem key={person} person={person} />
        ))}
      </DropdownButton>
    </div>
  );
}

export default FBDropdown;
