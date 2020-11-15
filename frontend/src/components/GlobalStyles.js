import { createGlobalStyle } from 'styled-components';
export const GlobalStyles = createGlobalStyle`
  body {
    background: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.text[0]};    
    transition: background 0.2s linear, color 0.2s linear;
  }
  a {
    color: ${({ theme }) =>
      theme.theme === 'light' ? '#007bff' : '#61adff'};  
    &:hover {
      color: ${({ theme }) =>
        theme.theme === 'light' ? '#0066d4' : '#007bff'};  
    }
  }
  `;
