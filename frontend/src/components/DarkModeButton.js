import React from 'react';
import { withTheme } from 'styled-components';
import { FaSun, FaRegMoon } from 'react-icons/fa';

/**
 * DarkMode Button
 * @prop darkModeEnabled - boolean to determine which image to display (true for "sun"; false for "moon")
 */

function DarkModeButton({ theme }) {
  return (
    <span className="my-auto">
      {theme.theme === 'dark' ? (
        <FaSun size={20} style={{ display: 'block' }} />
      ) : (
        <FaRegMoon size={20} style={{ display: 'block' }} />
      )}
    </span>
  );
}

export default withTheme(DarkModeButton);
