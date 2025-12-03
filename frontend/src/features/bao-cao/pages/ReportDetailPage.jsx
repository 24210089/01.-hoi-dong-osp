// src/features/bao-cao/pages/ReportDetailPage.jsx

import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Container,
  Card,
  Row,
  Col,
  Button,
  Badge,
  Table,
} from "react-bootstrap";
import { reportService } from "@services";
import LoadingSpinner from "@components/common/Loading/LoadingSpinner";
import Breadcrumb from "@components/common/Breadcrumb";
import { formatDate } from "@utils";

const ReportDetailPage = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState(null);

  useEffect(() => {
    fetchReportDetail();
  }, [id]);

  const fetchReportDetail = async () => {
    try {
      setLoading(true);
      // Mock data for now
      setReport({
        id: id,
        title: "Báo cáo thống kê nữ tu",
        type: "sister",
        created_at: new Date().toISOString(),
        created_by: "Admin",
        status: "completed",
        summary: {
          total: 150,
          active: 120,
          inactive: 30,
        },
      });
    } catch (error) {
      console.error("Error fetching report:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format) => {
    try {
      await reportService.export(format, { id });
    } catch (error) {
      console.error("Error exporting report:", error);
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
        title={report?.title || "Chi tiết báo cáo"}
        items={[
          { label: "Báo cáo", link: "/bao-cao" },
          { label: "Chi tiết báo cáo" },
        ]}
      />

      {/* Header */}
      <div className="d-flex justify-content-end align-items-center mb-4">
        <div className="d-flex gap-2">
          <Button variant="success" onClick={() => handleExport("excel")}>
            <i className="fas fa-file-excel me-2"></i>
            Xuất Excel
          </Button>
          <Button variant="danger" onClick={() => handleExport("pdf")}>
            <i className="fas fa-file-pdf me-2"></i>
            Xuất PDF
          </Button>
          <Link to="/bao-cao" className="btn btn-outline-secondary">
            <i className="fas fa-arrow-left me-2"></i>
            Quay lại
          </Link>
        </div>
      </div>

      {/* Report Content */}
      <Row className="g-4">
        <Col lg={4}>
          <Card>
            <Card.Header className="bg-white">
              <h5 className="mb-0">Thông tin báo cáo</h5>
            </Card.Header>
            <Card.Body>
              <Table borderless>
                <tbody>
                  <tr>
                    <td className="text-muted">Mã báo cáo:</td>
                    <td className="fw-semibold">#{report?.id}</td>
                  </tr>
                  <tr>
                    <td className="text-muted">Loại:</td>
                    <td>
                      <Badge bg="primary">{report?.type}</Badge>
                    </td>
                  </tr>
                  <tr>
                    <td className="text-muted">Trạng thái:</td>
                    <td>
                      <Badge bg="success">{report?.status}</Badge>
                    </td>
                  </tr>
                  <tr>
                    <td className="text-muted">Ngày tạo:</td>
                    <td>{formatDate(report?.created_at)}</td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={8}>
          <Card>
            <Card.Header className="bg-white">
              <h5 className="mb-0">Tóm tắt kết quả</h5>
            </Card.Header>
            <Card.Body>
              <Row className="g-3">
                <Col md={4}>
                  <div className="text-center p-3 bg-light rounded">
                    <div className="display-6 text-primary">
                      {report?.summary?.total}
                    </div>
                    <div className="text-muted">Tổng số</div>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="text-center p-3 bg-light rounded">
                    <div className="display-6 text-success">
                      {report?.summary?.active}
                    </div>
                    <div className="text-muted">Đang hoạt động</div>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="text-center p-3 bg-light rounded">
                    <div className="display-6 text-warning">
                      {report?.summary?.inactive}
                    </div>
                    <div className="text-muted">Không hoạt động</div>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ReportDetailPage;
