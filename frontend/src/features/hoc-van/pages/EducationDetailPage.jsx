// src/features/hoc-van/pages/EducationDetailPage.jsx

import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  ListGroup,
  Alert,
} from "react-bootstrap";
import { Link, useLocation, useParams } from "react-router-dom";
import {
  FaGraduationCap,
  FaArrowLeft,
  FaEdit,
  FaUniversity,
  FaBook,
  FaCalendarAlt,
  FaUser,
  FaPaperclip,
} from "react-icons/fa";
import { educationService } from "@services";
import Breadcrumb from "@components/common/Breadcrumb";
import LoadingSpinner from "@components/common/Loading/LoadingSpinner";
import "./EducationDetailPage.css";

const levelLabels = {
  secondary: "Trung học",
  bachelor: "Đại học",
  master: "Thạc sĩ",
  doctorate: "Tiến sĩ",
};

const statusMap = {
  dang_hoc: { label: "Đang học", variant: "primary" },
  da_tot_nghiep: { label: "Đã tốt nghiệp", variant: "success" },
  tam_nghi: { label: "Tạm nghỉ", variant: "warning" },
  da_nghi: { label: "Đã nghỉ", variant: "secondary" },
};

const formatDateDisplay = (value) => {
  if (!value) return "Chưa cập nhật";
  try {
    return new Date(value).toLocaleDateString("vi-VN");
  } catch (error) {
    return value;
  }
};

