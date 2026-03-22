import { THEME } from "./env";

/**
 * Sovereign UI Framework Configuration
 * Defines the layout, spacing, and visual constraints for the PejicAIX Sovereign UI.
 */
export const uiFramework = {
  theme: THEME || 'brutalist-luxury',
  
  layout: {
    sidebarWidth: '280px',
    headerHeight: '64px',
    footerHeight: '48px',
    maxContentWidth: '1440px',
    borderRadius: {
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
      full: '9999px'
    }
  },

  typography: {
    fonts: {
      sans: 'var(--f-sans)',
      display: 'var(--f-display)',
      mono: 'var(--f-mono)'
    },
    weights: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    }
  },

  animations: {
    transitions: {
      fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
      normal: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
      slow: '500ms cubic-bezier(0.4, 0, 0.2, 1)'
    },
    effects: {
      glow: '0 0 20px var(--accent-glow)',
      blur: 'backdrop-filter: blur(20px)'
    }
  },

  zindex: {
    base: 0,
    background: -1,
    content: 10,
    overlay: 50,
    modal: 100,
    toast: 200,
    guardian: 999
  }
};

export type UIFramework = typeof uiFramework;
