import React, { useMemo } from 'react';
import { DropdownButton, Dropdown } from 'react-bootstrap';
import { components as selectComponents } from 'react-select';
import { MdPersonRemove } from 'react-icons/md';
import { useUser } from '../../contexts/userContext';
import { useWorksheet } from '../../contexts/worksheetContext';
import { isOption, type Option } from '../../contexts/searchContext';
import type { NetId } from '../../utilities/common';
import { Popout } from '../Search/Popout';
import { PopoutSelect } from '../Search/PopoutSelect';
import styles from './FriendsDropdown.module.css';

function FriendsDropdownMobile({
  options,
  viewedPerson,
}: {
  readonly options: Option<NetId | 'me'>[];
  readonly viewedPerson: Option<NetId> | null;
}) {
  const { handlePersonChange } = useWorksheet();
  return (
    <div className="container p-0 m-0">
      <DropdownButton
        variant="primary"
        title={viewedPerson?.label ?? "Friends' worksheets"}
        onSelect={(p) => {
          if (p) handlePersonChange(p as NetId | 'me');
        }}
      >
        {[{ value: 'me', label: 'Me' }, ...options].map(({ value, label }) => (
          <Dropdown.Item
            key={value}
            eventKey={value}
            className="d-flex"
            // Styling if this is the current person
            style={{
              backgroundColor:
                value === (viewedPerson?.value ?? 'me')
                  ? 'var(--color-primary)'
                  : '',
            }}
          >
            <div className="mx-auto">{label}</div>
          </Dropdown.Item>
        ))}
      </DropdownButton>
    </div>
  );
}

function FriendsDropdownDesktop({
  options,
  viewedPerson,
  removeFriend,
}: {
  readonly options: Option<NetId | 'me'>[];
  readonly viewedPerson: Option<NetId> | null;
  readonly removeFriend: (netId: NetId, isRequest: boolean) => void;
}) {
  const { handlePersonChange } = useWorksheet();
  return (
    <Popout
      buttonText="Friends' courses"
      displayOptionLabel
      selectedOptions={viewedPerson}
      onReset={() => {
        handlePersonChange('me');
      }}
    >
      <PopoutSelect<Option<NetId | 'me'>, false>
        hideSelectedOptions={false}
        menuIsOpen
        placeholder="My worksheets"
        value={viewedPerson}
        options={options}
        onChange={(selectedOption) => {
          if (!selectedOption) handlePersonChange('me');
          if (isOption(selectedOption))
            handlePersonChange(selectedOption.value);
        }}
        components={{
          NoOptionsMessage: ({ children, ...props }) => (
            <selectComponents.NoOptionsMessage {...props}>
              No friends found
            </selectComponents.NoOptionsMessage>
          ),
          Option({ children, ...props }) {
            if (props.data.value === 'me') {
              return (
                <selectComponents.Option {...props}>
                  {children}
                </selectComponents.Option>
              );
            }
            return (
              <selectComponents.Option {...props}>
                {children}
                <MdPersonRemove
                  className={styles.removeFriendIcon}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    removeFriend(props.data.value as NetId, false);
                  }}
                  title="Remove friend"
                />
              </selectComponents.Option>
            );
          },
        }}
        isDisabled={false}
      />
    </Popout>
  );
}

function FriendsDropdown({
  mobile,
  removeFriend,
}:
  | {
      readonly mobile: true;
      readonly removeFriend?: never;
    }
  | {
      readonly mobile: false;
      readonly removeFriend: (netId: NetId, isRequest: boolean) => void;
    }) {
  const { user } = useUser();
  const { person } = useWorksheet();

  const viewedPerson = useMemo(() => {
    // I don't think the second condition is possible
    if (person === 'me' || !user.friends?.[person]) return null;
    return { value: person, label: user.friends[person]!.name };
  }, [person, user.friends]);

  // List of friend options. Initialize with me option
  const options = useMemo(() => {
    if (!user.friends) return [];
    const options = Object.entries(user.friends)
      .map(
        ([friendNetId, { name }]): Option<NetId> => ({
          value: friendNetId as NetId,
          label: name,
        }),
      )
      .sort((a, b) =>
        a.label.localeCompare(b.label, 'en-US', { sensitivity: 'base' }),
      );
    return options;
  }, [user.friends]);
  if (mobile) {
    return (
      <FriendsDropdownMobile options={options} viewedPerson={viewedPerson} />
    );
  }
  return (
    <FriendsDropdownDesktop
      options={options}
      viewedPerson={viewedPerson}
      removeFriend={removeFriend}
    />
  );
}

export default FriendsDropdown;
