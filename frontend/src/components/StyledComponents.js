import styled from 'styled-components';
import Select from 'react-select';
import { FormControl, ListGroup, Modal } from 'react-bootstrap';
import { Calendar } from 'react-big-calendar';

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

export const StyledListItem = styled(ListGroup.Item)`
  background-color: ${({ theme }) => theme.surface};
  border-color: ${({ theme }) => theme.border};
  transition: 0.3s linear;
`;

export const StyledSelect = styled(Select)`
  .Select__control {
    background-color: ${({ theme }) => theme.select};
    border: none;
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
  transition: 0.3s linear !important;

  &:focus {
    background-color: ${({ theme }) => theme.select};
  }

  &.form-control:focus {
    color: ${({ theme }) => theme.text};
  }
`;

export const StyledCalendar = styled(Calendar)`
  &.rbc-calendar {
    .rbc-time-view {
      .rbc-time-header {
        .rbc-time-header-content {
          border-color: ${({ theme }) => theme.border};
          transition: 0.3s linear;
          .rbc-time-header-cell {
            .rbc-header {
              border-color: ${({ theme }) => theme.border};
              transition: 0.3s linear;
            }
          }
        }
      }
      .rbc-time-content {
        border-color: ${({ theme }) => theme.border};
        transition: 0.3s linear;
        .rbc-time-gutter {
          .rbc-timeslot-group {
            border-color: ${({ theme }) => theme.border};
            transition: 0.3s linear;
          }
        }
        .rbc-day-slot {
          .rbc-timeslot-group {
            border-color: ${({ theme }) => theme.border};
            transition: 0.3s linear;
            .rbc-time-slot {
              border-color: ${({ theme }) => theme.border};
              transition: 0.3s linear;
            }
          }
        }
      }
    }
  }
`;

export const StyledModal = styled(Modal)`
  .modal-content {
    background-color: ${({ theme }) => theme.surface};
  }
`;

export const StyledHr = styled.hr`
  border-color: ${({ theme }) =>
    theme.theme === 'light' ? '#dedede' : '#404040'};
`;
