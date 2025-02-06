import React, { useState, ReactNode } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

interface DefaultLayoutProps {
  children: ReactNode;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const DefaultLayout = ({
  children,
  searchQuery,
  setSearchQuery,
}: DefaultLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="dark:bg-boxdark-2 dark:text-bodydark relative flex h-screen overflow-hidden dark:text-white dark:border-strokedark dark:bg-boxdark">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <div
        className={`flex-1 relative overflow-hidden ${
          sidebarOpen ? 'blur-sm lg:blur-none' : ''
        }`}
        onClick={() => sidebarOpen && setSidebarOpen(false)} // Close sidebar when clicking content on smaller screens
      >
        <Header
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        <main className="h-screen overflow-y-auto mb-24">
          <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10 dark:border-strokedark dark:bg-boxdark">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DefaultLayout;
