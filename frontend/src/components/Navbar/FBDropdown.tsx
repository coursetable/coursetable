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

  const { person, handlePersonChange } = useWorksheet();

  // Generate friend netId list, sorted by name.
  const friendInfo = user.friendWorksheets?.friendInfo || {};
  let friends = Object.keys(friendInfo);
  friends.sort((a, b) => {
    return friendInfo[a].name.toLowerCase() < friendInfo[b].name.toLowerCase()
      ? -1
      : 1;
  });
  friends = ['me', ...friends];

  const DropdownItem = ({ person: curr_person }: { person: Person }) => {
    let text: string;
    if (curr_person === 'me') {
      text = 'Me';
    } else {
      const { name } = friendInfo[curr_person];
      // const count_in_season = (friendWorksheets[curr_person] ?? []).filter(
      //   (worksheet) => worksheet[0] === cur_season,
      // ).length;
      text = `${name}`;
    }
    return (
      <Dropdown.Item
        key={curr_person}
        eventKey={curr_person}
        className="d-flex"
        // Styling if this is the current person
        style={{
          backgroundColor: person === curr_person ? '#007bff' : '',
          color: person === curr_person ? 'white' : 'black',
        }}
      >
        <div className="mx-auto">{text}</div>
      </Dropdown.Item>
    );
  };

  const friend_options = friends.map((curr_person) => (
    <DropdownItem key={curr_person} person={curr_person} />
  ));

  return (
    <div className="container p-0 m-0">
      <DropdownButton
        variant="primary"
        title={person === 'me' ? 'Me' : friendInfo[person].name}
        onSelect={(person) => {
          if (person) {
            handlePersonChange(person);
          }
        }}
      >
        {friend_options}
      </DropdownButton>
    </div>
  );
}

export default FBDropdown;
