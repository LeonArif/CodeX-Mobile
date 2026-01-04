/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Light mode colors
        'light-bg': '#fff',
        'light-bg-secondary': '#f6f6f6',
        'light-text': '#18181b',
        'light-editor': '#e1e1e7ff',
        // Dark mode colors
        'dark-bg': '#000',
        'dark-bg-secondary': '#18181b',
        'dark-text': '#f6f6f6',
        'dark-editor': '#23232799',
      },
    },
  },
  plugins: [],
}
