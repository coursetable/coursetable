import React, { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const UserContext = createContext();
UserContext.displayName = 'UserContext';

export const UserProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [worksheet, setWorksheet] = useState(null);

  const userRefresh = useCallback(async () => {
    const res = await axios.get(
      '/legacy_api/WorksheetActions.php?action=get&season=202001'
    );
    if (!res.data.success) {
      setWorksheet(null);
      // TODO: global toast error?
      // TODO: add global loading indicator on first load to avoid login flash if not necessary
      setLoading(false);
      console.error(res.data.message);
      toast.error(res.data.message);
    } else {
      setLoading(false);
      setWorksheet(res.data.data);
    }
  }, [setWorksheet]);

  const store = {
    // Context state.
    user: {
      loading,
      worksheet,
    },

    // Update methods.
    userRefresh,
  };

  return <UserContext.Provider value={store}>{children}</UserContext.Provider>;
};

export const useUser = () => useContext(UserContext);
