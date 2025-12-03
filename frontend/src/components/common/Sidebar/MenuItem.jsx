// src/components/common/Sidebar/MenuItem.jsx - AKKHOR STYLE

import React from "react";
import { Nav } from "react-bootstrap";

const MenuItem = ({
  item,
  isActive,
  onClick,
  isChild = false,
  isCollapsed = false,
  tooltip,
}) => {
  return (
    <Nav.Link
      className={`sidebar-menu-item ${isActive ? "active" : ""} ${
        isChild ? "child-item" : ""
      }`}
      onClick={onClick}
      data-tooltip={isCollapsed ? tooltip : undefined}
    >
      <div className="menu-item-content">
        <div className="menu-item-icon">
          <i className={item.icon}></i>
        </div>
        {!isCollapsed && (
          <>
            <span className="menu-item-text">{item.label}</span>
            {item.badge && (
              <span className={`badge bg-${item.badge.color} ms-auto`}>
                {item.badge.text}
              </span>
            )}
          </>
        )}
      </div>
    </Nav.Link>
  );
};

export default MenuItem;
