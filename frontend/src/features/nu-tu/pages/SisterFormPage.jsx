// src/features/nu-tu/pages/SisterFormPage.jsx

import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Nav,
  Tab,
} from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { sisterService, communityService } from "@services";
import { useForm } from "@hooks";
import Input from "@components/forms/Input";
import Select from "@components/forms/Select";
import DatePicker from "@components/forms/DatePicker";
import TextArea from "@components/forms/TextArea";
import FileUpload from "@components/forms/FileUpload";
import LoadingSpinner from "@components/common/Loading/LoadingSpinner";
import Breadcrumb from "@components/common/Breadcrumb";
import {
  JOURNEY_STAGES,
  JOURNEY_STAGE_LABELS,
  SISTER_STATUS,
  SISTER_STATUS_LABELS,
} from "@utils/constants";
import { isValidEmail, isValidPhone } from "@utils/validators";

const SisterFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [communities, setCommunities] = useState([]);

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
    // Basic Info
    full_name: "",
    religious_name: "",
    sister_code: "",
    birth_date: "",
    birth_place: "",
    nationality: "Việt Nam",
    id_card: "",
    id_card_date: "",
    id_card_place: "",
    phone: "",
    email: "",
    permanent_address: "",
    current_address: "",

    // Family Info
    father_name: "",
    father_occupation: "",
    mother_name: "",
    mother_occupation: "",
    siblings_count: "",
    family_address: "",

    // Status
    current_stage: JOURNEY_STAGES.ASPIRANT,
    status: SISTER_STATUS.ACTIVE,
    community_id: "",

    // Avatar
    avatar_url: "",
  });

  useEffect(() => {
    fetchCommunities();
    if (isEditMode) {
      fetchSisterData();
    }
  }, [id]);

  const fetchCommunities = async () => {
    try {
      const response = await communityService.getList({ page_size: 100 });
      if (response.success) {
        setCommunities(response.data.items);
      }
    } catch (error) {
      console.error("Error fetching communities:", error);
    }
  };

  const fetchSisterData = async () => {
    try {
      setLoading(true);
      const response = await sisterService.getById(id);
      if (response.success) {
        setValues(response.data);
      }
    } catch (error) {
      console.error("Error fetching sister data:", error);
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    const newErrors = {};

    // Required fields
    if (!values.full_name) newErrors.full_name = "Họ tên là bắt buộc";
    if (!values.sister_code) newErrors.sister_code = "Mã số là bắt buộc";
    if (!values.birth_date) newErrors.birth_date = "Ngày sinh là bắt buộc";

    // Email validation
    if (values.email && !isValidEmail(values.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    // Phone validation
    if (values.phone && !isValidPhone(values.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ";
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

      let response;
      if (isEditMode) {
        response = await sisterService.update(id, values);
      } else {
        response = await sisterService.create(values);
      }

      if (response.success) {
        navigate(`/nu-tu/${response.data.id}`);
      }
    } catch (error) {
      console.error("Error saving sister:", error);
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
      navigate(isEditMode ? `/nu-tu/${id}` : "/nu-tu");
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
          { label: "Quản lý Nữ Tu", link: "/nu-tu" },
          { label: isEditMode ? "Chỉnh sửa" : "Thêm mới" },
        ]}
      />

      {/* Header */}
      <div className="mb-4">
        <h2 className="mb-1">
          {isEditMode ? "Chỉnh sửa Nữ Tu" : "Thêm Nữ Tu Mới"}
        </h2>
        <p className="text-muted mb-0">
          {isEditMode ? "Cập nhật thông tin nữ tu" : "Nhập thông tin nữ tu mới"}
        </p>
      </div>

      <Form onSubmit={handleSubmit}>
        <Row className="g-4">
          {/* Left Column - Avatar */}
          <Col lg={3}>
            <Card>
              <Card.Body>
                <h5 className="mb-3">Ảnh đại diện</h5>
                <FileUpload
                  value={values.avatar_url}
                  onChange={(url) => setFieldValue("avatar_url", url)}
                  accept="image/*"
                  maxSize={5 * 1024 * 1024}
                  preview
                />
              </Card.Body>
            </Card>
          </Col>

          {/* Right Column - Form */}
          <Col lg={9}>
            <Tab.Container defaultActiveKey="basic">
              <Card>
                <Card.Header className="bg-white">
                  <Nav variant="tabs">
                    <Nav.Item>
                      <Nav.Link eventKey="basic">
                        <i className="fas fa-user me-2"></i>
                        Thông tin cơ bản
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="family">
                        <i className="fas fa-users me-2"></i>
                        Thông tin gia đình
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="status">
                        <i className="fas fa-info-circle me-2"></i>
                        Trạng thái
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>
                </Card.Header>

                <Card.Body>
                  <Tab.Content>
                    {/* Basic Info Tab */}
                    <Tab.Pane eventKey="basic">
                      <Row className="g-3">
                        <Col md={6}>
                          <Input
                            label="Họ và tên"
                            name="full_name"
                            value={values.full_name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={errors.full_name}
                            touched={touched.full_name}
                            required
                          />
                        </Col>

                        <Col md={6}>
                          <Input
                            label="Tên thánh"
                            name="religious_name"
                            value={values.religious_name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </Col>

                        <Col md={6}>
                          <Input
                            label="Mã số"
                            name="sister_code"
                            value={values.sister_code}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={errors.sister_code}
                            touched={touched.sister_code}
                            required
                          />
                        </Col>

                        <Col md={6}>
                          <DatePicker
                            label="Ngày sinh"
                            name="birth_date"
                            value={values.birth_date}
                            onChange={(date) =>
                              setFieldValue("birth_date", date)
                            }
                            onBlur={handleBlur}
                            error={errors.birth_date}
                            touched={touched.birth_date}
                            required
                          />
                        </Col>

                        <Col md={6}>
                          <Input
                            label="Nơi sinh"
                            name="birth_place"
                            value={values.birth_place}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </Col>

                        <Col md={6}>
                          <Input
                            label="Quốc tịch"
                            name="nationality"
                            value={values.nationality}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </Col>

                        <Col md={4}>
                          <Input
                            label="CMND/CCCD"
                            name="id_card"
                            value={values.id_card}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </Col>

                        <Col md={4}>
                          <DatePicker
                            label="Ngày cấp"
                            name="id_card_date"
                            value={values.id_card_date}
                            onChange={(date) =>
                              setFieldValue("id_card_date", date)
                            }
                            onBlur={handleBlur}
                          />
                        </Col>

                        <Col md={4}>
                          <Input
                            label="Nơi cấp"
                            name="id_card_place"
                            value={values.id_card_place}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </Col>

                        <Col md={6}>
                          <Input
                            label="Điện thoại"
                            name="phone"
                            value={values.phone}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={errors.phone}
                            touched={touched.phone}
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
                          />
                        </Col>

                        <Col md={12}>
                          <TextArea
                            label="Địa chỉ thường trú"
                            name="permanent_address"
                            value={values.permanent_address}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            rows={2}
                          />
                        </Col>

                        <Col md={12}>
                          <TextArea
                            label="Địa chỉ hiện tại"
                            name="current_address"
                            value={values.current_address}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            rows={2}
                          />
                        </Col>
                      </Row>
                    </Tab.Pane>

                    {/* Family Info Tab */}
                    <Tab.Pane eventKey="family">
                      <Row className="g-3">
                        <Col md={6}>
                          <Input
                            label="Tên cha"
                            name="father_name"
                            value={values.father_name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </Col>

                        <Col md={6}>
                          <Input
                            label="Nghề nghiệp cha"
                            name="father_occupation"
                            value={values.father_occupation}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </Col>

                        <Col md={6}>
                          <Input
                            label="Tên mẹ"
                            name="mother_name"
                            value={values.mother_name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </Col>

                        <Col md={6}>
                          <Input
                            label="Nghề nghiệp mẹ"
                            name="mother_occupation"
                            value={values.mother_occupation}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </Col>

                        <Col md={12}>
                          <Input
                            label="Số anh chị em"
                            name="siblings_count"
                            type="number"
                            value={values.siblings_count}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </Col>

                        <Col md={12}>
                          <TextArea
                            label="Địa chỉ gia đình"
                            name="family_address"
                            value={values.family_address}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            rows={3}
                          />
                        </Col>
                      </Row>
                    </Tab.Pane>

                    {/* Status Tab */}
                    <Tab.Pane eventKey="status">
                      <Row className="g-3">
                        <Col md={6}>
                          <Select
                            label="Giai đoạn hiện tại"
                            name="current_stage"
                            value={values.current_stage}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          >
                            {Object.entries(JOURNEY_STAGE_LABELS).map(
                              ([value, label]) => (
                                <option key={value} value={value}>
                                  {label}
                                </option>
                              )
                            )}
                          </Select>
                        </Col>

                        <Col md={6}>
                          <Select
                            label="Trạng thái"
                            name="status"
                            value={values.status}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          >
                            {Object.entries(SISTER_STATUS_LABELS).map(
                              ([value, label]) => (
                                <option key={value} value={value}>
                                  {label}
                                </option>
                              )
                            )}
                          </Select>
                        </Col>

                        <Col md={12}>
                          <Select
                            label="Cộng đoàn"
                            name="community_id"
                            value={values.community_id}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          >
                            <option value="">Chọn cộng đoàn</option>
                            {communities.map((community) => (
                              <option key={community.id} value={community.id}>
                                {community.name}
                              </option>
                            ))}
                          </Select>
                        </Col>
                      </Row>
                    </Tab.Pane>
                  </Tab.Content>
                </Card.Body>

                <Card.Footer className="bg-white border-top">
                  <div className="d-flex justify-content-end gap-2">
                    <Button
                      variant="secondary"
                      onClick={handleCancel}
                      disabled={submitting}
                    >
                      <i className="fas fa-times me-2"></i>
                      Hủy
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
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
                  </div>
                </Card.Footer>
              </Card>
            </Tab.Container>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

export default SisterFormPage;
