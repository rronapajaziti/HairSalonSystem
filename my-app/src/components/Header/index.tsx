import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DropdownMessage from './DropdownMessage';
import DropdownNotification from './DropdownNotification';
import DropdownUser from './DropdownUser';
import LogoIcon from '../../images/logo/logo-icon.svg';
import DarkModeSwitcher from './DarkModeSwitcher';

const Header = (props: {
  sidebarOpen: string | boolean | undefined;
  setSidebarOpen: (arg0: boolean) => void;
  setSearchQuery: (query: string) => void; // Add a prop for managing search query
}) => {
  const [searchQuery, setSearchQueryState] = useState(''); // Local state for search query

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQueryState(query); // Update local search state
    props.setSearchQuery(query); // Pass search query to parent component or global state
  };

  return (
    <header className="sticky top-0 z-999 flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
      <div className="flex flex-grow items-center justify-between px-4 py-4 shadow-2 md:px-6 2xl:px-11">
        <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
          {/* Hamburger Toggle Button */}
          <button
            aria-controls="sidebar"
            onClick={(e) => {
              e.stopPropagation();
              props.setSidebarOpen(!props.sidebarOpen);
            }}
            className="z-50 block rounded-sm border border-stroke bg-white p-2 shadow-sm text-black hover:bg-black hover:text-white dark:border-strokedark dark:bg-boxdark dark:text-black dark:hover:bg-black dark:hover:text-white lg:hidden"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="1.5em"
              height="1.5em"
              className="transition-colors duration-300"
            >
              <path
                fill="currentColor"
                d="M4 22H2V2h2zM22 7H6v3h16zm-6 7H6v3h10z"
              />
            </svg>
          </button>
        </div>

        <div className="hidden sm:block">
          {/* Search Box */}
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

        <div className="flex items-center gap-3 2xsm:gap-7">
          <ul className="flex items-center gap-2 2xsm:gap-4">
            {/* Dark Mode Toggler */}
            <DarkModeSwitcher />
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;
