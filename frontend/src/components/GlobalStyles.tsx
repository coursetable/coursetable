import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  body {
    background: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.text[0]};
  }
  a {
    color: ${({ theme }) => theme.primary};  
    &:hover {
      color: ${({ theme }) => theme.primary_hover};  
    }
  }
  `;
