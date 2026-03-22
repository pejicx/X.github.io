import type { Config } from 'tailwindcss'

/**
 * Sovereign Tailwind Configuration
 * Defines the visual substrate for the PejicAIX Sovereign environment.
 */
const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        sovereign: {
          primary: '#1E3A8A',
          secondary: '#3B82F6',
          accent: '#60a5fa',
          ink: '#ffffff',
          'ink-muted': '#cbd5e1',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-glow': 'pulse-glow 3s infinite ease-in-out',
        'neural-pulse': 'neural-pulse 4s infinite ease-in-out',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { textShadow: '0 0 10px rgba(96, 165, 250, 0.5)' },
          '50%': { textShadow: '0 0 30px rgba(96, 165, 250, 0.5)' },
        },
        'neural-pulse': {
          '0%, 100%': { opacity: '0.3', transform: 'scale(1)' },
          '50%': { opacity: '0.6', transform: 'scale(1.05)' },
        },
      },
      boxShadow: {
        'sovereign-glow': '0 0 20px rgba(96, 165, 250, 0.3)',
        'sovereign-intense': '0 0 40px rgba(96, 165, 250, 0.5)',
      },
      backdropBlur: {
        'sovereign': '20px',
      },
    },
  },
  plugins: [],
}

export default config
