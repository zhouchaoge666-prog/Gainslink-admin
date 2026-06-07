/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3b82f6',
          light: '#eff6ff',
        },
        success: {
          DEFAULT: '#10b981',
          light: '#ecfdf5',
        },
        warning: {
          DEFAULT: '#f59e0b',
          light: '#fffbeb',
        },
        danger: {
          DEFAULT: '#ef4444',
          light: '#fef2f2',
        },
        sidebar: '#1e293b',
        'sidebar-hover': '#334155',
        bg: '#f1f5f9',
      },
    },
  },
  plugins: [],
}
