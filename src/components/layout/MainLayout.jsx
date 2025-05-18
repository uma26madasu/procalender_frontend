import React from 'react';
import Sidebar from './Sidebar';

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main className="ml-60 pt-4 px-8 max-w-7xl fade-in">{children}</main>
    </div>
  );
};

export default MainLayout;