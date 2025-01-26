import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DropdownMessage from './DropdownMessage';
import DropdownNotification from './DropdownNotification';
import DropdownUser from './DropdownUser';
import LogoIcon from '../../images/logo/logo-icon.svg';
import DarkModeSwitcher from './DarkModeSwitcher';

const Header = (props: {
  sidebarOpen: boolean; // `sidebarOpen` should be a boolean (not string) for the proper condition check
  setSidebarOpen: (arg0: boolean) => void; // function to toggle sidebar state
  setSearchQuery: (query: string) => void; // Add a prop for managing search query
}) => {
  const [searchQuery, setSearchQueryState] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQueryState(query);
    props.setSearchQuery(query);
  };

  return (
    <header className="sticky top-0 z-999 flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
      <div className="flex flex-grow items-center justify-between px-4 py-4 shadow-2 md:px-6 2xl:px-11">
        {/* Hamburger Button for mobile */}
        <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
          <button
            aria-controls="sidebar"
            onClick={(e) => {
              e.stopPropagation(); // Prevent the click from propagating to the document
              props.setSidebarOpen(!props.sidebarOpen); // Toggle sidebar open state
            }}
            className="z-99999 block rounded-sm border border-stroke bg-blue-900 p-1.5 shadow-sm dark:border-strokedark dark:bg-boxdark lg:hidden"
          >
            {/* Hamburger Icon (SVG) */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 256 256"
              width="1.5em"
              height="1.5em"
              fill="none"
            >
              <path
                fill="currentColor"
                d="M232 212h-20V40a20 20 0 0 0-20-20H64a20 20 0 0 0-20 20v172H24a12 12 0 0 0 0 24h208a12 12 0 0 0 0-24m-44 0h-16V44h16ZM68 44h80v168H68Zm68 84a16 16 0 1 1-16-16a16 16 0 0 1 16 16"
              ></path>
            </svg>
          </button>
        </div>

        {/* Search Box */}
        <div className="hidden sm:block">
          <div className="relative">
            <input
              type="text"
              placeholder="Type to search..."
              value={searchQuery}
              onChange={handleSearchChange} // Update search query
              className="w-full bg-transparent pl-9 pr-4 text-black focus:outline-none dark:text-white xl:w-125"
            />
          </div>
        </div>

        {/* User Profile & Dark Mode */}
        <div className="flex items-center gap-3 2xsm:gap-7">
          <ul className="flex items-center gap-2 2xsm:gap-4">
            <li>
              {/* Dark Mode Switcher */}
              <DarkModeSwitcher />
            </li>
            {/* Add more dropdowns if necessary */}
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;
