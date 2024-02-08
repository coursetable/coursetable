import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useLocation } from 'react-router-dom';
import { useLocalStorageState } from '../utilities/browserStorage';
import { useUser } from './userContext';
import { useWindowDimensions } from './windowDimensionsContext';

type Store = {
  shownTutorial: boolean;
  setShownTutorial: React.Dispatch<React.SetStateAction<boolean>>;
  isTutorialOpen: boolean;
  setIsTutorialOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const TutorialContext = createContext<Store | undefined>(undefined);
TutorialContext.displayName = 'TutorialContext';

export function TutorialProvider({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const location = useLocation();
  const { isMobile, isTablet } = useWindowDimensions();
  const { user } = useUser();
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [shownTutorial, setShownTutorial] = useLocalStorageState(
    'shownTutorial',
    false,
  );
  const isLoggedIn = Boolean(user.worksheets);

  // Handle whether or not to open tutorial
  useEffect(() => {
    if (!isMobile && !isTablet && isLoggedIn && !shownTutorial) {
      if (location.pathname === '/catalog') {
        setIsTutorialOpen(true);
      } else if (location.pathname !== '/worksheet') {
        // This can happen if the user got redirected to /challenge
        setIsTutorialOpen(false);
      }
    } else {
      setIsTutorialOpen(false);
    }
  }, [
    isMobile,
    isTablet,
    isLoggedIn,
    shownTutorial,
    location,
    setIsTutorialOpen,
  ]);

  const store: Store = useMemo(
    () => ({
      shownTutorial,
      setShownTutorial,
      isTutorialOpen,
      setIsTutorialOpen,
    }),
    [shownTutorial, setShownTutorial, isTutorialOpen],
  );

  return (
    <TutorialContext.Provider value={store}>
      {children}
    </TutorialContext.Provider>
  );
}

export const useTutorial = () => useContext(TutorialContext)!;
