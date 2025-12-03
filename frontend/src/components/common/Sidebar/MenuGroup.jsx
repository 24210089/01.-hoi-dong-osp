// src/components/common/Sidebar/MenuGroup.jsx - AKKHOR STYLE

import React from "react";
import { Nav, Collapse } from "react-bootstrap";
import MenuItem from "./MenuItem";

const MenuGroup = ({
  item,
  isExpanded,
  onToggle,
  activeMenu,
  onMenuClick,
  isCollapsed = false,
}) => {
  const hasActiveChild = item.children?.some((child) =>
    activeMenu.startsWith(child.path)
  );

  return (
    <div className="sidebar-menu-group">
      <Nav.Link
        className={`sidebar-menu-item group-item ${
          hasActiveChild ? "active" : ""
        } ${isExpanded ? "expanded" : ""}`}
        onClick={onToggle}
        data-tooltip={isCollapsed ? item.label : undefined}
      >
        <div className="menu-item-content">
          <div className="menu-item-icon">
            <i className={item.icon}></i>
          </div>
          {!isCollapsed && (
            <>
              <span className="menu-item-text">{item.label}</span>
              <i
                className={`fas fa-chevron-right ms-auto menu-arrow ${
                  isExpanded ? "rotated" : ""
                }`}
              ></i>
            </>
          )}
        </div>
      </Nav.Link>

      {/* Không hiển thị submenu trong collapsed mode */}
      {!isCollapsed && (
        <Collapse in={isExpanded}>
          <div className="sidebar-submenu">
            {item.children?.map((child) => (
              <MenuItem
                key={child.id}
                item={child}
                isActive={activeMenu === child.path}
                onClick={() => onMenuClick(child.path)}
                isChild={true}
              />
            ))}
          </div>
        </Collapse>
      )}
    </div>
  );
};

export default MenuGroup;
