import React, { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const UserContext = createContext();
UserContext.displayName = 'UserContext';

export const UserProvider = ({ children }) => {
  const [worksheet, setWorksheet] = useState(null);
  const [fbLogin, setFbLogin] = useState(null);

  const userRefresh = useCallback(
    async (suppressError = false) => {
      const res = await axios.get(
        '/legacy_api/WorksheetActions.php?action=get&season=all'
      );
      if (!res.data.success) {
        setWorksheet(null);
        console.error(res.data.message);
        if (!suppressError) {
          toast.error(res.data.message);
        }
      } else {
        setWorksheet(res.data.data);
      }
      const fbData = await axios.get(
        '/legacy_api/FetchFacebookData.php'
      );
      if (!fbData.data.success) {
        setFbLogin(null);
        console.error(fbData.data.message);
        if (!suppressError) {
          toast.error(fbData.data.message);
        }
      } else {
        setFbLogin(fbData.data.data)
        console.log("FB SUCCESS")
      }
    },
    [setWorksheet, setFbLogin]
  );

  const store = {
    // Context state.
    user: {
      worksheet,
      fbLogin,
    },

    // Update methods.
    userRefresh,
  };

  return <UserContext.Provider value={store}>{children}</UserContext.Provider>;
};

export const useUser = () => useContext(UserContext);
