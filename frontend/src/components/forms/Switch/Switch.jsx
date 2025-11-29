// src/components/forms/Switch/Switch.jsx

import React from "react";
import { Form } from "react-bootstrap";
import "./Switch.css";

const Switch = ({
  label,
  name,
  checked,
  onChange,
  onBlur,
  error,
  touched,
  disabled = false,
  required = false,
  helpText,
  size = "md", // 'sm', 'md', 'lg'
  labelPosition = "right", // 'left', 'right'
  className = "",
  ...props
}) => {
  const hasError = touched && error;

  const switchElement = (
    <Form.Check
      type="switch"
      id={name}
      name={name}
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      onBlur={onBlur}
      disabled={disabled}
      required={required}
      isInvalid={hasError}
      className={`custom-switch custom-switch-${size}`}
      {...props}
    />
  );

  const labelElement = label && (
    <Form.Label htmlFor={name} className="switch-label mb-0">
      {label}
      {required && <span className="text-danger ms-1">*</span>}
    </Form.Label>
  );

  return (
    <div className={`custom-switch-wrapper ${className}`}>
      <div
        className={`switch-container ${
          labelPosition === "left" ? "flex-row-reverse" : ""
        }`}
      >
        {labelPosition === "left" && labelElement}
        {switchElement}
        {labelPosition === "right" && labelElement}
      </div>
      {helpText && !hasError && (
        <Form.Text className="text-muted d-block mt-1">{helpText}</Form.Text>
      )}
      {hasError && (
        <Form.Control.Feedback type="invalid" className="d-block">
          {error}
        </Form.Control.Feedback>
      )}
    </div>
  );
};

export default Switch;
