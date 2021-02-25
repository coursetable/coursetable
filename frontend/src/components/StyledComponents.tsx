import styled from 'styled-components';
import { FormControl, Card, Popover } from 'react-bootstrap';
import chroma from 'chroma-js';
import { breakpoints } from '../utilities';

// Div used to color the background of surface components
export const SurfaceComponent = styled.div<{ layer: number }>`
  background-color: ${({ theme, layer }) => theme.surface[layer]};
`;

// Span used to color text. Type is an int that represents primary (0) or secondary (1) color
export const TextComponent = styled.span<{ type: number }>`
  color: ${({ theme, type }) => theme.text[type]};
`;

// Small text component
export const SmallTextComponent = styled(TextComponent)`
  font-size: 70%;
  ${breakpoints('font-size', '%', [{ 1320: 64 }])};
`;

// Div for banner components/any components that are light grey in light mode, dark grey in dark mode
export const StyledBanner = styled.div`
  background-color: ${({ theme }) => theme.banner};
`;

// FormControl for any typed inputs
export const StyledInput = styled(FormControl)`
  background-color: ${({ theme }) => theme.select};
  color: ${({ theme }) => theme.text[0]};
  border: solid 2px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 0.375rem 0.75rem;

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
`;

// Card used in Worksheet mobile and about page
export const StyledCard = styled(Card)`
  background-color: ${({ theme }) => theme.surface[0]};
`;

// Expand buttons in worksheet and worksheet expanded
export const StyledExpandBtn = styled.div`
  background-color: ${({ theme }) => theme.multivalue};
  color: ${({ theme }) => theme.text[1]};
  position: absolute;
  top: 0%;
  z-index: 2;
  transition: transform 0.05s linear;
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
export const StyledRating = styled.div<{
  rating: number;
  colormap: chroma.Scale<chroma.Color>;
}>`
  font-weight: ${({ rating }) => (rating ? 600 : 400)};
  font-size: ${({ rating }) => (rating ? 'inherit' : '12px')};
  background-color: ${({ theme, rating, colormap }) =>
    rating && rating > 0
      ? colormap(rating).alpha(theme.rating_alpha).css()
      : 'inherit'};
  color: ${({ rating }) =>
    // rating && rating > 0 ? colormap(rating).darken(3).css() : '#b5b5b5'};
    rating && rating > 0 ? '#141414' : '#b5b5b5'};
  display: flex;
  align-items: center;
`;

// Primary Color link
export const StyledLink = styled.span`
  color: ${({ theme }) => theme.primary};
  &:hover {
    color: ${({ theme }) => theme.primary_hover};
    cursor: pointer;
  }
`;

// Show Primary color on hover
export const StyledHoverText = styled.span`
  ${breakpoints('font-size', 'rem', [{ 1320: 0.9 }])};
  &:hover {
    color: ${({ theme }) => theme.primary};
    cursor: pointer;
  }
`;

// SVG Icons used in search results for the various ratings
export const StyledIcon = styled.div`
  fill: ${({ theme }) => theme.text[0]};
  margin-top: auto;
  margin-bottom: auto;
`;
