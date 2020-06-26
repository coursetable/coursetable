import React, { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const UserContext = createContext();
UserContext.displayName = 'UserContext';

export const UserProvider = ({ children }) => {
  const [worksheet, setWorksheet] = useState(null);

  const userRefresh = useCallback(
    async (suppressError = false) => {
      const res = await axios.get(
        '/legacy_api/WorksheetActions.php?action=get&season=202001'
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
    },
    [setWorksheet]
  );

  const store = {
    // Context state.
    user: {
      worksheet,
    },

    // Update methods.
    userRefresh,
  };

  return <UserContext.Provider value={store}>{children}</UserContext.Provider>;
};

export const useUser = () => useContext(UserContext);
