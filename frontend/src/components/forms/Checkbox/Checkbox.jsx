// src/components/forms/Checkbox/Checkbox.jsx

import React from "react";
import { Form } from "react-bootstrap";
import "./Checkbox.css";

const Checkbox = ({
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
  inline = false,
  className = "",
  ...props
}) => {
  const hasError = touched && error;

  return (
    <div className={`custom-checkbox-wrapper ${className}`}>
      <Form.Check
        type="checkbox"
        id={name}
        name={name}
        label={label}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        onBlur={onBlur}
        disabled={disabled}
        required={required}
        isInvalid={hasError}
        inline={inline}
        className="custom-checkbox"
        {...props}
      />
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

export default Checkbox;
