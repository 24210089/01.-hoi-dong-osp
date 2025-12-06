import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Badge } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { healthService } from "@services";
import { resolveMediaUrl } from "@/utils/media";
import LoadingSpinner from "@components/common/Loading/LoadingSpinner";
import Breadcrumb from "@components/common/Breadcrumb";
import "./HealthRecordDetailPage.css";

const HealthRecordDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [healthRecord, setHealthRecord] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchHealthRecord();
  }, [id]);

  const fetchHealthRecord = async () => {
    try {
      setLoading(true);
      const response = await healthService.getById(id);
      if (response.success) {
        setHealthRecord(response.data);
      } else {
        setError("Không tìm thấy hồ sơ sức khỏe");
      }
    } catch (error) {
      console.error("Error fetching health record:", error);
      setError("Có lỗi xảy ra khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Chưa có";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  const getHealthStatusBadge = (status) => {
    const statusMap = {
      good: { label: "Tốt", variant: "status-good", icon: "fa-smile" },
      excellent: {
        label: "Rất tốt",
        variant: "status-good",
        icon: "fa-laugh-beam",
      },
      average: {
        label: "Trung bình",
        variant: "status-average",
        icon: "fa-meh",
      },
      normal: {
        label: "Bình thường",
        variant: "status-average",
        icon: "fa-meh",
      },
      weak: { label: "Yếu", variant: "status-weak", icon: "fa-frown" },
      poor: { label: "Kém", variant: "status-weak", icon: "fa-sad-tear" },
      critical: {
        label: "Nghiêm trọng",
        variant: "status-critical",
        icon: "fa-exclamation-triangle",
      },
    };
    // Normalize status to lowercase
    const normalizedStatus = status?.toLowerCase?.() || status;
    const statusInfo = statusMap[normalizedStatus] || {
      label: status || "Chưa xác định",
      variant: "status-average",
      icon: "fa-question",
    };
    return (
      <span className={`health-status-badge ${statusInfo.variant}`}>
        <i className={`fas ${statusInfo.icon}`}></i>
        {statusInfo.label}
      </span>
    );
  };

  const getSisterDisplayName = () => {
    if (!healthRecord) return "";
    const saintName = healthRecord.sister_saint_name || healthRecord.saint_name;
    const birthName = healthRecord.sister_birth_name || healthRecord.birth_name;

    if (saintName && birthName) {
      return `${saintName} ${birthName}`;
    } else if (saintName) {
      return saintName;
    } else if (birthName) {
      return birthName;
    }
    return `Nữ tu #${healthRecord.sister_id}`;
  };

  const handleEdit = () => {
    navigate(`/suc-khoe/${id}/edit`);
  };

  const handleBack = () => {
    navigate("/suc-khoe");
  };

  const handleDelete = async () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa hồ sơ sức khỏe này?")) {
      try {
        await healthService.delete(id);
        toast.success("Đã xóa hồ sơ sức khỏe thành công!");
        setTimeout(() => {
          navigate("/suc-khoe");
        }, 1500);
      } catch (error) {
        console.error("Error deleting health record:", error);
        toast.error(
          "Lỗi khi xóa hồ sơ sức khỏe: " + (error.message || "Vui lòng thử lại")
        );
      }
    }
  };

  // Parse documents
  const getDocuments = () => {
    if (!healthRecord?.documents) return [];
    try {
      return typeof healthRecord.documents === "string"
        ? JSON.parse(healthRecord.documents)
        : healthRecord.documents;
    } catch {
      return [];
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

  if (error || !healthRecord) {
    return (
      <Container fluid className="py-4">
        <Card>
          <Card.Body className="text-center py-5">
            <i
              className="fas fa-exclamation-circle text-danger mb-3"
              style={{ fontSize: "3rem" }}
            ></i>
            <h5>{error || "Không tìm thấy hồ sơ"}</h5>
            <Button variant="primary" onClick={handleBack} className="mt-3">
              <i className="fas fa-arrow-left me-2"></i>
              Quay lại danh sách
            </Button>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  const documents = getDocuments();

  return (
    <div className="health-detail-page">
      <Container
        fluid
        className="py-4"
        style={{ fontFamily: "'Roboto', sans-serif" }}
      >
        <Breadcrumb
          title="Chi tiết Hồ sơ Sức khỏe"
          items={[
            { label: "Hồ sơ Sức khỏe", link: "/suc-khoe" },
            { label: "Chi tiết" },
          ]}
        />

        {/* Action Buttons */}
        <div className="health-action-buttons">
          <Button className="btn-back" onClick={handleBack}>
            <i className="fas fa-arrow-left me-2"></i>
            Quay lại
          </Button>
          <div>
            <Button className="btn-edit me-2" onClick={handleEdit}>
              <i className="fas fa-edit me-2"></i>
              Chỉnh sửa
            </Button>
            <Button className="btn-delete" onClick={handleDelete}>
              <i className="fas fa-trash me-2"></i>
              Xóa
            </Button>
          </div>
        </div>

        <Row className="g-4">
          {/* Main Info Card */}
          <Col lg={8}>
            <Card className="health-info-card">
              <Card.Header>
                <i className="fas fa-info-circle"></i>
                <span>Thông tin khám bệnh</span>
              </Card.Header>
              <Card.Body>
                <Row className="g-3">
                  {/* Sister Name */}
                  <Col md={6}>
                    <div className="health-detail-item">
                      <div className="label">Nữ tu</div>
                      <div className="value">
                        <i className="fas fa-user me-2 text-primary"></i>
                        {getSisterDisplayName()}
                      </div>
                    </div>
                  </Col>
                  {/* Health Status */}
                  <Col md={6}>
                    <div className="health-detail-item">
                      <div className="label">Tình trạng sức khỏe</div>
                      <div className="value">
                        {getHealthStatusBadge(healthRecord.general_health)}
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="health-detail-item">
                      <div className="label">Ngày khám</div>
                      <div className="value">
                        <i className="fas fa-calendar-alt me-2 text-primary"></i>
                        {formatDate(healthRecord.checkup_date)}
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="health-detail-item">
                      <div className="label">Nơi khám</div>
                      <div className="value">
                        <i className="fas fa-hospital me-2 text-info"></i>
                        {healthRecord.checkup_place || "Chưa có"}
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="health-detail-item">
                      <div className="label">Bác sĩ khám</div>
                      <div className="value">
                        <i className="fas fa-user-md me-2 text-success"></i>
                        {healthRecord.doctor || "Chưa có"}
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="health-detail-item">
                      <div className="label">Ngày khám tiếp theo</div>
                      <div className="value">
                        <i className="fas fa-calendar-check me-2 text-warning"></i>
                        {formatDate(healthRecord.next_checkup_date)}
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Health Metrics */}
            <Card className="health-info-card">
              <Card.Header className="metrics-header">
                <i className="fas fa-chart-line"></i>
                <span>Chỉ số sức khỏe</span>
              </Card.Header>
              <Card.Body>
                <Row className="g-3">
                  <Col xs={6} md={3}>
                    <div className="health-metric-card">
                      <div className="metric-icon blood-pressure">
                        <i className="fas fa-tint"></i>
                      </div>
                      <div className="metric-label">Huyết áp</div>
                      <div className="metric-value">
                        {healthRecord.blood_pressure || "N/A"}
                      </div>
                    </div>
                  </Col>
                  <Col xs={6} md={3}>
                    <div className="health-metric-card">
                      <div className="metric-icon heart-rate">
                        <i className="fas fa-heartbeat"></i>
                      </div>
                      <div className="metric-label">Nhịp tim</div>
                      <div className="metric-value">
                        {healthRecord.heart_rate
                          ? `${healthRecord.heart_rate} bpm`
                          : "N/A"}
                      </div>
                    </div>
                  </Col>
                  <Col xs={6} md={3}>
                    <div className="health-metric-card">
                      <div className="metric-icon weight">
                        <i className="fas fa-weight"></i>
                      </div>
                      <div className="metric-label">Cân nặng</div>
                      <div className="metric-value">
                        {healthRecord.weight
                          ? `${healthRecord.weight} kg`
                          : "N/A"}
                      </div>
                    </div>
                  </Col>
                  <Col xs={6} md={3}>
                    <div className="health-metric-card">
                      <div className="metric-icon height">
                        <i className="fas fa-ruler-vertical"></i>
                      </div>
                      <div className="metric-label">Chiều cao</div>
                      <div className="metric-value">
                        {healthRecord.height
                          ? `${healthRecord.height} cm`
                          : "N/A"}
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Diagnosis & Treatment */}
            <Card className="health-info-card">
              <Card.Header className="diagnosis-header">
                <i className="fas fa-stethoscope"></i>
                <span>Chẩn đoán & Điều trị</span>
              </Card.Header>
              <Card.Body>
                <Row className="g-3">
                  <Col md={6}>
                    <div className="health-detail-item">
                      <div className="label">Bệnh mãn tính</div>
                      <div className="value">
                        {healthRecord.chronic_diseases || "Không có"}
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="health-detail-item">
                      <div className="label">Hạn chế lao động</div>
                      <div className="value">
                        {healthRecord.work_limitations || "Không có"}
                      </div>
                    </div>
                  </Col>
                  <Col md={12}>
                    <div className="health-detail-item">
                      <div className="label">Chẩn đoán</div>
                      <div className="health-text-area">
                        {healthRecord.diagnosis || "Chưa có chẩn đoán"}
                      </div>
                    </div>
                  </Col>
                  <Col md={12}>
                    <div className="health-detail-item">
                      <div className="label">Phương pháp điều trị</div>
                      <div className="health-text-area">
                        {healthRecord.treatment ||
                          "Chưa có phương pháp điều trị"}
                      </div>
                    </div>
                  </Col>
                  <Col md={12}>
                    <div className="health-detail-item">
                      <div className="label">Ghi chú</div>
                      <div className="health-text-area">
                        {healthRecord.notes || "Không có ghi chú"}
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>

          {/* Sidebar */}
          <Col lg={4}>
            {/* Documents Card */}
            <Card className="health-info-card">
              <Card.Header className="documents-header">
                <i className="fas fa-file-medical"></i>
                <span>Tài liệu đính kèm</span>
              </Card.Header>
              <Card.Body>
                {documents.length > 0 ? (
                  <ul className="health-document-list">
                    {documents.map((doc, index) => (
                      <li key={index} className="health-document-item">
                        <i className="fas fa-file-alt"></i>
                        <a
                          href={resolveMediaUrl(doc.url)}
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                        >
                          {doc.name || `Tài liệu ${index + 1}`}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="health-empty-state">
                    <i className="fas fa-folder-open"></i>
                    <p>Không có tài liệu đính kèm</p>
                  </div>
                )}
              </Card.Body>
            </Card>

            {/* Timestamps Card */}
            <Card className="health-info-card">
              <Card.Header className="system-header">
                <i className="fas fa-clock"></i>
                <span>Thông tin hệ thống</span>
              </Card.Header>
              <Card.Body>
                <div className="health-system-info">
                  <div className="health-system-item">
                    <span className="label">Ngày tạo</span>
                    <span className="value">
                      {formatDate(healthRecord.created_at)}
                    </span>
                  </div>
                  <div className="health-system-item">
                    <span className="label">Cập nhật lần cuối</span>
                    <span className="value">
                      {formatDate(healthRecord.updated_at)}
                    </span>
                  </div>
                  <div className="health-system-item">
                    <span className="label">Mã hồ sơ</span>
                    <span className="value">#{healthRecord.id}</span>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default HealthRecordDetailPage;
