export const IS_FIGMA =
  typeof window !== 'undefined' &&
  window.location.hostname.includes('figma');

export const IS_DEMO =
  import.meta.env.VITE_DEMO_MODE === 'true' || IS_FIGMA;
