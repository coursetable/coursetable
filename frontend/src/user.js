import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const UserContext = createContext();
UserContext.displayName = 'UserContext';

export const UserProvider = ({ children }) => {
  const [worksheet, setWorksheet] = useState(null);

  const store = {
    // Context state.
    user: {
      worksheet,
    },

    // Update methods.
    async userRefresh() {
      const res = await axios.get('/legacy_api/WorksheetActions.php?action=get&season=202001');
      if (!res.data.success) {
        setWorksheet(null);
        // TODO: global toast error?
        // TODO: add global loading indicator on first load to avoid login flash if not necessary
        throw res.data;
      }
      setWorksheet(res.data.data);
    },
  }

  return (
    <UserContext.Provider value={store}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext);
