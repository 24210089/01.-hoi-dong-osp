// src/features/nu-tu/pages/SisterDetailPage.jsx

import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Nav,
  Tab,
  Badge,
} from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { sisterService } from "@services";
import { formatDate, calculateAge } from "@utils";
import { JOURNEY_STAGE_LABELS, SISTER_STATUS_LABELS } from "@utils/constants";
import LoadingSpinner from "@components/common/Loading/LoadingSpinner";
import Breadcrumb from "@components/common/Breadcrumb";

const SisterDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [sister, setSister] = useState(null);

  useEffect(() => {
    fetchSisterDetail();
  }, [id]);

  const fetchSisterDetail = async () => {
    try {
      setLoading(true);
      const response = await sisterService.getById(id);
      if (response.success) {
        setSister(response.data);
      }
    } catch (error) {
      console.error("Error fetching sister detail:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    navigate(`/nu-tu/${id}/edit`);
  };

  const handleDelete = async () => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa ${sister.full_name}?`)) {
      try {
        await sisterService.delete(id);
        navigate("/nu-tu");
      } catch (error) {
        console.error("Error deleting sister:", error);
      }
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

  if (!sister) {
    return (
      <Container className="py-4">
        <div className="text-center">
          <h3>Không tìm thấy thông tin nữ tu</h3>
          <Button variant="primary" onClick={() => navigate("/nu-tu")}>
            Quay lại danh sách
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: "Trang chủ", link: "/dashboard" },
          { label: "Quản lý Nữ Tu", link: "/nu-tu" },
          { label: sister.full_name },
        ]}
      />

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Thông tin Nữ Tu</h2>
          <p className="text-muted mb-0">Chi tiết thông tin nữ tu</p>
        </div>
        <div className="d-flex gap-2">
          <Button variant="success" onClick={handleEdit}>
            <i className="fas fa-edit me-2"></i>
            Chỉnh sửa
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            <i className="fas fa-trash me-2"></i>
            Xóa
          </Button>
          <Button variant="secondary" onClick={() => navigate("/nu-tu")}>
            <i className="fas fa-arrow-left me-2"></i>
            Quay lại
          </Button>
        </div>
      </div>

      <Row className="g-4">
        {/* Left Column - Profile */}
        <Col lg={4}>
          <Card className="sister-profile-card">
            <Card.Body className="text-center">
              {/* Avatar */}
              <div className="sister-avatar-large mb-3">
                {sister.avatar_url ? (
                  <img src={sister.avatar_url} alt={sister.full_name} />
                ) : (
                  <div className="avatar-placeholder-large">
                    <i className="fas fa-user"></i>
                  </div>
                )}
              </div>

              {/* Name */}
              <h3 className="mb-2">
                {sister.religious_name && (
                  <div className="text-primary">{sister.religious_name}</div>
                )}
                {sister.full_name}
              </h3>

              {/* Code */}
              <p className="text-muted mb-3">
                <i className="fas fa-id-card me-2"></i>
                {sister.sister_code}
              </p>

              {/* Badges */}
              <div className="mb-3">
                <Badge bg="primary" className="me-2 mb-2">
                  {JOURNEY_STAGE_LABELS[sister.current_stage]}
                </Badge>
                <Badge bg={getStatusColor(sister.status)} className="mb-2">
                  {SISTER_STATUS_LABELS[sister.status]}
                </Badge>
              </div>

              {/* Quick Info */}
              <div className="quick-info">
                <div className="quick-info-item">
                  <i className="fas fa-birthday-cake text-primary"></i>
                  <div>
                    <small className="text-muted">Ngày sinh</small>
                    <div className="fw-semibold">
                      {formatDate(sister.birth_date)}
                    </div>
                    <small className="text-muted">
                      ({calculateAge(sister.birth_date)} tuổi)
                    </small>
                  </div>
                </div>

                <div className="quick-info-item">
                  <i className="fas fa-home text-success"></i>
                  <div>
                    <small className="text-muted">Cộng đoàn</small>
                    <div className="fw-semibold">
                      {sister.community_name || "-"}
                    </div>
                  </div>
                </div>

                <div className="quick-info-item">
                  <i className="fas fa-phone text-info"></i>
                  <div>
                    <small className="text-muted">Điện thoại</small>
                    <div className="fw-semibold">{sister.phone || "-"}</div>
                  </div>
                </div>

                <div className="quick-info-item">
                  <i className="fas fa-envelope text-warning"></i>
                  <div>
                    <small className="text-muted">Email</small>
                    <div className="fw-semibold">{sister.email || "-"}</div>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Right Column - Details */}
        <Col lg={8}>
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
                    <Nav.Link eventKey="journey">
                      <i className="fas fa-route me-2"></i>
                      Hành trình
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="education">
                      <i className="fas fa-graduation-cap me-2"></i>
                      Học vấn
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="mission">
                      <i className="fas fa-briefcase me-2"></i>
                      Sứ vụ
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="health">
                      <i className="fas fa-heartbeat me-2"></i>
                      Sức khỏe
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </Card.Header>

              <Card.Body>
                <Tab.Content>
                  {/* Basic Info Tab */}
                  <Tab.Pane eventKey="basic">
                    <h5 className="mb-3">Thông tin cơ bản</h5>
                    <Row className="g-3">
                      <Col md={6}>
                        <InfoItem label="Họ và tên" value={sister.full_name} />
                      </Col>
                      <Col md={6}>
                        <InfoItem
                          label="Tên thánh"
                          value={sister.religious_name}
                        />
                      </Col>
                      <Col md={6}>
                        <InfoItem label="Mã số" value={sister.sister_code} />
                      </Col>
                      <Col md={6}>
                        <InfoItem
                          label="Ngày sinh"
                          value={formatDate(sister.birth_date)}
                        />
                      </Col>
                      <Col md={6}>
                        <InfoItem label="Nơi sinh" value={sister.birth_place} />
                      </Col>
                      <Col md={6}>
                        <InfoItem
                          label="Quốc tịch"
                          value={sister.nationality}
                        />
                      </Col>
                      <Col md={6}>
                        <InfoItem label="CMND/CCCD" value={sister.id_card} />
                      </Col>
                      <Col md={6}>
                        <InfoItem
                          label="Ngày cấp"
                          value={formatDate(sister.id_card_date)}
                        />
                      </Col>
                      <Col md={12}>
                        <InfoItem
                          label="Nơi cấp"
                          value={sister.id_card_place}
                        />
                      </Col>
                      <Col md={6}>
                        <InfoItem label="Điện thoại" value={sister.phone} />
                      </Col>
                      <Col md={6}>
                        <InfoItem label="Email" value={sister.email} />
                      </Col>
                      <Col md={12}>
                        <InfoItem
                          label="Địa chỉ thường trú"
                          value={sister.permanent_address}
                        />
                      </Col>
                      <Col md={12}>
                        <InfoItem
                          label="Địa chỉ hiện tại"
                          value={sister.current_address}
                        />
                      </Col>
                    </Row>

                    <h5 className="mt-4 mb-3">Thông tin gia đình</h5>
                    <Row className="g-3">
                      <Col md={6}>
                        <InfoItem label="Tên cha" value={sister.father_name} />
                      </Col>
                      <Col md={6}>
                        <InfoItem
                          label="Nghề nghiệp cha"
                          value={sister.father_occupation}
                        />
                      </Col>
                      <Col md={6}>
                        <InfoItem label="Tên mẹ" value={sister.mother_name} />
                      </Col>
                      <Col md={6}>
                        <InfoItem
                          label="Nghề nghiệp mẹ"
                          value={sister.mother_occupation}
                        />
                      </Col>
                      <Col md={12}>
                        <InfoItem
                          label="Số anh chị em"
                          value={sister.siblings_count}
                        />
                      </Col>
                      <Col md={12}>
                        <InfoItem
                          label="Địa chỉ gia đình"
                          value={sister.family_address}
                        />
                      </Col>
                    </Row>
                  </Tab.Pane>

                  {/* Journey Tab */}
                  <Tab.Pane eventKey="journey">
                    <h5 className="mb-3">Hành trình Ơn Gọi</h5>
                    <div className="timeline">
                      {sister.journeys && sister.journeys.length > 0 ? (
                        sister.journeys.map((journey, index) => (
                          <div key={index} className="timeline-item">
                            <div className="timeline-marker"></div>
                            <div className="timeline-content">
                              <div className="d-flex justify-content-between align-items-start mb-2">
                                <div>
                                  <h6 className="mb-1">
                                    {JOURNEY_STAGE_LABELS[journey.stage]}
                                  </h6>
                                  <small className="text-muted">
                                    {formatDate(journey.start_date)}
                                    {journey.end_date &&
                                      ` - ${formatDate(journey.end_date)}`}
                                  </small>
                                </div>
                                <Badge bg="primary">{journey.location}</Badge>
                              </div>
                              {journey.notes && (
                                <p className="mb-0 text-muted">
                                  {journey.notes}
                                </p>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-muted">
                          Chưa có thông tin hành trình
                        </p>
                      )}
                    </div>
                  </Tab.Pane>

                  {/* Education Tab */}
                  <Tab.Pane eventKey="education">
                    <h5 className="mb-3">Học vấn</h5>
                    {sister.educations && sister.educations.length > 0 ? (
                      <div className="education-list">
                        {sister.educations.map((edu, index) => (
                          <Card key={index} className="mb-3">
                            <Card.Body>
                              <div className="d-flex justify-content-between align-items-start">
                                <div>
                                  <h6 className="mb-1">{edu.degree}</h6>
                                  <p className="mb-1">{edu.institution}</p>
                                  <small className="text-muted">
                                    {edu.major && `Chuyên ngành: ${edu.major}`}
                                  </small>
                                </div>
                                <Badge bg="info">
                                  {edu.graduation_year || "Đang học"}
                                </Badge>
                              </div>
                            </Card.Body>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted">Chưa có thông tin học vấn</p>
                    )}
                  </Tab.Pane>

                  {/* Mission Tab */}
                  <Tab.Pane eventKey="mission">
                    <h5 className="mb-3">Sứ vụ</h5>
                    {sister.missions && sister.missions.length > 0 ? (
                      <div className="mission-list">
                        {sister.missions.map((mission, index) => (
                          <Card key={index} className="mb-3">
                            <Card.Body>
                              <div className="d-flex justify-content-between align-items-start mb-2">
                                <div>
                                  <h6 className="mb-1">{mission.position}</h6>
                                  <p className="mb-1">{mission.organization}</p>
                                  <small className="text-muted">
                                    {formatDate(mission.start_date)}
                                    {mission.end_date
                                      ? ` - ${formatDate(mission.end_date)}`
                                      : " - Hiện tại"}
                                  </small>
                                </div>
                                <Badge bg="success">{mission.type}</Badge>
                              </div>
                              {mission.description && (
                                <p className="mb-0 text-muted">
                                  {mission.description}
                                </p>
                              )}
                            </Card.Body>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted">Chưa có thông tin sứ vụ</p>
                    )}
                  </Tab.Pane>

                  {/* Health Tab */}
                  <Tab.Pane eventKey="health">
                    <h5 className="mb-3">Sức khỏe</h5>
                    {sister.health_records &&
                    sister.health_records.length > 0 ? (
                      <div className="health-list">
                        {sister.health_records.map((record, index) => (
                          <Card key={index} className="mb-3">
                            <Card.Body>
                              <div className="d-flex justify-content-between align-items-start mb-2">
                                <div>
                                  <h6 className="mb-1">
                                    Khám ngày {formatDate(record.check_date)}
                                  </h6>
                                  <p className="mb-1">
                                    <strong>Cơ sở y tế:</strong>{" "}
                                    {record.facility}
                                  </p>
                                  <p className="mb-1">
                                    <strong>Bác sĩ:</strong> {record.doctor}
                                  </p>
                                </div>
                                <Badge
                                  bg={getHealthStatusColor(
                                    record.health_status
                                  )}
                                >
                                  {record.health_status}
                                </Badge>
                              </div>
                              {record.diagnosis && (
                                <div className="mb-2">
                                  <strong>Chẩn đoán:</strong> {record.diagnosis}
                                </div>
                              )}
                              {record.treatment && (
                                <div className="mb-2">
                                  <strong>Điều trị:</strong> {record.treatment}
                                </div>
                              )}
                              {record.notes && (
                                <div className="text-muted">
                                  <strong>Ghi chú:</strong> {record.notes}
                                </div>
                              )}
                            </Card.Body>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted">Chưa có hồ sơ sức khỏe</p>
                    )}
                  </Tab.Pane>
                </Tab.Content>
              </Card.Body>
            </Card>
          </Tab.Container>
        </Col>
      </Row>
    </Container>
  );
};

// Helper Component
const InfoItem = ({ label, value }) => (
  <div className="info-item">
    <small className="text-muted d-block mb-1">{label}</small>
    <div className="fw-semibold">{value || "-"}</div>
  </div>
);

// Helper Functions
const getStatusColor = (status) => {
  const colors = {
    active: "success",
    inactive: "warning",
    leave: "secondary",
    deceased: "dark",
  };
  return colors[status] || "secondary";
};

const getHealthStatusColor = (status) => {
  const colors = {
    excellent: "success",
    good: "info",
    fair: "warning",
    poor: "danger",
  };
  return colors[status] || "secondary";
};

export default SisterDetailPage;
