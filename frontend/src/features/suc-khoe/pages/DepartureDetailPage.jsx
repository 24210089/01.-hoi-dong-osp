import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Badge } from "react-bootstrap";
import { departureService } from "@services";
import { resolveMediaUrl } from "@/utils/media";
import LoadingSpinner from "@components/common/Loading/LoadingSpinner";
import Breadcrumb from "@components/common/Breadcrumb";
import { formatDate } from "@utils";
import "./DepartureDetailPage.css";

const labelMap = {
  temporary: "Tạm thời",
  medical: "Khám chữa bệnh",
  study: "Học tập",
  mission: "Sứ vụ",
};

const stageLabelMap = {
  aspirant: "Ứng sinh",
  postulant: "Tiền tập",
  novice: "Tập sinh",
  temporary_vows: "Khấn tạm",
  perpetual_vows: "Khấn trọn",
};

const DepartureDetailPage = () => {
  const { id, sisterId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [departure, setDeparture] = useState(null);
  const [documents, setDocuments] = useState([]);

  const parseDocuments = (docs) => {
    if (!docs) return [];
    try {
      const parsed = typeof docs === "string" ? JSON.parse(docs) : docs;
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      console.error("Không đọc được documents:", err);
      return [];
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        const res = await departureService.getById(id);
        if (res.success) {
          setDeparture(res.data);
          setDocuments(parseDocuments(res.data?.documents));
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleBack = () => {
    navigate(sisterId ? `/nu-tu/${sisterId}/di-vang` : "/di-vang");
  };

  const handleEdit = () => {
    navigate(`/di-vang/${id}/edit`);
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

  if (!departure) {
    return (
      <Container fluid className="py-4">
        <Breadcrumb
          title="Chi tiết Đi vắng"
          items={[
            { label: "Đi vắng", link: "/di-vang" },
            { label: "Chi tiết" },
          ]}
        />
        <Card>
          <Card.Body>Không tìm thấy phiếu đi vắng.</Card.Body>
        </Card>
      </Container>
    );
  }

  const fullName = [departure.saint_name, departure.birth_name]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="departure-detail-page">
      <Container fluid className="py-4">
        <Breadcrumb
          title="Chi tiết Phiếu Đi vắng"
          items={[
            { label: "Đi vắng", link: "/di-vang" },
            { label: fullName || "Chi tiết" },
          ]}
        />

        <div className="departure-action-buttons">
          <Button className="btn-back" onClick={handleBack}>
            <i className="fas fa-arrow-left me-2"></i>
            Quay lại
          </Button>
          <Button className="btn-edit" onClick={handleEdit}>
            <i className="fas fa-edit me-2"></i>
            Chỉnh sửa
          </Button>
        </div>

        <Row className="g-4">
          <Col lg={8}>
            <Card className="departure-info-card">
              <Card.Header className="departure-header d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="mb-0">
                    <i className="fas fa-plane-departure me-2 text-accent"></i>
                    {labelMap[departure.type] || departure.type}
                  </h5>
                  {fullName && <small className="departure-subtitle">{fullName}</small>}
                </div>
                <div className="d-flex gap-2 flex-wrap justify-content-end">
                  <Badge bg="info" className="badge-soft">
                    {departure.sister_code || "--"}
                  </Badge>
                  {departure.stage_at_departure && (
                    <Badge bg="secondary" className="badge-soft">
                      {stageLabelMap[departure.stage_at_departure] ||
                        departure.stage_at_departure}
                    </Badge>
                  )}
                  <Badge
                    bg={departure.return_date ? "success" : "warning"}
                    className="badge-soft"
                  >
                    {departure.return_date ? "Đã trở về" : "Đang đi vắng"}
                  </Badge>
                </div>
              </Card.Header>
              <Card.Body>
                <Row className="g-3">
                  <Col md={6}>
                    <div className="departure-detail-item">
                      <div className="label">Ngày đi</div>
                      <div className="value">{formatDate(departure.departure_date)}</div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="departure-detail-item">
                      <div className="label">Dự kiến về</div>
                      <div className="value">
                        {departure.expected_return_date
                          ? formatDate(departure.expected_return_date)
                          : "--"}
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="departure-detail-item">
                      <div className="label">Ngày về</div>
                      <div className="value">
                        {departure.return_date ? formatDate(departure.return_date) : "Chưa về"}
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="departure-detail-item">
                      <div className="label">Địa điểm</div>
                      <div className="value">{departure.destination || "--"}</div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="departure-detail-item">
                      <div className="label">Liên hệ</div>
                      <div className="value">{departure.contact_phone || "--"}</div>
                      <div className="text-muted small">
                        {departure.contact_address || ""}
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="departure-detail-item">
                      <div className="label">Người duyệt</div>
                      <div className="value">{departure.approved_by || "--"}</div>
                    </div>
                  </Col>
                  <Col md={12}>
                    <div className="departure-detail-item">
                      <div className="label">Lý do</div>
                      <div className="value">{departure.reason || "--"}</div>
                    </div>
                  </Col>
                  <Col md={12}>
                    <div className="departure-detail-item">
                      <div className="label">Ghi chú</div>
                      <div className="value">{departure.notes || "--"}</div>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            <Card className="departure-info-card">
              <Card.Header className="departure-header subtle">
                <h6 className="mb-0">
                  <i className="fas fa-file-alt me-2 text-accent"></i>
                  Tài liệu
                </h6>
              </Card.Header>
              <Card.Body>
                {documents.length > 0 ? (
                  <ul className="mb-0 departure-documents">
                    {documents.map((doc, idx) => {
                      const url = resolveMediaUrl(
                        doc.url || doc.path || doc.filePath || ""
                      );
                      return (
                        <li key={doc.id || url || idx}>
                          {url ? (
                            <a href={url} target="_blank" rel="noreferrer">
                              {doc.name || doc.originalname || url}
                            </a>
                          ) : (
                            <span>{doc.name || doc.originalname || "Tài liệu"}</span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <div className="text-muted">Không có tài liệu</div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default DepartureDetailPage;
