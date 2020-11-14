import styled from 'styled-components';
import Select from 'react-select';

export const SecondaryBackground = styled.div`
  background-color: ${({ theme }) => theme.second_background};
  transition: 0.5s linear;
`;

// export const StyledSelect = styled(Select)`
//   &.Select-control {
//     background-color: red;
//   }
//   background-color: red;
// `;
