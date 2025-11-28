// src/features/danh-gia/components/EvaluationForm/EvaluationForm.jsx

import React from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";

const EvaluationForm = ({ show, onHide, evaluation, onSubmit }) => {
  const isEditMode = !!evaluation;

  const [values, setValues] = React.useState(
    evaluation || {
      type: "",
      period: "",
      evaluation_date: "",
      evaluator: "",
      spiritual_life: "",
      community_life: "",
      apostolic_work: "",
      personal_development: "",
      overall_rating: "",
      strengths: "",
      weaknesses: "",
      recommendations: "",
      notes: "",
    }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit(values);
  };

  return (
    <Modal show={show} onHide={onHide} size="xl" centered scrollable>
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="fas fa-clipboard-check me-2"></i>
          {isEditMode ? "Chỉnh sửa Đánh giá" : "Thêm Đánh giá Mới"}
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleFormSubmit}>
        <Modal.Body>
          <Row className="g-3">
            <Col md={12}>
              <h6 className="mb-3">
                <i className="fas fa-info-circle me-2"></i>
                Thông tin cơ bản
              </h6>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label>
                  Loại đánh giá <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  name="type"
                  value={values.type}
                  onChange={handleChange}
                  required
                >
                  <option value="">Chọn loại</option>
                  <option value="annual">Đánh giá năm</option>
                  <option value="semi_annual">Đánh giá 6 tháng</option>
                  <option value="quarterly">Đánh giá quý</option>
                  <option value="monthly">Đánh giá tháng</option>
                  <option value="special">Đánh giá đặc biệt</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label>
                  Kỳ đánh giá <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="period"
                  value={values.period}
                  onChange={handleChange}
                  placeholder="VD: Năm 2024, Quý 1/2024..."
                  required
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label>
                  Ngày đánh giá <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="date"
                  name="evaluation_date"
                  value={values.evaluation_date}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>

            <Col md={12}>
              <Form.Group>
                <Form.Label>Người đánh giá</Form.Label>
                <Form.Control
                  type="text"
                  name="evaluator"
                  value={values.evaluator}
                  onChange={handleChange}
                  placeholder="Tên người đánh giá"
                />
              </Form.Group>
            </Col>

            <Col md={12} className="mt-4">
              <h6 className="mb-3">
                <i className="fas fa-star me-2"></i>
                Điểm đánh giá (0-100)
              </h6>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label>Đời sống thiêng liêng</Form.Label>
                <Form.Control
                  type="number"
                  name="spiritual_life"
                  min="0"
                  max="100"
                  value={values.spiritual_life}
                  onChange={handleChange}
                  placeholder="0-100"
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label>Đời sống cộng đoàn</Form.Label>
                <Form.Control
                  type="number"
                  name="community_life"
                  min="0"
                  max="100"
                  value={values.community_life}
                  onChange={handleChange}
                  placeholder="0-100"
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label>Công tác tông đồ</Form.Label>
                <Form.Control
                  type="number"
                  name="apostolic_work"
                  min="0"
                  max="100"
                  value={values.apostolic_work}
                  onChange={handleChange}
                  placeholder="0-100"
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label>Phát triển cá nhân</Form.Label>
                <Form.Control
                  type="number"
                  name="personal_development"
                  min="0"
                  max="100"
                  value={values.personal_development}
                  onChange={handleChange}
                  placeholder="0-100"
                />
              </Form.Group>
            </Col>

            <Col md={12}>
              <Form.Group>
                <Form.Label>Tổng điểm</Form.Label>
                <Form.Control
                  type="number"
                  name="overall_rating"
                  min="0"
                  max="100"
                  value={values.overall_rating}
                  onChange={handleChange}
                  placeholder="0-100"
                />
              </Form.Group>
            </Col>

            <Col md={12} className="mt-4">
              <h6 className="mb-3">
                <i className="fas fa-comment-alt me-2"></i>
                Nhận xét
              </h6>
            </Col>

            <Col md={12}>
              <Form.Group>
                <Form.Label>Điểm mạnh</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="strengths"
                  value={values.strengths}
                  onChange={handleChange}
                  placeholder="Những điểm mạnh cần phát huy..."
                />
              </Form.Group>
            </Col>

            <Col md={12}>
              <Form.Group>
                <Form.Label>Điểm yếu</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="weaknesses"
                  value={values.weaknesses}
                  onChange={handleChange}
                  placeholder="Những điểm cần cải thiện..."
                />
              </Form.Group>
            </Col>

            <Col md={12}>
              <Form.Group>
                <Form.Label>Khuyến nghị</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="recommendations"
                  value={values.recommendations}
                  onChange={handleChange}
                  placeholder="Các khuyến nghị cho kỳ tiếp theo..."
                />
              </Form.Group>
            </Col>

            <Col md={12}>
              <Form.Group>
                <Form.Label>Ghi chú</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  name="notes"
                  value={values.notes}
                  onChange={handleChange}
                  placeholder="Ghi chú thêm..."
                />
              </Form.Group>
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

export default EvaluationForm;
