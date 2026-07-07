export default {content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0E7C6B',
          dark: '#0B6255',
          50: '#E8F5F3',
          100: '#D1EBE6',
          500: '#0E7C6B',
          600: '#0B6255',
        },
        accent: {
          DEFAULT: '#F97316',
          dark: '#DB6412',
          50: '#FFF3EB',
          100: '#FFE4CC',
        },
        surface: '#F7F8FA',
        ink: {
          DEFAULT: '#1A1A1A',
          muted: '#6B7280',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl: '14px',
        '2xl': '16px',
      },
      boxShadow: {
        soft: '0 2px 10px rgba(16, 24, 40, 0.06)',
        card: '0 4px 16px rgba(16, 24, 40, 0.08)',
      },
    },
  },
}
