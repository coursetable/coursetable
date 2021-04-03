import React, { useMemo } from 'react';
import { useUser } from '../user';
import './FBReactSelect.css';
import CustomSelect from './CustomSelect';
import { useWorksheet } from '../worksheetContext';

/**
 * Render FB React-Select Dropdown in WorksheetRowDropdown.js
 */

function FBReactSelect() {
  // Fetch user context data
  const { user } = useUser();

  const { fb_person, handleFBPersonChange } = useWorksheet();

  // FB Friends names
  const friendInfo = useMemo(() => {
    return user.fbLogin && user.fbWorksheets
      ? user.fbWorksheets.friendInfo
      : {};
  }, [user.fbLogin, user.fbWorksheets]);
  // List of FB friend options. Initialize with me option
  const friend_options = useMemo(() => {
    const friend_options_temp = [];
    // Add FB friend to dropdown if they have worksheet courses in the current season
    for (const friend in friendInfo) {
      friend_options_temp.push({
        value: friend,
        label: friendInfo[friend].name,
      });
    }
    // Sort FB friends in alphabetical order
    friend_options_temp.sort((a, b) => {
      return a.label.toLowerCase() < b.label.toLowerCase() ? -1 : 1;
    });
    return friend_options_temp;
  }, [friendInfo]);

  if (!user.fbLogin) {
    // TODO: replace with a button to connect FB
    return (
      <CustomSelect
        value={{
          value: fb_person,
          label: 'Connect FB',
        }}
        isDisabled
      />
    );
  }

  return (
    <div className="fb_select">
      <CustomSelect
        value={
          fb_person === 'me'
            ? null
            : {
                value: fb_person,
                label: friendInfo[fb_person].name,
              }
        }
        placeholder="Friends' courses"
        isSearchable
        isClearable={fb_person !== 'me'}
        options={friend_options}
        onChange={(option) => {
          // Cleared FB friend
          if (!option) handleFBPersonChange('me');
          // Selected FB friend
          else handleFBPersonChange(option.value);
        }}
      />
    </div>
  );
}

export default FBReactSelect;
