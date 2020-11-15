export const lightTheme = {
  theme: 'light',
  text: ['#141414', '#7a7a7a'], // [Primary, Secondary]
  background: '#FFF', // White background
  surface: ['#FFF', '#FFF'], // All surfaces are white
  banner: 'hsl(0,0%,90%)', // For slightly grey surfaces
  border: '#f6f6f6', // Used in borders (calendar, and between list items)
  select: '#FFF', // Background color for react-select
  select_hover: '#e1edff', // Blueish tint to use on hover
  multivalue: 'hsl(0,0%,90%)', // Multivalue background-color used in react-select
  hidden: '#b9b8b8', // Color to use when course is hidden
  rating_alpha: 1, // Rating bubble's opacity
};
export const darkTheme = {
  theme: 'dark',
  text: ['#FAFAFA', '#bababa'], // [Primary, Secondary]
  background: '#121212', // darkest color used in background
  surface: ['#242424', '#363636'], // [Primary, Secondary] secondary is lighter and goes on top
  banner: '#363636', // Used when light mode needs to be greyish. Otherwise, same as secondary surface
  border: '#303030', // Used in borders (calendar, and between list items)
  select: '#303030', // Background color for react-select
  select_hover: '#446491', // Blueish tint to use on hover
  multivalue: '#4d4d4d', // Multivalue background-color used in react-select
  hidden: '#4d4d4d', // Color to use when course is hidden
  rating_alpha: 0.75, // Rating bubble's opacity
};
