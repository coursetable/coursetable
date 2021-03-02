import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from 'react';
import axios from 'axios';
import posthog from 'posthog-js';
import * as Sentry from '@sentry/react';
import { toast } from 'react-toastify';
import { NetId, Season } from './common';

export type Worksheet = [Season, string][];
export type FBFriendInfo = Record<
  NetId,
  {
    name: string;
    facebookId: string;
  }
>;
export type FBInfo = {
  worksheets: Record<NetId, Worksheet>;
  friendInfo: FBFriendInfo;
};
type Store = {
  user: {
    netId?: NetId;
    worksheet?: Worksheet;
    hasEvals?: boolean;
    onWhitelist?: boolean;
    fbLogin?: boolean;
    fbWorksheets?: FBInfo;
  };
  userRefresh(suppressError?: boolean): Promise<void>;
  fbRefresh(suppressError?: boolean): Promise<void>;
};

const UserContext = createContext<Store | undefined>(undefined);
UserContext.displayName = 'UserContext';

/**
 * Stores the user's worksheet, FB login status, and FB friends' worksheets
 */
export const UserProvider: React.FC = ({ children }) => {
  // User's netId
  const [netId, setNetId] = useState<string | undefined>(undefined);
  // User's worksheet
  const [worksheet, setWorksheet] = useState<Worksheet | undefined>(undefined);
  // User's evals enabled status
  const [hasEvals, setHasEvals] = useState<boolean | undefined>(undefined);
  // User's beta enabled status
  const [onWhitelist, setOnWhitelist] = useState<boolean | undefined>(
    undefined
  );
  // User's FB login status
  const [fbLogin, setFbLogin] = useState<boolean | undefined>(undefined);
  // User's FB friends' worksheets
  const [fbWorksheets, setFbWorksheets] = useState<FBInfo | undefined>(
    undefined
  );

  // Refresh user worksheet
  const userRefresh = useCallback(
    (suppressError = false): Promise<void> => {
      return axios
        .get('/legacy_api/WorksheetActions.php?action=get&season=all')
        .then((res) => {
          if (!res.data.success) {
            throw new Error(res.data.message);
          }

          // Successfully fetched worksheet
          setNetId(res.data.netId);
          setHasEvals(res.data.evaluationsEnabled);
          setOnWhitelist(res.data.betaEnabled);
          setWorksheet(res.data.data);
          posthog.identify(res.data.netId);
          Sentry.setUser({ username: res.data.netId });
        })
        .catch((err) => {
          // Error with fetching user's worksheet
          setNetId(undefined);
          setWorksheet(undefined);
          setHasEvals(undefined);
          setOnWhitelist(undefined);
          posthog.reset();
          Sentry.configureScope((scope) => scope.clear());
          console.info(err);
          if (!suppressError) {
            toast.error('Error fetching worksheet');
          }
        });
    },
    [setWorksheet, setNetId, setHasEvals, setOnWhitelist]
  );

  // Refresh user FB stuff
  const fbRefresh = useCallback(
    (suppressError = false): Promise<void> => {
      return axios
        .get('/legacy_api/FetchFriendWorksheetsNew.php')
        .then((friends_worksheets) => {
          if (!friends_worksheets.data.success) {
            throw new Error(friends_worksheets.data.message);
          }
          // Successfully fetched friends' worksheets
          setFbLogin(true);
          setFbWorksheets(friends_worksheets.data);
        })
        .catch((err) => {
          // Error with fetching friends' worksheets
          if (!suppressError) {
            console.info(err);
            toast.error('Error updating facebook friends');
          }
          setFbLogin(false);
          setFbWorksheets(undefined);
        });
    },
    [setFbLogin, setFbWorksheets]
  );

  const user = useMemo(() => {
    return {
      netId,
      worksheet,
      hasEvals,
      onWhitelist,
      fbLogin,
      fbWorksheets,
    };
  }, [netId, worksheet, hasEvals, onWhitelist, fbLogin, fbWorksheets]);

  const store = useMemo(
    () => ({
      // Context state.
      user,

      // Update methods.
      userRefresh,
      fbRefresh,
    }),
    [user, userRefresh, fbRefresh]
  );

  return <UserContext.Provider value={store}>{children}</UserContext.Provider>;
};

export const useUser = () => useContext(UserContext)!;
