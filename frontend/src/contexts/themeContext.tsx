import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { createLocalStorageSlot } from '../utilities/browserStorage';

export type Theme = 'light' | 'dark';

type Store = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<Store | undefined>(undefined);
ThemeContext.displayName = 'ThemeContext';

const storage = createLocalStorageSlot<Theme>('theme');

export function ThemeProvider({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const [theme, setTheme] = useState<Theme>('light');

  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    storage.set(newTheme);
    setTheme(newTheme);
  }, [theme]);

  useEffect(() => {
    const localTheme = storage.get();
    if (localTheme) setTheme(localTheme);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const store: Store = useMemo(
    () => ({
      theme,
      toggleTheme,
    }),
    [theme, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={store}>{children}</ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext)!;
