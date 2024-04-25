import React, { useMemo, useState } from 'react';
import { DropdownButton, Dropdown } from 'react-bootstrap';
import { MdPersonRemove } from 'react-icons/md';
import { components as selectComponents } from 'react-select';
import type { Option } from '../../contexts/searchContext';
import { useUser } from '../../contexts/userContext';
import { useWorksheet } from '../../contexts/worksheetContext';
import type { NetId } from '../../utilities/common';
import { Popout } from '../Search/Popout';
import { PopoutSelect } from '../Search/PopoutSelect';
import Spinner from '../Spinner';
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
  );
}

function FriendsDropdownDesktop({
  options,
  viewedPerson,
  removeFriend,
}: {
  readonly options: Option<NetId | 'me'>[];
  readonly viewedPerson: Option<NetId> | null;
  readonly removeFriend: (netId: NetId, isRequest: boolean) => Promise<void>;
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
        isClearable
        placeholder="My worksheets"
        value={viewedPerson}
        options={options}
        onChange={(selectedOption) => {
          handlePersonChange(selectedOption?.value ?? 'me');
        }}
        noOptionsMessage={() => 'No friends found'}
        components={{
          Option({ children, ...props }) {
            const [isLoading, setIsLoading] = useState(false);
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
                {isLoading ? (
                  <Spinner className={styles.spinner} />
                ) : (
                  <MdPersonRemove
                    className={styles.removeFriendIcon}
                    onClick={async (e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsLoading(true);
                      await removeFriend(props.data.value as NetId, false);
                      setIsLoading(false);
                    }}
                    title="Remove friend"
                  />
                )}
              </selectComponents.Option>
            );
          },
        }}
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
      readonly removeFriend: (
        netId: NetId,
        isRequest: boolean,
      ) => Promise<void>;
    }) {
  const { user } = useUser();
  const { person } = useWorksheet();

  const viewedPerson = useMemo(() => {
    // I don't think the second condition is possible
    if (person === 'me' || !user.friends?.[person]) return null;
    return { value: person, label: user.friends[person]!.name ?? person };
  }, [person, user.friends]);

  // List of friend options. Initialize with me option
  const options = useMemo(() => {
    if (!user.friends) return [];
    const options = Object.entries(user.friends)
      .map(
        ([friendNetId, { name }]): Option<NetId> => ({
          value: friendNetId as NetId,
          label: name ?? friendNetId,
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
