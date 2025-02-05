import { useState, useEffect } from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';

const DarkModeSwitcher = () => {
  const [colorMode, setColorMode] = useState(() => {
    // Load from localStorage or default to 'light'
    return localStorage.getItem('colorMode') || 'light';
  });

  useEffect(() => {
    if (colorMode === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
    // Save preference in localStorage
    localStorage.setItem('colorMode', colorMode);
  }, [colorMode]);

  // Toggle between light and dark mode
  const toggleColorMode = () => {
    setColorMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  return (
    <div onClick={toggleColorMode} className="flex items-center cursor-pointer">
      <div
        className={`w-16 h-8 flex items-center rounded-full p-1 transition-all duration-300 ${
          colorMode === 'light'
            ? 'bg-white border border-boxdark'
            : 'bg-boxdark border border-white'
        }`}
      >
        <div
          className={`w-6 h-6 flex items-center justify-center text-xl transition-all duration-300 transform ${
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
