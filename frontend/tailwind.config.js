/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        dark: {
          base: '#0F1116',
          surface: '#151924',
          elevated: '#1C2330',
          warm: '#272F3D',
        },
        accent: {
          rust: '#D67C56',
          teal: '#4A9A9F',
          saffron: '#F0C674',
        },
        text: {
          primary: '#F5F6F8',
          secondary: '#C7CBD6',
          muted: '#8A91A3',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Fraunces', 'Georgia', 'serif'],
      },
      borderRadius: {
        'custom-sm': '6px',
        'custom-md': '12px',
        'custom-lg': '24px',
      },
      boxShadow: {
        'glow': '0 0 16px rgba(214, 124, 86, 0.15)',
        'glow-teal': '0 0 16px rgba(74, 154, 159, 0.15)',
        'soft': '0 4px 24px rgba(0, 0, 0, 0.3)',
      },
      animation: {
        'wave': 'wave 3s ease-in-out infinite',
      },
      keyframes: {
        wave: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};
