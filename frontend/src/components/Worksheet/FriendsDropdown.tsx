import React from 'react';
import { DropdownButton, Dropdown } from 'react-bootstrap';
import { useUser } from '../../contexts/userContext';
import { useWorksheet } from '../../contexts/worksheetContext';
import type { NetId } from '../../utilities/common';

function DropdownItem({
  person,
  text,
  viewedPerson,
}: {
  readonly person: NetId | 'me';
  readonly viewedPerson: NetId | 'me';
  readonly text: string;
}) {
  return (
    <Dropdown.Item
      eventKey={person}
      className="d-flex"
      // Styling if this is the current person
      style={{
        backgroundColor: person === viewedPerson ? '#007bff' : '',
        color: person === viewedPerson ? 'white' : 'black',
      }}
    >
      <div className="mx-auto">{text}</div>
    </Dropdown.Item>
  );
}

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

  if (!user.friends) {
    return (
      <div className="container p-0 m-0">
        <DropdownButton variant="primary" title="Me" />
      </div>
    );
  }

  // Generate friend netId list, sorted by name.
  const friends = Object.entries(user.friends)
    .map(([netId, { name }]) => ({
      netId: netId as NetId,
      name,
    }))
    .sort((a, b) =>
      a.name.localeCompare(b.name, 'en-US', { sensitivity: 'base' }),
    );
  return (
    <div className="container p-0 m-0">
      <DropdownButton
        variant="primary"
        title={person === 'me' ? 'Me' : user.friends[person]!.name}
        onSelect={(p) => {
          if (p) handlePersonChange(p as NetId | 'me');
        }}
      >
        <DropdownItem person="me" text="Me" viewedPerson={person} />
        {friends.map((p) => (
          <DropdownItem
            key={p.netId}
            person={p.netId}
            text={p.name}
            viewedPerson={person}
          />
        ))}
      </DropdownButton>
    </div>
  );
}

export default FriendsDropdown;
