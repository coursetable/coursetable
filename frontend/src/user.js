import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from 'react';
import axios from 'axios';
import posthog from 'posthog-js';
import { toast } from 'react-toastify';
import { useCourseData } from './components/FerryProvider';
import { useWorksheetInfo } from './queries/GetWorksheetListings';

const UserContext = createContext();
UserContext.displayName = 'UserContext';

/**
 * Stores the user's worksheet, FB login status, and FB friends' worksheets
 */

export const UserProvider = ({ children }) => {
  // User's netId
  const [netId, setNetId] = useState(null);
  // User's worksheet
  const [worksheet, setWorksheet] = useState(null);
  // User's evals enabled status
  const [hasEvals, setHasEvals] = useState(null);
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
        setNetId(null);
        posthog.reset();
        setWorksheet(null);
        setHasEvals(null);
        console.error(res.data.message);
        if (!suppressError) {
          toast.error(res.data.message);
        }
      } else {
        // Successfully fetched worksheet
        setNetId(res.data.netId);
        posthog.identify(res.data.netId);
        setHasEvals(res.data.evaluationsEnabled);
        setWorksheet(res.data.data);
      }
    },
    [setWorksheet, setNetId, setHasEvals]
  );

  // Refresh user FB stuff
  const fbRefresh = useCallback(
    async (suppressError = false) => {
      const friends_worksheets = await axios.get(
        '/legacy_api/FetchFriendWorksheetsNew.php'
      );
      if (!friends_worksheets.data.success) {
        // Error with fetching friends' worksheets
        console.log(friends_worksheets.data.message);
        if (!suppressError) {
          toast.error(friends_worksheets.data.message);
        }
        setFbLogin(false);
        setFbWorksheets(null);
      } else {
        // Successfully fetched friends' worksheets
        setFbLogin(true);
        setFbWorksheets(friends_worksheets.data);
      }
    },
    [setFbLogin, setFbWorksheets]
  );

  // Get user's worksheet information.
  const worksheetDataObj = useWorksheetInfo(worksheet);

  const user = useMemo(() => {
    return {
      netId,
      worksheet,
      worksheetDataObj,
      hasEvals,
      fbLogin,
      fbWorksheets,
    };
  }, [netId, worksheet, hasEvals, fbLogin, fbWorksheets]);

  const store = {
    // Context state.
    user,

    // Update methods.
    userRefresh,
    fbRefresh,
  };

  return <UserContext.Provider value={store}>{children}</UserContext.Provider>;
};

export const useUser = () => useContext(UserContext);
