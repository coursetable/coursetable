import React, { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const UserContext = createContext();
UserContext.displayName = 'UserContext';

/**
 * Stores the user's worksheet, FB login status, and FB friends' worksheets
 */

export const UserProvider = ({ children }) => {
  // User's worksheet
  const [worksheet, setWorksheet] = useState(null);
  // User's FB login status
  const [fbLogin, setFbLogin] = useState(null);
  // User's FB friends' worksheets
  const [fbWorksheets, setFbWorksheets] = useState(null);

  // Refresh user worksheet
  const userRefresh = useCallback(
    async (suppressError = false) => {
      const res = await axios.get(
        '/legacy_api/WorksheetActions.php?action=get&season=all'
      );
      if (!res.data.success) {
        // Error with fetching user's worksheet
        setWorksheet(null);
        console.error(res.data.message);
        if (!suppressError) {
          toast.error(res.data.message);
        }
      } else {
        // Successfully fetched worksheet
        setWorksheet(res.data.data);
      }
    },
    [setWorksheet]
  );

  // Refresh user FB stuff
  const fbRefresh = useCallback(
    async (suppressError = false) => {
      const fbData = await axios.get('/legacy_api/FetchFacebookData.php');
      if (!fbData.data.success) {
        // Error with login
        setFbLogin(null);
        console.error(fbData.data.message);
        if (!suppressError) {
          toast.error(fbData.data.message);
        }
      } else {
        // Set login status
        setFbLogin(fbData.data.success);
        if (fbData.data.success) {
          // If user is logged into FB, update their friends' worksheets
          const friends_worksheets = await axios.get(
            '/legacy_api/FetchFriendWorksheetsNew.php'
          );
          if (!friends_worksheets.data.success) {
            // Error with fetching friends' worksheets
            setFbWorksheets(null);
            console.error(friends_worksheets.data.message);
            if (!suppressError) {
              toast.error(friends_worksheets.data.message);
            }
          } else {
            // Successfully fetched friends' worksheets
            setFbWorksheets(friends_worksheets.data);
          }
        }
      }
    },
    [setFbLogin]
  );

  const store = {
    // Context state.
    user: {
      worksheet,
      fbLogin,
      fbWorksheets,
    },

    // Update methods.
    userRefresh,
    fbRefresh,
  };

  return <UserContext.Provider value={store}>{children}</UserContext.Provider>;
};

export const useUser = () => useContext(UserContext);
