// src/layouts/MainLayout.jsx

import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '@components/common/Header/Header';
import Sidebar from '@components/common/Sidebar/Sidebar';
import { useSidebar } from '@context';

const MainLayout = () => {
  const { isOpen, isCompact, toggleSidebar, closeSidebar, toggleCompact } = useSidebar();

  return (
    <div className="app-container">
      <Sidebar
        isOpen={isOpen}
        onClose={closeSidebar}
        isCompact={isCompact}
        onToggleCompact={toggleCompact}
      />
      <div className={`main-wrapper ${isCompact ? 'sidebar-compact' : ''}`}>
        <Header toggleSidebar={toggleSidebar} isSidebarOpen={isOpen} />
        <main className="main-content p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
