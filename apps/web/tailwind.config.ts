import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        muse: {
          50: '#f7f6f4',
          100: '#edebe6',
          200: '#dad5cc',
          300: '#c1b8aa',
          400: '#a79a88',
          500: '#8f806e',
          600: '#736656',
          700: '#5c5144',
          800: '#4b433a',
          900: '#3f3831',
        },
      },
    },
  },
  plugins: [],
};

export default config;
