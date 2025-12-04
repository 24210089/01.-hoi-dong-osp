// src/features/su-vu/components/MissionForm/MissionForm.jsx

import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";
import { useForm } from "@hooks";
import { sisterService } from "@services";
import Input from "@components/forms/Input";
import Select from "@components/forms/Select";
import DatePicker from "@components/forms/DatePicker";
import TextArea from "@components/forms/TextArea";

const MissionForm = ({ show, onHide, mission, onSubmit, sisterId }) => {
  const isEditMode = !!mission;
  const [sisters, setSisters] = useState([]);

  useEffect(() => {
    if (show && !sisterId) {
      fetchSisters();
    }
  }, [show, sisterId]);

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

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    setFieldValue,
    handleSubmit,
  } = useForm(
    mission || {
      sister_id: sisterId || "",
      field: "",
      specific_role: "",
      start_date: "",
      end_date: "",
      notes: "",
    }
  );

  const validate = () => {
    const newErrors = {};

    if (!values.sister_id && !sisterId) newErrors.sister_id = "Nữ tu là bắt buộc";
    if (!values.field) newErrors.field = "Lĩnh vực sứ vụ là bắt buộc";
    if (!values.start_date) newErrors.start_date = "Ngày bắt đầu là bắt buộc";

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
          <i className="fas fa-briefcase me-2"></i>
          {isEditMode ? "Chỉnh sửa Sứ vụ" : "Thêm Sứ vụ Mới"}
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleFormSubmit}>
        <Modal.Body>
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
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            <i className="fas fa-times me-2"></i>
            Hủy
          </Button>
          <Button type="submit" variant="primary">
            <i className="fas fa-save me-2"></i>
            {isEditMode ? "Cập nhật" : "Thêm mới"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default MissionForm;
