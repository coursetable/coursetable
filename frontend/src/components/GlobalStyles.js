import { createGlobalStyle } from 'styled-components';
export const GlobalStyles = createGlobalStyle`
  body {
    background: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.text[0]};    
    transition: background 0.2s linear, color 0.2s linear;
  }
  a {
    color: ${({ theme }) => theme.primary};  
    &:hover {
      color: ${({ theme }) => theme.primary_hover};  
    }
  }
  `;
