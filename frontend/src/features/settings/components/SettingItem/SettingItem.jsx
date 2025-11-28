// src/features/settings/components/SettingItem/SettingItem.jsx

import React from "react";
import { Form } from "react-bootstrap";
import "./SettingItem.css";

const SettingItem = ({
  label,
  description,
  type = "text",
  value,
  onChange,
  options = [],
  disabled = false,
}) => {
  const renderInput = () => {
    switch (type) {
      case "switch":
        return (
          <Form.Check
            type="switch"
            checked={value}
            onChange={(e) => onChange(e.target.checked)}
            disabled={disabled}
            className="setting-switch"
          />
        );

      case "select":
        return (
          <Form.Select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            className="setting-select"
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Form.Select>
        );

      case "textarea":
        return (
          <Form.Control
            as="textarea"
            rows={3}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            className="setting-textarea"
          />
        );

      case "number":
        return (
          <Form.Control
            type="number"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            className="setting-input"
          />
        );

      default:
        return (
          <Form.Control
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            className="setting-input"
          />
        );
    }
  };

  return (
    <div className="setting-item">
      <div className="setting-item-info">
        <div className="setting-item-label">{label}</div>
        {description && (
          <div className="setting-item-description">{description}</div>
        )}
      </div>
      <div className="setting-item-control">{renderInput()}</div>
    </div>
  );
};

export default SettingItem;