const parseDocumentsValue = (docs) => {
  if (!docs) return [];
  if (Array.isArray(docs)) return docs;
  if (typeof docs === "string") {
    try {
      const parsed = JSON.parse(docs);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  }
  return [];
};

const EducationDetailPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const preloadedEducation = location.state?.education || null;
  const [education, setEducation] = useState(preloadedEducation);
  const [loading, setLoading] = useState(!preloadedEducation);
  const [error, setError] = useState("");

  useEffect(() => {
    // Nếu đã có preloaded data, không cần fetch lại
    if (preloadedEducation && String(preloadedEducation.id) === String(id)) {
      setEducation(preloadedEducation);
      setLoading(false);
      setError("");
      return;
    }

    // Chỉ fetch khi không có preloaded data hoặc id khác
    const fetchEducation = async () => {
      try {
        setLoading(true);
        const response = await educationService.getById(id);
        if (response.success && response.data) {
          setEducation(response.data);
          setError("");
        } else {
          setError(response.error || "Không thể tải thông tin học vấn");
        }
      } catch (fetchError) {
        console.error("Error fetching education detail:", fetchError);
        setError("Không thể tải thông tin học vấn");
      } finally {
        setLoading(false);
      }
    };

    fetchEducation();
  }, [id, preloadedEducation]);

  if (loading && !education) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "60vh" }}
      >
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error || !education) {
    return (
      <Container fluid className="py-4">
        <Breadcrumb
          title="Chi tiết Học vấn"
          items={[
            { label: "Học vấn", link: "/hoc-van" },
            { label: "Chi tiết" },
          ]}
        />
        <Alert variant="danger" className="mt-4">
          {error || "Không tìm thấy dữ liệu học vấn"}
        </Alert>
        <Link to="/hoc-van" className="btn btn-outline-secondary mt-3">
          <FaArrowLeft className="me-2" />
          Quay lại danh sách
        </Link>
      </Container>
    );
  }

  const statusInfo = statusMap[education.status] || {
    label: education.status || "Không rõ",
    variant: "secondary",
  };
  const documents = parseDocumentsValue(education.documents);

  return (
    <Container fluid className="py-4">
      <Breadcrumb
        title="Chi tiết Học vấn"
        items={[{ label: "Học vấn", link: "/hoc-van" }, { label: "Chi tiết" }]}
      />

      <div className="d-flex justify-content-between align-items-center mb-4">
        <Link to="/hoc-van" className="btn btn-outline-secondary">
          <FaArrowLeft className="me-2" />
          Quay lại danh sách
        </Link>
        <div className="d-flex gap-2">
          {education.sister_id && (
            <Link
              to={`/nu-tu/${education.sister_id}`}
              className="btn btn-outline-info"
            >
              <FaUser className="me-2" />
              Hồ sơ Nữ tu
            </Link>
          )}
          <Link
            to={`/hoc-van/${education.id}/edit`}
            className="btn btn-primary"
          >
            <FaEdit className="me-2" />
            Chỉnh sửa
          </Link>
        </div>
      </div>

      <Row className="g-4">
        <Col lg={8}>
          <Card className="mb-4 education-detail-card">
            <Card.Header className="d-flex align-items-center gap-2">
              <FaGraduationCap />
              <span>Thông tin chung</span>
              <Badge bg={statusInfo.variant} className="ms-auto">
                {statusInfo.label}
              </Badge>
            </Card.Header>
            <Card.Body>
              <Row className="mb-3">
                <Col md={6}>
                  <div className="text-muted">Nữ tu</div>
                  <div className="fw-semibold">
                    {education.religious_name ||
                      education.sister_name ||
                      "Không rõ"}
                    {education.sister_code && (
                      <span className="text-muted ms-2">
                        ({education.sister_code})
                      </span>
                    )}
                  </div>
                </Col>
                <Col md={6} className="text-md-end mt-3 mt-md-0">
                  <div className="text-muted">Trình độ</div>
                  <Badge bg="dark">
                    {levelLabels[education.level] || education.level || "Khác"}
                  </Badge>
                </Col>
              </Row>

              <Row className="g-3">
                <Col md={6}>
                  <div className="text-muted">Trường / Cơ sở đào tạo</div>
                  <div className="fw-semibold">
                    <FaUniversity className="me-2 text-primary" />
                    {education.institution || "Chưa cập nhật"}
                  </div>
                </Col>
                <Col md={6}>
                  <div className="text-muted">Ngành học</div>
                  <div className="fw-semibold">
                    <FaBook className="me-2 text-success" />
                    {education.major || "Chưa cập nhật"}
                  </div>
                </Col>
              </Row>

              <Row className="g-3 mt-1">
                <Col md={4}>
                  <div className="text-muted">Ngày bắt đầu</div>
                  <div className="fw-semibold">
                    <FaCalendarAlt className="me-2 text-info" />
                    {formatDateDisplay(education.start_date)}
                  </div>
                </Col>
                <Col md={4}>
                  <div className="text-muted">Ngày kết thúc</div>
                  <div className="fw-semibold">
                    <FaCalendarAlt className="me-2 text-info" />
                    {formatDateDisplay(education.end_date)}
                  </div>
                </Col>
                <Col md={4}>
                  <div className="text-muted">Năm tốt nghiệp</div>
                  <div className="fw-semibold">
                    {education.graduation_year || "Chưa cập nhật"}
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Card className="education-detail-card">
            <Card.Header>Chi tiết học tập</Card.Header>
            <Card.Body>
              <Row className="g-3">
                <Col md={4}>
                  <div className="text-muted">GPA</div>
                  <div className="fw-semibold">
                    {education.gpa || "Chưa cập nhật"}
                  </div>
                </Col>
                <Col md={8}>
                  <div className="text-muted">Tên luận văn / Đề tài</div>
                  <div className="fw-semibold">
                    {education.thesis_title || "Chưa cập nhật"}
                  </div>
                </Col>
              </Row>

              <div className="mt-3">
                <div className="text-muted mb-1">Ghi chú</div>
                <Card className="bg-light">
                  <Card.Body>
                    {education.notes ? education.notes : "Không có ghi chú"}
                  </Card.Body>
                </Card>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="mb-4 education-detail-card">
            <Card.Header>
              <FaPaperclip className="me-2" />
              Tài liệu đính kèm
            </Card.Header>
            <Card.Body>
              {documents.length > 0 ? (
                <ListGroup variant="flush">
                  {documents.map((doc) => (
                    <ListGroup.Item
                      key={doc.id || doc.url || doc.name}
                      className="d-flex justify-content-between align-items-center"
                    >
                      <div>
                        <div className="fw-semibold">
                          {doc.name || "Tài liệu"}
                        </div>
                        {doc.size && (
                          <small className="text-muted">
                            {(doc.size / (1024 * 1024)).toFixed(2)} MB
                          </small>
                        )}
                      </div>
                      {doc.url && (
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => window.open(doc.url, "_blank")}
                        >
                          Xem
                        </Button>
                      )}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <p className="text-muted mb-0">Chưa có tài liệu đính kèm</p>
              )}
            </Card.Body>
          </Card>

          <Card className="education-detail-card">
            <Card.Header>Hành động</Card.Header>
            <Card.Body>
              <div className="d-grid gap-2">
                <Link
                  to={`/hoc-van/${education.id}/edit`}
                  className="btn btn-primary"
                >
                  <FaEdit className="me-2" />
                  Chỉnh sửa học vấn
                </Link>
                <Link to="/hoc-van" className="btn btn-outline-secondary">
                  <FaArrowLeft className="me-2" />
                  Quay lại danh sách
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default EducationDetailPage;
