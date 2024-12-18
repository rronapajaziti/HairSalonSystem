module.exports = {
  content: ['./public/index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class', // This will let us toggle dark mode using the `dark` class
  theme: {
    extend: {
      colors: {
        boxdark: '#1A222C', // Dark background color
        strokedark: '#2E3A47', // Dark border color
      },
      boxShadow: {
        'white-custom': '0 4px 6px rgba(255, 255, 255, 0.5)',
      },
    },
  },
  plugins: [],
};
