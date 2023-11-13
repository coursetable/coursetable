/// <reference types="react-scripts" />

declare global {
  interface Window {
    FB: typeof FB;
  }
}
window.FB = window.FB || {};
