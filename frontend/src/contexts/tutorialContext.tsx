import React, {
  createContext,
  useCallback,
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
  isTutorialOpen: boolean;
  toggleTutorial: (open: boolean) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
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
  const { authStatus } = useUser();
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [shownTutorial, setShownTutorial] = useLocalStorageState(
    'shownTutorial',
    false,
  );

  // Handle whether or not to open tutorial
  // TODO this is not an effect
  useEffect(() => {
    if (
      !isMobile &&
      !isTablet &&
      authStatus === 'authenticated' &&
      !shownTutorial
    ) {
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
    authStatus,
    shownTutorial,
    location,
    setIsTutorialOpen,
  ]);

  const toggleTutorial = useCallback(
    (open: boolean) => {
      setIsTutorialOpen(open);
      setShownTutorial(!open);
      setCurrentStep(0);
    },
    [setShownTutorial],
  );

  const store: Store = useMemo(
    () => ({
      isTutorialOpen,
      toggleTutorial,
      currentStep,
      setCurrentStep,
    }),
    [isTutorialOpen, toggleTutorial, currentStep, setCurrentStep],
  );

  return (
    <TutorialContext.Provider value={store}>
      {children}
    </TutorialContext.Provider>
  );
}

export const useTutorial = () => useContext(TutorialContext)!;
