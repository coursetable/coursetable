import React, { useCallback, useMemo } from 'react';
import Select from 'react-select';
import { useUser } from '../user';
import './FBReactSelect.css';

/**
 * Render FB React-Select Dropdown in WorksheetSettingsDropdown.js and WorksheetRowDropdown.js
 * @prop cur_season - string that holds the current season code
 * @prop setFbPerson - function to change FB person
 * @prop cur_person - string of current person who's worksheet we are viewing
 */

function FBReactSelect({ cur_season, setFbPerson, cur_person }) {
  // Fetch user context data
  const { user } = useUser();

  // Does the worksheet contain any courses from the current season?
  const containsCurSeason = useCallback(
    (worksheet) => {
      if (!worksheet) return false;
      for (let i = 0; i < worksheet.length; i++) {
        if (worksheet[i][0] === cur_season) return true;
      }
      return false;
    },
    [cur_season]
  );
  // FB Friends names
  const friendInfo = useMemo(() => {
    return user.fbLogin && user.fbWorksheets
      ? user.fbWorksheets.friendInfo
      : {};
  }, [user.fbLogin, user.fbWorksheets]);
  // FB Friends worksheets
  const friendWorksheets = useMemo(() => {
    return user.fbLogin && user.fbWorksheets
      ? user.fbWorksheets.worksheets
      : {};
  }, [user.fbLogin, user.fbWorksheets]);
  // List of FB friend options. Initialize with me option
  const friend_options = useMemo(() => {
    let friend_options_temp = [];
    // Add FB friend to dropdown if they have worksheet courses in the current season
    for (let friend in friendInfo) {
      if (containsCurSeason(friendWorksheets[friend]))
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
  }, [containsCurSeason, friendInfo, friendWorksheets]);

  if (!user.fbLogin) {
    // TODO: replace with a button to connect FB
    return (
      <Select
        value={{
          value: cur_person,
          label: 'Connect FB',
        }}
        isDisabled={true}
      />
    );
  }

  return (
    <div className="fb_select">
      <Select
        value={
          cur_person === 'me'
            ? null
            : {
                value: cur_person,
                label: friendInfo[cur_person].name,
              }
        }
        placeholder="Friends' courses"
        isSearchable={true}
        isClearable={cur_person !== 'me'}
        options={friend_options}
        onChange={(option) => {
          // Cleared FB friend
          if (!option) setFbPerson('me');
          // Selected FB friend
          else setFbPerson(option.value);
        }}
      />
    </div>
  );
}

export default FBReactSelect;
