import styled from 'styled-components';
import Select from 'react-select';

export const SurfaceComponent = styled.div`
  background-color: ${({ theme }) => theme.surface};
  transition: 0.3s linear;
`;

export const ThirdBackground = styled.div`
  background-color: ${({ theme }) => theme.surface};
  transition: 0.3s linear;
`;

export const StyledResultsItem = styled.div`
  background-color: ${({ theme }) => theme.surface};
  border-bottom: solid 1px ${({ theme }) => theme.border};
  border-top: solid 1px ${({ theme }) => theme.border};
`;

// export const StyledSelect = styled(Select)`
//   &.Select-control {
//     background-color: red;
//   }
//   background-color: red;
// `;
