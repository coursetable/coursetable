import styled from 'styled-components';
import Select from 'react-select';
import { FormControl, Card, Popover } from 'react-bootstrap';

// Div used to color the background of surface components
export const SurfaceComponent = styled.div`
  background-color: ${({ theme, layer }) => theme.surface[layer]};
  transition: background-color 0.2s linear;
`;

// Span used to color text. Type is an int that represents primary (0) or secondary (1) color
export const TextComponent = styled.span`
  color: ${({ theme, type }) => theme.text[type]};
  transition: color 0.2s linear;
`;

// Div for banner components/any components that are light grey in light mode, dark grey in dark mode
export const StyledBanner = styled.div`
  background-color: ${({ theme }) => theme.banner};
  transition: background-color 0.2s linear;
`;

// React-select component
export const StyledSelect = styled(Select)`
  .Select__control {
    background-color: ${({ theme }) => theme.select};
    border: ${({ theme }) =>
      theme.theme === 'light'
        ? '2px solid hsl(0, 0%, 90%)'
        : '2px solid ' + theme.select};
    transition: background-color 0.2s linear, border 0.2s linear;
  }

  .Select__single-value {
    transition: color 0.2s linear;
  }
`;

// FormControl for any typed inputs
export const StyledInput = styled(FormControl)`
  background-color: ${({ theme }) => theme.select};
  color: ${({ theme }) => theme.text[0]};
  transition: 0.2s linear !important;
  border: ${({ theme }) =>
    theme.theme === 'light'
      ? '2px solid hsl(0, 0%, 90%)'
      : '2px solid ' + theme.select};
  border-radius: 8px;

  &:focus {
    background-color: ${({ theme }) => theme.select};
  }

  &.form-control:focus {
    color: ${({ theme }) => theme.text[0]};
  }
`;

// Hr tag used to divide stuff in search form and footer
export const StyledHr = styled.hr`
  border-color: ${({ theme }) =>
    theme.theme === 'light' ? '#ededed' : '#404040'};
  transition: border 0.2s linear;
`;

// Card used in Worksheet mobile and about page
export const StyledCard = styled(Card)`
  background-color: ${({ theme }) => theme.surface[0]};
  transition: background-color 0.2s linear;
`;

// Expand buttons in worksheet and worksheet expanded
export const StyledExpandBtn = styled.div`
  background-color: ${({ theme }) => theme.multivalue};
  color: ${({ theme }) => theme.text[1]};
  position: absolute;
  top: 0%;
  z-index: 2;
  transition: 0.2s linear;
`;

// Popovers in search results item, prof popover in modal, and worksheet calendar
export const StyledPopover = styled(Popover)`
  background-color: ${({ theme }) => theme.surface[0]};
  .popover-header {
    background-color: ${({ theme }) => theme.banner};
    color: ${({ theme }) => theme.text[1]};
  }
  .popover-body {
    color: ${({ theme }) => theme.text[0]};
  }
  .arrow::after {
    border-right-color: ${({ theme }) => theme.surface[0]};
    border-left-color: ${({ theme }) => theme.surface[0]};
  }
`;

// Rating bubbles in search results list item and modal
export const StyledRating = styled.div.attrs(({ theme, rating, colormap }) => ({
  style: {
    backgroundColor:
      rating && rating > 0
        ? colormap(rating).alpha(theme.rating_alpha)
        : theme.banner,
    color: rating && rating > 0 ? colormap(rating).darken(3).css() : '#b5b5b5',
  },
}))`
  font-weight: ${({ rating }) => (rating ? 600 : 400)};
  font-size: ${({ rating }) => (rating ? 'inherit' : '12px')};
  transition: background-color 0.2s linear;
`;
