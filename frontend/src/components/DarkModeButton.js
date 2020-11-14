import React from 'react';

import { FaSun, FaRegMoon } from 'react-icons/fa';

/**
 * DarkMode Button
 * @prop darkModeEnabled - boolean to determine which image to display (true for "sun"; false for "moon")
 */

function DarkModeButton({ darkModeEnabled = false, theme, toggleTheme }) {
  return (
    <span className="my-auto" onClick={toggleTheme}>
      {darkModeEnabled ? (
        <FaSun size={20} style={{ display: 'block' }} />
      ) : (
        <FaRegMoon size={20} style={{ display: 'block' }} />
      )}
    </span>
  );
}

export default DarkModeButton;
