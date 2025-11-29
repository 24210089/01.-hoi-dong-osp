// src/components/forms/Radio/Radio.jsx

import React from "react";
import { Form } from "react-bootstrap";
import "./Radio.css";

const Radio = ({
  label,
  name,
  value,
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
    <div className={`custom-radio-wrapper ${className}`}>
      <Form.Check
        type="radio"
        id={`${name}-${value}`}
        name={name}
        label={label}
        value={value}
        checked={checked}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        disabled={disabled}
        required={required}
        isInvalid={hasError}
        inline={inline}
        className="custom-radio"
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

// RadioGroup component for multiple radio buttons
export const RadioGroup = ({
  label,
  name,
  options,
  value,
  onChange,
  onBlur,
  error,
  touched,
  disabled = false,
  required = false,
  helpText,
  inline = false,
  className = "",
}) => {
  const hasError = touched && error;

  return (
    <div className={`radio-group-wrapper ${className}`}>
      {label && (
        <Form.Label>
          {label}
          {required && <span className="text-danger ms-1">*</span>}
        </Form.Label>
      )}
      <div className={inline ? "d-flex gap-3" : ""}>
        {options.map((option) => (
          <Radio
            key={option.value}
            label={option.label}
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={onChange}
            onBlur={onBlur}
            disabled={disabled || option.disabled}
            inline={inline}
          />
        ))}
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

export default Radio;
