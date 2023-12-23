import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { ThemeProvider as SCThemeProvider } from 'styled-components';
import { lightTheme, darkTheme } from '../components/Themes';

type Theme = 'light' | 'dark';

type Store = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<Store | undefined>(undefined);
ThemeContext.displayName = 'ThemeContext';

export function ThemeProvider({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const [theme, setTheme] = useState<Theme>('light');

  const setMode = useCallback((mode: Theme) => {
    window.localStorage.setItem('theme', mode);
    setTheme(mode);
  }, []);

  const toggleTheme = useCallback(() => {
    if (theme === 'light') setMode('dark');
    else setMode('light');
  }, [theme, setMode]);

  useEffect(() => {
    const localTheme = window.localStorage.getItem('theme') as Theme;
    if (localTheme) setTheme(localTheme);
  }, []);

  const scTheme = theme === 'light' ? lightTheme : darkTheme;

  const store: Store = useMemo(
    () => ({
      theme,
      toggleTheme,
    }),
    [theme, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={store}>
      <SCThemeProvider theme={scTheme}>{children}</SCThemeProvider>
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext)!;
