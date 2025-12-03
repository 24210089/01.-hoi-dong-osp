// src/layouts/MainLayout/MainLayout.jsx - AKKHOR STYLE

import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "@components/common/Header";
import Sidebar from "@components/common/Sidebar";
import Footer from "@components/common/Footer";
import "./MainLayout.css";

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Track sidebar collapsed state (sync with Sidebar component via localStorage)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem("sidebarCollapsed");
    return saved === "true";
  });

  // Listen for localStorage changes (when Sidebar toggles)
  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem("sidebarCollapsed");
      setIsSidebarCollapsed(saved === "true");
    };

    // Custom event for same-tab updates
    window.addEventListener("sidebarToggle", handleStorageChange);

    return () => {
      window.removeEventListener("sidebarToggle", handleStorageChange);
    };
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div
      className={`main-layout ${isSidebarCollapsed ? "sidebar-collapsed" : ""}`}
    >
      <Header toggleSidebar={toggleSidebar} />

      <div className="layout-container">
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

        <main className="main-content">
          <div className="content-wrapper">
            <Outlet />
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
