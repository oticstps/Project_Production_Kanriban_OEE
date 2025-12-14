import React from 'react';
import Sidebar from '../common/Sidebar';
import Header from '../common/Header';

const Layout = ({ children }) => {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-4 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;