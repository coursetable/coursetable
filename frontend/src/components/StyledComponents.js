import styled from 'styled-components';
import Select from 'react-select';
import { FormControl } from 'react-bootstrap';

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
  transition: 0.3s linear;
`;

export const StyledSelect = styled(Select)`
  .Select__control {
    background-color: ${({ theme }) => theme.select};
    transition: 0.3s linear;
  }

  .Select__single-value {
    color: ${({ theme }) => theme.text};
    transition: 0.3s linear;
  }

  .Select__multi-value {
    background-color: ${({ theme }) => theme.multiValue};
    transition: 0.3s linear;
  }

  .Select__multi-value__label {
    color: ${({ theme }) => theme.text};
    transition: 0.3s linear;
  }
`;

export const StyledInput = styled(FormControl)`
  background-color: ${({ theme }) => theme.select};
  color: ${({ theme }) => theme.text};
  transition: 0.3s linear;

  &:focus {
    background-color: ${({ theme }) => theme.select};
    transition: 0.3s linear;
  }

  &.form-control:focus {
    color: ${({ theme }) => theme.text};
  }
`;
