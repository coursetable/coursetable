import React from 'react';

import { FaSun, FaRegMoon } from 'react-icons/fa';

/**
 * DarkMode Button
 * @prop darkModeEnabled - boolean to determine which image to display (true for "sun"; false for "moon")
 */

function DarkModeButton({ darkModeEnabled = false }) {
  return (
    <span>
      {darkModeEnabled ? <FaSun size={20} /> : <FaRegMoon size={20} />}
    </span>
  );
}

export default DarkModeButton;
