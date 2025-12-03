// src/components/common/Breadcrumb/Breadcrumb.jsx - AKKHOR STYLE

import React from "react";
import { Link } from "react-router-dom";
import "./Breadcrumb.css";

const Breadcrumb = ({ title = "", items = [], className = "" }) => {
  // Default home item
  const breadcrumbItems = [
    { label: "Trang chủ", link: "/dashboard" },
    ...items,
  ];

  return (
    <div className={`breadcrumbs-area ${className}`}>
      <h3>{title || breadcrumbItems[breadcrumbItems.length - 1]?.label}</h3>
      <ul>
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;

          return (
            <li key={index}>
              {isLast || item.active ? (
                <span>{item.label}</span>
              ) : (
                <Link to={item.link}>{item.label}</Link>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Breadcrumb;
