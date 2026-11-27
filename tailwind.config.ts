import type { Config } from 'tailwindcss'

export default {
  // Theme is toggled via the `dark` class on <html> (see app/plugins/theme.client.ts)
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Values come from CSS variables in app/assets/css/tailwind.css
        comic: {
          bg: 'rgb(var(--comic-bg) / <alpha-value>)',
          ink: 'rgb(var(--comic-ink) / <alpha-value>)',
          surface: 'rgb(var(--comic-surface) / <alpha-value>)',
          soft: 'rgb(var(--comic-soft) / <alpha-value>)',
          line: 'rgb(var(--comic-line) / <alpha-value>)',
          shadow: 'rgb(var(--comic-shadow) / <alpha-value>)',
        },
      },
    },
  },
} satisfies Partial<Config>
