import React, { useState, ReactNode } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

interface DefaultLayoutProps {
  children: ReactNode;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const DefaultLayout = ({ children, searchQuery, setSearchQuery }: DefaultLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="dark:bg-boxdark-2 dark:text-bodydark">
      <div className="flex h-screen overflow-hidden">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden dark:border-strokedark dark:bg-boxdark">
          <Header
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          <main>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10 dark:border-strokedark dark:bg-boxdark">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default DefaultLayout;
