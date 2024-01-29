import styled from 'styled-components';
import { FormControl, Popover } from 'react-bootstrap';
import type chroma from 'chroma-js';
import { breakpoints } from '../utilities/display';

// Div used to color the background of surface components
export const SurfaceComponent = styled.div<{ layer: number }>`
  background-color: ${({ theme, layer }) => theme.surface[layer]};
  transition: background-color ${({ theme }) => theme.transDur};
`;

// Span used to color text. Type is an int that represents primary (0) or
// secondary (1) color
export const TextComponent = styled.span<{ type: number }>`
  color: ${({ theme, type }) => theme.text[type]};
  transition: color ${({ theme }) => theme.transDur};
`;

// Small text component
export const SmallTextComponent = styled(TextComponent)`
  font-size: 70%;
  ${breakpoints('font-size', '%', [{ 1320: 64 }])};
`;

// FormControl for any typed inputs
export const StyledInput = styled(FormControl)`
  background-color: ${({ theme }) => theme.select};
  color: ${({ theme }) => theme.text[0]};
  border: solid 2px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 0.375rem 0.75rem;
  transition:
    border-color ${({ theme }) => theme.transDur},
    background-color ${({ theme }) => theme.transDur},
    color ${({ theme }) => theme.transDur};

  &:hover {
    border: 2px solid hsl(0, 0%, 70%);
  }

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
  transition: border-color ${({ theme }) => theme.transDur};
`;

// Popovers in search results item, prof popover in modal, and worksheet
// calendar
export const StyledPopover = styled(Popover)`
  background-color: ${({ theme }) => theme.surface[0]};
  transition:
    border-color ${({ theme }) => theme.transDur},
    background-color ${({ theme }) => theme.transDur},
    color ${({ theme }) => theme.transDur};

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
  @media only screen and (max-width: 767px) {
    .popover-header {
      display: none;
    }
    .popover-body {
      display: none;
    }
    .arrow::before {
      display: none;
    }
    .arrow::after {
      display: none;
    }
  }
`;

// Rating bubbles in search results list item and modal
export const StyledRating = styled.div<{
  rating: number | null;
  colormap: chroma.Scale;
}>`
  font-weight: ${({ rating }) => (rating ? 600 : 400)};
  font-size: ${({ rating }) => (rating ? 'inherit' : '12px')};
  background-color: ${({ theme, rating, colormap }) =>
    rating && rating > 0
      ? colormap(rating).alpha(theme.ratingAlpha).css()
      : 'inherit'};
  color: ${({ rating }) => (rating && rating > 0 ? '#141414' : '#b5b5b5')};
  display: flex;
  align-items: center;
`;

// Primary Color link
export const StyledLink = styled.span`
  color: ${({ theme }) => theme.primary};
  transition: color ${({ theme }) => theme.transDur};
  cursor: pointer;
  &:hover {
    color: ${({ theme }) => theme.primaryHover};
  }
`;

// Show Primary color on hover
export const StyledHoverText = styled.span`
  user-select: none;
  ${breakpoints('font-size', 'rem', [{ 1320: 0.9 }])};
  cursor: pointer;
  &:hover {
    color: ${({ theme }) => theme.primary};
  }
`;
