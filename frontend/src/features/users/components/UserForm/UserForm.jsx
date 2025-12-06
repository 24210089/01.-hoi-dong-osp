// src/features/users/components/UserForm/UserForm.jsx

import React, { useState } from "react";
import { Modal, Form, Button, Row, Col, Alert } from "react-bootstrap";
import { useForm } from "@hooks";
import Input from "@components/forms/Input";
import Select from "@components/forms/Select";
import { isValidEmail, isValidPhone } from "@utils/validators";

const UserForm = ({ show, onHide, user, onSubmit }) => {
  const isEditMode = !!user;
  const [showPassword, setShowPassword] = useState(false);

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    setFieldValue,
    handleSubmit,
  } = useForm(
    user || {
      username: "",
      password: "",
      confirm_password: "",
      full_name: "",
      email: "",
      phone: "",
      role: "viewer",
      status: "active",
    }
  );

  const validate = () => {
    const newErrors = {};

    if (!values.username) {
      newErrors.username = "Tên đăng nhập là bắt buộc";
    } else if (values.username.length < 3) {
      newErrors.username = "Tên đăng nhập phải có ít nhất 3 ký tự";
    }

    if (!isEditMode) {
      if (!values.password) {
        newErrors.password = "Mật khẩu là bắt buộc";
      } else if (values.password.length < 6) {
        newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
      }

      if (!values.confirm_password) {
        newErrors.confirm_password = "Vui lòng xác nhận mật khẩu";
      } else if (values.password !== values.confirm_password) {
        newErrors.confirm_password = "Mật khẩu không khớp";
      }
    }

    if (!values.full_name) {
      newErrors.full_name = "Họ tên là bắt buộc";
    }

    if (!values.email) {
      newErrors.email = "Email là bắt buộc";
    } else if (!isValidEmail(values.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (values.phone && !isValidPhone(values.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }

    if (!values.role) {
      newErrors.role = "Vai trò là bắt buộc";
    }

    return newErrors;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    onSubmit(values);
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="fas fa-user me-2"></i>
          {isEditMode ? "Chỉnh sửa Người dùng" : "Thêm Người dùng Mới"}
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleFormSubmit}>
        <Modal.Body>
          {!isEditMode && (
            <Alert variant="info" className="mb-3">
              <i className="fas fa-info-circle me-2"></i>
              Mật khẩu mặc định sẽ được gửi qua email sau khi tạo tài khoản
            </Alert>
          )}

          <Row className="g-3">
            {/* Account Info */}
            <Col md={12}>
              <h6 className="mb-3">
                <i className="fas fa-user-circle me-2"></i>
                Thông tin tài khoản
              </h6>
            </Col>

            <Col md={6}>
              <Input
                label="Tên đăng nhập"
                name="username"
                value={values.username}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.username}
                touched={touched.username}
                placeholder="Nhập tên đăng nhập"
                disabled={isEditMode}
                required
              />
            </Col>

            <Col md={6}>
              <Select
                label="Vai trò"
                name="role"
                value={values.role}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.role}
                touched={touched.role}
                required
              >
                <option value="">Chọn vai trò</option>
                <option value="admin">Quản trị viên</option>
                <option value="superior_general">Bề trên Tổng quyền</option>
                <option value="superior_provincial">Bề trên Tỉnh</option>
                <option value="superior_community">Bề trên Cộng đoàn</option>
                <option value="secretary">Thư ký</option>
                <option value="viewer">Xem</option>
              </Select>
            </Col>

            {!isEditMode && (
              <>
                <Col md={6}>
                  <div className="position-relative">
                    <Input
                      label="Mật khẩu"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={errors.password}
                      touched={touched.password}
                      placeholder="Nhập mật khẩu"
                      required
                    />
                    <button
                      type="button"
                      className="btn btn-sm btn-link position-absolute"
                      style={{ right: "10px", top: "35px" }}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <i
                        className={`fas fa-eye${showPassword ? "-slash" : ""}`}
                      ></i>
                    </button>
                  </div>
                </Col>

                <Col md={6}>
                  <Input
                    label="Xác nhận mật khẩu"
                    name="confirm_password"
                    type={showPassword ? "text" : "password"}
                    value={values.confirm_password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.confirm_password}
                    touched={touched.confirm_password}
                    placeholder="Nhập lại mật khẩu"
                    required
                  />
                </Col>
              </>
            )}

            {/* Personal Info */}
            <Col md={12} className="mt-4">
              <h6 className="mb-3">
                <i className="fas fa-id-card me-2"></i>
                Thông tin cá nhân
              </h6>
            </Col>

            <Col md={12}>
              <Input
                label="Họ và tên"
                name="full_name"
                value={values.full_name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.full_name}
                touched={touched.full_name}
                placeholder="Nhập họ và tên đầy đủ"
                required
              />
            </Col>

            <Col md={6}>
              <Input
                label="Email"
                name="email"
                type="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.email}
                touched={touched.email}
                placeholder="example@email.com"
                required
              />
            </Col>

            <Col md={6}>
              <Input
                label="Số điện thoại"
                name="phone"
                value={values.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.phone}
                touched={touched.phone}
                placeholder="0123456789"
              />
            </Col>

            {/* Status */}
            <Col md={12} className="mt-4">
              <h6 className="mb-3">
                <i className="fas fa-toggle-on me-2"></i>
                Trạng thái
              </h6>
            </Col>

            <Col md={12}>
              <Select
                label="Trạng thái tài khoản"
                name="status"
                value={values.status}
                onChange={handleChange}
                onBlur={handleBlur}
              >
                <option value="active">Đang hoạt động</option>
                <option value="inactive">Đã khóa</option>
              </Select>
            </Col>
          </Row>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            <i className="fas fa-times me-2"></i>
            Hủy
          </Button>
          <Button type="submit" variant="primary">
            <i className="fas fa-save me-2"></i>
            {isEditMode ? "Cập nhật" : "Tạo tài khoản"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default UserForm;
