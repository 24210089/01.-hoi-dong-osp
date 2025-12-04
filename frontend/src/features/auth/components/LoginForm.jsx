// src/features/auth/components/LoginForm/LoginForm.jsx

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Form, Button, Alert, InputGroup } from "react-bootstrap";
import { useForm } from "@hooks";
import "./LoginForm.css";

const LoginForm = ({ onSubmit, loading, error, onClearError }) => {
  const [showPassword, setShowPassword] = useState(false);
  
  const { values, errors, touched, handleChange, handleBlur, handleSubmit } =
    useForm({
      username: "",
      password: "",
    });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-form">
      {/* Logo */}
      <div className="text-center mb-4">
        <div className="login-logo">
          <i className="fas fa-church"></i>
        </div>
        <h3 className="login-title mt-3">Đăng nhập</h3>
        <p className="login-subtitle text-muted">
          Nhập thông tin tài khoản của bạn
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="danger" dismissible onClose={onClearError}>
          <i className="fas fa-exclamation-circle me-2"></i>
          {error}
        </Alert>
      )}

      {/* Login Form */}
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group className="mb-3">
          <Form.Label className="fw-semibold">
            Tên đăng nhập <span className="text-danger">*</span>
          </Form.Label>
          <InputGroup>
            <InputGroup.Text className="input-icon">
              <i className="fas fa-user"></i>
            </InputGroup.Text>
            <Form.Control
              type="text"
              name="username"
              value={values.username}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Nhập tên đăng nhập"
              disabled={loading}
              isInvalid={touched.username && errors.username}
            />
          </InputGroup>
          {touched.username && errors.username && (
            <Form.Text className="text-danger">{errors.username}</Form.Text>
          )}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="fw-semibold">
            Mật khẩu <span className="text-danger">*</span>
          </Form.Label>
          <InputGroup>
            <InputGroup.Text className="input-icon">
              <i className="fas fa-lock"></i>
            </InputGroup.Text>
            <Form.Control
              type={showPassword ? "text" : "password"}
              name="password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Nhập mật khẩu"
              disabled={loading}
              isInvalid={touched.password && errors.password}
            />
            <InputGroup.Text 
              className="password-toggle"
              onClick={togglePasswordVisibility}
              style={{ cursor: 'pointer' }}
            >
              <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
            </InputGroup.Text>
          </InputGroup>
          {touched.password && errors.password && (
            <Form.Text className="text-danger">{errors.password}</Form.Text>
          )}
        </Form.Group>

        <div className="d-flex justify-content-between align-items-center mb-4">
          <Form.Check type="checkbox" label="Ghi nhớ đăng nhập" id="remember" />
          <Link to="/forgot-password" className="text-primary small">
            Quên mật khẩu?
          </Link>
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-100 btn-login"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2"></span>
              Đang đăng nhập...
            </>
          ) : (
            <>
              <i className="fas fa-sign-in-alt me-2"></i>
              Đăng nhập
            </>
          )}
        </Button>
      </Form>

      {/* Footer */}
      <div className="text-center mt-4">
        <p className="text-muted small mb-0">
          © 2025 Hệ Thống Quản Lý Hội Dòng
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
