// src/features/bao-cao/pages/ReportGeneratePage.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Card,
  Row,
  Col,
  Form,
  Button,
  Alert,
} from "react-bootstrap";
import { toast } from "react-toastify";
import { reportService } from "@services";
import Breadcrumb from "@components/common/Breadcrumb";

const ReportGeneratePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    report_type: "",
    title: "",
    date_from: "",
    date_to: "",
    format: "excel",
    include_charts: true,
    include_summary: true,
  });

  const reportTypes = [
    { value: "sister", label: "Báo cáo Nữ tu" },
    { value: "journey", label: "Báo cáo Hành trình ơn gọi" },
    { value: "health", label: "Báo cáo Sức khỏe" },
    { value: "evaluation", label: "Báo cáo Đánh giá" },
    { value: "community", label: "Báo cáo Cộng đoàn" },
    { value: "mission", label: "Báo cáo Sứ vụ" },
    { value: "education", label: "Báo cáo Học vấn" },
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.report_type) {
      toast.error("Vui lòng chọn loại báo cáo");
      return;
    }

    try {
      setLoading(true);
      const response = await reportService.getCustomReport(formData);
      if (response.success) {
        toast.success("Tạo báo cáo thành công!");
        navigate("/bao-cao/list");
      } else {
        toast.error(response.error || "Có lỗi xảy ra");
      }
    } catch (error) {
      console.error("Error generating report:", error);
      toast.error("Có lỗi xảy ra khi tạo báo cáo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="py-4">
      {/* Breadcrumb */}
      <Breadcrumb
        title="Tạo báo cáo mới"
        items={[
          { label: "Báo cáo", link: "/bao-cao" },
          { label: "Tạo báo cáo mới" },
        ]}
      />

      <Row>
        <Col lg={8}>
          <Card>
            <Card.Header className="bg-white">
              <h5 className="mb-0">
                <i className="fas fa-cog me-2"></i>
                Cấu hình báo cáo
              </h5>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Row className="g-3">
                  {/* Report Type */}
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label>
                        Loại báo cáo <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Select
                        name="report_type"
                        value={formData.report_type}
                        onChange={handleChange}
                        required
                      >
                        <option value="">-- Chọn loại báo cáo --</option>
                        {reportTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  {/* Title */}
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label>Tiêu đề báo cáo</Form.Label>
                      <Form.Control
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Nhập tiêu đề báo cáo (tùy chọn)"
                      />
                    </Form.Group>
                  </Col>

                  {/* Date Range */}
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Từ ngày</Form.Label>
                      <Form.Control
                        type="date"
                        name="date_from"
                        value={formData.date_from}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Đến ngày</Form.Label>
                      <Form.Control
                        type="date"
                        name="date_to"
                        value={formData.date_to}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>

                  {/* Export Format */}
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label>Định dạng xuất</Form.Label>
                      <div className="d-flex gap-4">
                        <Form.Check
                          type="radio"
                          name="format"
                          value="excel"
                          label="Excel (.xlsx)"
                          checked={formData.format === "excel"}
                          onChange={handleChange}
                        />
                        <Form.Check
                          type="radio"
                          name="format"
                          value="pdf"
                          label="PDF (.pdf)"
                          checked={formData.format === "pdf"}
                          onChange={handleChange}
                        />
                      </div>
                    </Form.Group>
                  </Col>

                  {/* Options */}
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label>Tùy chọn</Form.Label>
                      <div className="d-flex gap-4">
                        <Form.Check
                          type="checkbox"
                          name="include_charts"
                          label="Bao gồm biểu đồ"
                          checked={formData.include_charts}
                          onChange={handleChange}
                        />
                        <Form.Check
                          type="checkbox"
                          name="include_summary"
                          label="Bao gồm tóm tắt"
                          checked={formData.include_summary}
                          onChange={handleChange}
                        />
                      </div>
                    </Form.Group>
                  </Col>
                </Row>

                {/* Actions */}
                <div className="d-flex gap-2 mt-4">
                  <Button type="submit" variant="primary" disabled={loading}>
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Đang tạo...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-file-export me-2"></i>
                        Tạo báo cáo
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline-secondary"
                    onClick={() => navigate("/bao-cao")}
                  >
                    Hủy
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="bg-light border-0">
            <Card.Body>
              <h5 className="mb-3">
                <i className="fas fa-info-circle me-2 text-primary"></i>
                Hướng dẫn
              </h5>
              <ul className="mb-0">
                <li className="mb-2">
                  <strong>Loại báo cáo:</strong> Chọn loại báo cáo phù hợp với
                  nhu cầu
                </li>
                <li className="mb-2">
                  <strong>Khoảng thời gian:</strong> Giới hạn dữ liệu theo thời
                  gian
                </li>
                <li className="mb-2">
                  <strong>Định dạng:</strong> Excel phù hợp để phân tích, PDF để
                  in ấn
                </li>
                <li>
                  <strong>Tùy chọn:</strong> Thêm biểu đồ và tóm tắt để báo cáo
                  trực quan hơn
                </li>
              </ul>
            </Card.Body>
          </Card>

          <Alert variant="info" className="mt-3">
            <i className="fas fa-lightbulb me-2"></i>
            <strong>Mẹo:</strong> Bạn có thể truy cập nhanh các báo cáo thường
            dùng từ menu sidebar.
          </Alert>
        </Col>
      </Row>
    </Container>
  );
};

export default ReportGeneratePage;
