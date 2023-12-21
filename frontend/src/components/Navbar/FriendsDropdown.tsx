import React from 'react';
import { DropdownButton, Dropdown } from 'react-bootstrap';
import type { NetId } from '../../utilities/common';
import { useUser } from '../../contexts/userContext';
import { useWorksheet } from '../../contexts/worksheetContext';

import './DropdownShared.css';

type Person = (NetId & {}) | 'me';

/**
 * Render friends dropdown in mobile view.
 *
 * We include every friend in this list, even if they haven't selected
 * any classes in this season. In the list, we include the number of
 * listings they have in their worksheet in the given semester.
 */
function FriendsDropdown() {
  // Fetch user context data
  const { user } = useUser();

  const { person, handlePersonChange } = useWorksheet();

  // Generate friend netId list, sorted by name.
  const friendInfo = user.friendWorksheets?.friendInfo || {};
  let friends = Object.keys(friendInfo);
  friends.sort((a, b) =>
    friendInfo[a].name.localeCompare(friendInfo[b].name, 'en-US', {
      sensitivity: 'base',
    }),
  );
  friends = ['me', ...friends];

  function DropdownItem({ person: currPerson }: { readonly person: Person }) {
    let text: string;
    if (currPerson === 'me') {
      text = 'Me';
    } else {
      const { name } = friendInfo[currPerson];
      text = String(name);
    }
    return (
      <Dropdown.Item
        key={currPerson}
        eventKey={currPerson}
        className="d-flex"
        // Styling if this is the current person
        style={{
          backgroundColor: person === currPerson ? '#007bff' : '',
          color: person === currPerson ? 'white' : 'black',
        }}
      >
        <div className="mx-auto">{text}</div>
      </Dropdown.Item>
    );
  }

  return (
    <div className="container p-0 m-0">
      <DropdownButton
        variant="primary"
        title={person === 'me' ? 'Me' : friendInfo[person].name}
        onSelect={(person) => {
          if (person) handlePersonChange(person);
        }}
      >
        {friends.map((p) => (
          <DropdownItem key={p} person={p} />
        ))}
      </DropdownButton>
    </div>
  );
}

export default FriendsDropdown;
