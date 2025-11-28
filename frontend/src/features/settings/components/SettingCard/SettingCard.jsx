// src/features/settings/components/SettingCard/SettingCard.jsx

import React from "react";
import { Card } from "react-bootstrap";
import "./SettingCard.css";

const SettingCard = ({ icon, title, description, children, actions }) => {
  return (
    <Card className="setting-card">
      <Card.Body>
        <div className="setting-header mb-3">
          <div className="d-flex align-items-start">
            {icon && (
              <div className="setting-icon me-3">
                <i className={icon}></i>
              </div>
            )}
            <div className="flex-grow-1">
              <h5 className="setting-title mb-1">{title}</h5>
              {description && (
                <p className="setting-description text-muted mb-0">
                  {description}
                </p>
              )}
            </div>
            {actions && <div className="setting-actions">{actions}</div>}
          </div>
        </div>
        <div className="setting-content">{children}</div>
      </Card.Body>
    </Card>
  );
};

export default SettingCard;
