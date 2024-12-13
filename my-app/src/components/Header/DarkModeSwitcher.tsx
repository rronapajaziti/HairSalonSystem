import { useState, useEffect } from 'react';
import { FaSun, FaMoon } from 'react-icons/fa'; // Import icons from react-icons

const DarkModeSwitcher = () => {
  const [colorMode, setColorMode] = useState('light');

  // On initial load, check localStorage for stored mode
  useEffect(() => {
    const storedMode = localStorage.getItem('colorMode');
    if (storedMode) {
      document.body.classList.add(storedMode);
      setColorMode(storedMode);
    } else {
      setColorMode('light');
    }
  }, []);

  // Handle mode change and save it to localStorage
  useEffect(() => {
    if (colorMode === 'dark') {
      document.body.classList.add('dark');
      localStorage.setItem('colorMode', 'dark');
    } else {
      document.body.classList.remove('dark');
      localStorage.setItem('colorMode', 'light');
    }
  }, [colorMode]);

  return (
    <div
      onClick={() => setColorMode(colorMode === 'light' ? 'dark' : 'light')}
      className="flex items-center cursor-pointer"
    >
      <div
        className={`w-16 h-8 flex items-center rounded-full p-1 transition-all duration-300 ${
          colorMode === 'light'
            ? 'bg-white border border-boxdark'
            : 'bg-boxdark border border-white'
        }`}
      >
        <div
          className={`w-6 h-6 flex items-center justify-center text-xl transition-all duration-300 ${
            colorMode === 'dark' ? 'translate-x-7' : ''
          }`}
        >
          {colorMode === 'light' ? (
            <FaMoon className="text-boxdark" />
          ) : (
            <FaSun className="text-white" />
          )}
        </div>
      </div>
    </div>
  );
};

export default DarkModeSwitcher;
