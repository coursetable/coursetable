import React from 'react';
import styled, { useTheme } from 'styled-components';
import clsx from 'clsx';
import { FaRegMoon } from 'react-icons/fa';
import { ImSun } from 'react-icons/im';
import styles from './DarkModeButton.module.css';

const StyledBtn = styled.span`
  color: ${({ theme }) => theme.text[1]};
  &:hover {
    color: ${({ theme }) => theme.primary};
  }
`;

/**
 * DarkMode Button
 */
function DarkModeButton() {
  const theme = useTheme();
  return (
    <StyledBtn className={clsx(styles.button, 'my-auto')}>
      {theme.theme === 'dark' ? (
        <ImSun size={20} style={{ display: 'block' }} />
      ) : (
        <FaRegMoon size={20} style={{ display: 'block' }} />
      )}
    </StyledBtn>
  );
}

export default DarkModeButton;
