// src/features/su-vu/pages/MissionFormPage.jsx

import React, { useState, useEffect } from "react";
import { Container, Card, Form, Button, Row, Col } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { missionService, sisterService } from "@services";
import { useForm } from "@hooks";
import Input from "@components/forms/Input";
import Select from "@components/forms/Select";
import DatePicker from "@components/forms/DatePicker";
import TextArea from "@components/forms/TextArea";
import LoadingSpinner from "@components/common/Loading/LoadingSpinner";
import Breadcrumb from "@components/common/Breadcrumb";

const MissionFormPage = () => {
  const { id, sisterId } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [sisters, setSisters] = useState([]);

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    setFieldValue,
    setValues,
  } = useForm({
    sister_id: sisterId || "",
    field: "",
    specific_role: "",
    start_date: "",
    end_date: "",
    notes: "",
  });

  useEffect(() => {
    fetchSisters();
    if (isEditMode) {
      fetchMission();
    }
  }, [id]);

  const fetchSisters = async () => {
    try {
      const response = await sisterService.getList({ limit: 1000, status: "all" });
      if (response.success) {
        const items = response.data?.items || response.data || [];
        setSisters(items);
      }
    } catch (error) {
      console.error("Error fetching sisters:", error);
    }
  };

  const fetchMission = async () => {
    try {
      setLoading(true);
      const response = await missionService.getById(id);
      if (response.success && response.data) {
        const mission = response.data;
        setValues({
          sister_id: mission.sister_id || "",
          field: mission.field || "",
          specific_role: mission.specific_role || "",
          start_date: mission.start_date ? mission.start_date.split("T")[0] : "",
          end_date: mission.end_date ? mission.end_date.split("T")[0] : "",
          notes: mission.notes || "",
        });
      } else {
        toast.error("Không tìm thấy sứ vụ");
        navigate("/su-vu");
      }
    } catch (error) {
      console.error("Error fetching mission:", error);
      toast.error("Lỗi khi tải thông tin sứ vụ");
      navigate("/su-vu");
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!values.sister_id && !sisterId) newErrors.sister_id = "Nữ tu là bắt buộc";
    if (!values.field) newErrors.field = "Lĩnh vực sứ vụ là bắt buộc";
    if (!values.start_date) newErrors.start_date = "Ngày bắt đầu là bắt buộc";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      Object.values(validationErrors).forEach((err) => toast.error(err));
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        ...values,
        sister_id: sisterId || values.sister_id,
      };

      let result;
      if (isEditMode) {
        result = await missionService.update(id, payload);
      } else {
        result = await missionService.create(payload);
      }

      if (result.success) {
        toast.success(isEditMode ? "Cập nhật sứ vụ thành công!" : "Thêm sứ vụ thành công!");
        if (sisterId) {
          navigate(`/nu-tu/${sisterId}/su-vu`);
        } else {
          navigate("/su-vu");
        }
      } else {
        toast.error(result.error || "Đã xảy ra lỗi");
      }
    } catch (error) {
      console.error("Error saving mission:", error);
      toast.error("Đã xảy ra lỗi khi lưu sứ vụ");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (sisterId) {
      navigate(`/nu-tu/${sisterId}/su-vu`);
    } else {
      navigate("/su-vu");
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <Container fluid className="py-4">
      <Breadcrumb
        title={isEditMode ? "Chỉnh sửa Sứ vụ" : "Thêm Sứ vụ Mới"}
        items={[
          { label: "Quản lý Sứ vụ", link: "/su-vu" },
          { label: isEditMode ? "Chỉnh sửa" : "Thêm mới" },
        ]}
      />

      <Row className="justify-content-center">
        <Col lg={8}>
          <Card>
            <Card.Header className="bg-white">
              <h5 className="mb-0">
                <i className="fas fa-briefcase me-2"></i>
                {isEditMode ? "Chỉnh sửa Sứ vụ" : "Thêm Sứ vụ Mới"}
              </h5>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Row className="g-3">
                  {/* Sister selector - only show if sisterId not provided */}
                  {!sisterId && (
                    <Col md={12}>
                      <Select
                        label="Nữ tu"
                        name="sister_id"
                        value={values.sister_id}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.sister_id}
                        touched={touched.sister_id}
                        required
                      >
                        <option value="">-- Chọn nữ tu --</option>
                        {sisters.map((sister) => (
                          <option key={sister.id} value={sister.id}>
                            {sister.saint_name || sister.religious_name || sister.birth_name}
                            {sister.code ? ` (${sister.code})` : ""}
                          </option>
                        ))}
                      </Select>
                    </Col>
                  )}

                  <Col md={6}>
                    <Select
                      label="Lĩnh vực sứ vụ"
                      name="field"
                      value={values.field}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={errors.field}
                      touched={touched.field}
                      required
                    >
                      <option value="">-- Chọn lĩnh vực --</option>
                      <option value="education">Giáo dục</option>
                      <option value="pastoral">Mục vụ</option>
                      <option value="publishing">Xuất bản</option>
                      <option value="media">Truyền thông</option>
                      <option value="healthcare">Y tế</option>
                      <option value="social">Xã hội</option>
                    </Select>
                  </Col>

                  <Col md={6}>
                    <Input
                      label="Vai trò cụ thể"
                      name="specific_role"
                      value={values.specific_role}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="VD: Giáo viên, Y tá, Quản lý..."
                    />
                  </Col>

                  <Col md={6}>
                    <DatePicker
                      label="Ngày bắt đầu"
                      name="start_date"
                      value={values.start_date}
                      onChange={(date) => setFieldValue("start_date", date)}
                      onBlur={handleBlur}
                      error={errors.start_date}
                      touched={touched.start_date}
                      required
                    />
                  </Col>

                  <Col md={6}>
                    <DatePicker
                      label="Ngày kết thúc"
                      name="end_date"
                      value={values.end_date}
                      onChange={(date) => setFieldValue("end_date", date)}
                      onBlur={handleBlur}
                      hint="Để trống nếu đang làm"
                    />
                  </Col>

                  <Col md={12}>
                    <TextArea
                      label="Ghi chú"
                      name="notes"
                      value={values.notes}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      rows={3}
                      placeholder="Ghi chú thêm về sứ vụ..."
                    />
                  </Col>
                </Row>

                <div className="d-flex justify-content-end gap-2 mt-4">
                  <Button variant="secondary" onClick={handleCancel} disabled={submitting}>
                    <i className="fas fa-times me-2"></i>
                    Hủy
                  </Button>
                  <Button type="submit" variant="primary" disabled={submitting}>
                    {submitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Đang lưu...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-save me-2"></i>
                        {isEditMode ? "Cập nhật" : "Thêm mới"}
                      </>
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default MissionFormPage;
