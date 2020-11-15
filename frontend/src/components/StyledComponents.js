import styled from 'styled-components';
import Select from 'react-select';
import {
  FormControl,
  ListGroup,
  Modal,
  Card,
  Row,
  Popover,
} from 'react-bootstrap';
import { Calendar } from 'react-big-calendar';

export const SurfaceComponent = styled.div`
  background-color: ${({ theme, layer }) => theme.surface[layer]};
  transition: background-color 0.3s linear;
`;

export const SecondaryText = styled.span`
  color: ${({ theme }) => theme.text_secondary};
  transition: 0.3s linear;
`;

export const StyledBanner = styled.div`
  background-color: ${({ theme }) => theme.banner};
  transition: 0.3s linear;
`;

export const StyledResultsItem = styled(Row)`
  border-bottom: solid 1px ${({ theme }) => theme.border};
  border-top: solid 1px ${({ theme }) => theme.border};
  transition: border 0.3s linear;
  &:hover {
    cursor: pointer;
    background-color: ${({ theme }) => theme.select_hover};
  }
`;

export const StyledListItem = styled(ListGroup.Item)`
  background-color: transparent;
  border-color: ${({ theme }) => theme.border};
  transition: border-color 0.3s linear;
  overflow: hidden;
  &:hover {
    cursor: pointer;
    background-color: ${({ theme }) => theme.select_hover};
  }
`;

export const StyledSelect = styled(Select)`
  .Select__control {
    background-color: ${({ theme }) => theme.select};
    border: ${({ theme }) =>
      theme.theme === 'light'
        ? '2px solid hsl(0, 0%, 90%)'
        : '2px solid ' + theme.select};
    transition: 0.3s linear;
  }

  .Select__single-value {
    color: ${({ theme }) => theme.text};
    transition: 0.3s linear;
  }
`;

export const StyledInput = styled(FormControl)`
  background-color: ${({ theme }) => theme.select};
  color: ${({ theme }) => theme.text};
  transition: 0.3s linear !important;
  border: ${({ theme }) =>
    theme.theme === 'light'
      ? '2px solid hsl(0, 0%, 90%)'
      : '2px solid ' + theme.select};
  border-radius: 8px;

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
    background-color: ${({ theme }) => theme.surface[0]};
  }
`;

export const StyledHr = styled.hr`
  border-color: ${({ theme }) =>
    theme.theme === 'light' ? '#ededed' : '#404040'};
  transition: 0.3s linear;
`;

export const StyledCard = styled(Card)`
  background-color: ${({ theme }) => theme.surface[0]};
  transition: 0.3s linear;
`;

export const StyledExpandBtn = styled.div`
  background-color: ${({ theme }) => theme.border};
  color: ${({ theme }) => theme.text_secondary};
  position: absolute;
  top: 0%;
  z-index: 2;
  transition: 0.3s linear;
`;

export const StyledPopover = styled(Popover)`
  background-color: ${({ theme }) => theme.surface[0]};
  .popover-header {
    background-color: ${({ theme }) => theme.surface[1]};
    color: ${({ theme }) => theme.text_secondary};
  }
  .popover-body {
    color: ${({ theme }) => theme.text};
  }
  .arrow::after {
    border-right-color: ${({ theme }) => theme.surface[0]};
    border-left-color: ${({ theme }) => theme.surface[0]};
  }
`;
