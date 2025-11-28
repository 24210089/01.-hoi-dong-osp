// src/features/users/pages/UserFormPage.jsx

import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Alert,
} from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { userService } from "@services";
import { useForm } from "@hooks";
import Input from "@components/forms/Input";
import Select from "@components/forms/Select";
import { isValidEmail, isValidPhone } from "@utils/validators";
import LoadingSpinner from "@components/common/Loading/LoadingSpinner";
import Breadcrumb from "@components/common/Breadcrumb";

const UserFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    setValues,
    setFieldValue,
    validateForm,
  } = useForm({
    username: "",
    password: "",
    confirm_password: "",
    full_name: "",
    email: "",
    phone: "",
    role: "viewer",
    status: "active",
    avatar: "",
  });

  useEffect(() => {
    if (isEditMode) {
      fetchUserData();
    }
  }, [id]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await userService.getById(id);
      if (response.success) {
        setValues(response.data);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      setError("Không thể tải dữ liệu người dùng");
    } finally {
      setLoading(false);
    }
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      validateForm(validationErrors);
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      let response;
      if (isEditMode) {
        response = await userService.update(id, values);
      } else {
        response = await userService.create(values);
      }

      if (response.success) {
        navigate(`/users/${response.data.id}`);
      } else {
        setError(response.error);
      }
    } catch (error) {
      console.error("Error saving user:", error);
      setError("Có lỗi xảy ra khi lưu người dùng");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (
      window.confirm(
        "Bạn có chắc chắn muốn hủy? Các thay đổi sẽ không được lưu."
      )
    ) {
      navigate(isEditMode ? `/users/${id}` : "/users");
    }
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "60vh" }}
      >
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <Container fluid className="py-4">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: "Trang chủ", link: "/dashboard" },
          { label: "Người dùng", link: "/users" },
          { label: isEditMode ? "Chỉnh sửa" : "Thêm mới" },
        ]}
      />

      {/* Header */}
      <div className="mb-4">
        <h2 className="mb-1">
          {isEditMode ? "Chỉnh sửa Người dùng" : "Thêm Người dùng Mới"}
        </h2>
        <p className="text-muted mb-0">
          {isEditMode
            ? "Cập nhật thông tin người dùng"
            : "Nhập thông tin người dùng mới"}
        </p>
      </div>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError("")}>
          <i className="fas fa-exclamation-circle me-2"></i>
          {error}
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        <Row className="g-4">
          <Col lg={8}>
            {/* Account Info */}
            <Card className="mb-4">
              <Card.Header className="bg-white border-bottom">
                <h5 className="mb-0">
                  <i className="fas fa-user-circle me-2"></i>
                  Thông tin tài khoản
                </h5>
              </Card.Header>
              <Card.Body>
                <Row className="g-3">
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
                      <option value="manager">Quản lý</option>
                      <option value="staff">Nhân viên</option>
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
                              className={`fas fa-eye${
                                showPassword ? "-slash" : ""
                              }`}
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
                </Row>
              </Card.Body>
            </Card>

            {/* Personal Info */}
            <Card>
              <Card.Header className="bg-white border-bottom">
                <h5 className="mb-0">
                  <i className="fas fa-id-card me-2"></i>
                  Thông tin cá nhân
                </h5>
              </Card.Header>
              <Card.Body>
                <Row className="g-3">
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

                  <Col md={12}>
                    <Input
                      label="URL Avatar"
                      name="avatar"
                      value={values.avatar}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="https://example.com/avatar.jpg"
                    />
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            {/* Actions */}
            <Card className="sticky-top" style={{ top: "20px" }}>
              <Card.Header className="bg-white border-bottom">
                <h5 className="mb-0">
                  <i className="fas fa-cog me-2"></i>
                  Thao tác
                </h5>
              </Card.Header>
              <Card.Body>
                <Row className="g-3">
                  <Col xs={12}>
                    <Select
                      label="Trạng thái"
                      name="status"
                      value={values.status}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      <option value="active">Đang hoạt động</option>
                      <option value="inactive">Đã khóa</option>
                    </Select>
                  </Col>

                  <Col xs={12}>
                    <div className="d-grid gap-2">
                      <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        disabled={submitting}
                      >
                        {submitting ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Đang lưu...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-save me-2"></i>
                            {isEditMode ? "Cập nhật" : "Tạo mới"}
                          </>
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        size="lg"
                        onClick={handleCancel}
                        disabled={submitting}
                      >
                        <i className="fas fa-times me-2"></i>
                        Hủy
                      </Button>
                    </div>
                  </Col>
                </Row>

                <hr />

                <div className="text-muted small">
                  <p className="mb-2">
                    <i className="fas fa-info-circle me-2"></i>
                    <strong>Lưu ý:</strong>
                  </p>
                  <ul className="ps-3 mb-0">
                    <li>Các trường có dấu (*) là bắt buộc</li>
                    <li>Tên đăng nhập không thể thay đổi sau khi tạo</li>
                    <li>Mật khẩu phải có ít nhất 6 ký tự</li>
                    {!isEditMode && (
                      <li>Email sẽ được dùng để gửi thông tin đăng nhập</li>
                    )}
                  </ul>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

export default UserFormPage;
