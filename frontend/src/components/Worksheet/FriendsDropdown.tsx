import { useMemo, useState } from 'react';
import { DropdownButton, Dropdown } from 'react-bootstrap';
import { MdPersonRemove } from 'react-icons/md';
import { components as selectComponents, type OptionProps } from 'react-select';
import type { Option } from '../../contexts/searchContext';
import type { NetId } from '../../queries/graphql-types';
import { useStore } from '../../store';
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
  const changeViewedPerson = useStore((state) => state.changeViewedPerson);
  return (
    <DropdownButton
      variant="primary"
      title={viewedPerson?.label ?? "Friends' worksheets"}
      onSelect={(p) => {
        if (p) changeViewedPerson(p as NetId | 'me');
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

function OptionWithActionButtons({
  children,
  ...props
}: OptionProps<Option<NetId | 'me'>>) {
  const [isLoading, setIsLoading] = useState(false);
  // Passed from the PopoutSelect
  const { removeFriend } = props.selectProps as unknown as {
    removeFriend: (netId: NetId, isRequest: boolean) => Promise<void>;
  };
  if (props.data.value === 'me') {
    return (
      <selectComponents.Option {...props}>{children}</selectComponents.Option>
    );
  }
  return (
    <selectComponents.Option {...props}>
      {children}
      {isLoading ? (
        <Spinner className={styles.spinner} message={undefined} />
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
  const changeViewedPerson = useStore((state) => state.changeViewedPerson);
  return (
    <Popout
      buttonText="Friends' courses"
      displayOptionLabel
      selectedOptions={viewedPerson}
      onReset={() => {
        changeViewedPerson('me');
      }}
    >
      <PopoutSelect<Option<NetId | 'me'>, false>
        isClearable
        placeholder="My worksheets"
        value={viewedPerson}
        options={options}
        onChange={(selectedOption) => {
          changeViewedPerson(selectedOption?.value ?? 'me');
        }}
        noOptionsMessage={() => 'No friends found'}
        components={{ Option: OptionWithActionButtons }}
        // @ts-expect-error: Passed to OptionWithActionButtons
        removeFriend={removeFriend}
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
  const friends = useStore((state) => state.friends);
  const viewedPerson = useStore((state) => state.viewedPerson);

  const viewedPersonOption = useMemo(() => {
    // I don't think the second condition is possible
    if (viewedPerson === 'me' || !friends?.[viewedPerson]) return null;
    return {
      value: viewedPerson,
      label: friends[viewedPerson].name ?? viewedPerson,
    };
  }, [viewedPerson, friends]);

  // List of friend options. Initialize with me option
  const options = useMemo(() => {
    if (!friends) return [];
    const options = Object.entries(friends)
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
  }, [friends]);
  if (mobile) {
    return (
      <FriendsDropdownMobile
        options={options}
        viewedPerson={viewedPersonOption}
      />
    );
  }
  return (
    <FriendsDropdownDesktop
      options={options}
      viewedPerson={viewedPersonOption}
      removeFriend={removeFriend}
    />
  );
}

export default FriendsDropdown;
