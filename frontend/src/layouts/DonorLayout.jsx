import React from 'react';
import DonorNavbar from '../components/donor/DonorNavbar';
import { Outlet } from 'react-router-dom';

const DonorLayout = () => {
  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Navbar */}
      <header className="flex-shrink-0 z-10">
        <DonorNavbar />
      </header>

      {/* Scrollable Content Area */}
      <main className="flex-1 overflow-y-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
};

export default DonorLayout;
