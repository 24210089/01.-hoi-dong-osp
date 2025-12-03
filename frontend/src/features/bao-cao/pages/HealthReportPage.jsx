// src/features/bao-cao/pages/HealthReportPage.jsx

import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  Badge,
} from "react-bootstrap";
import { Pie, Bar } from "react-chartjs-2";
import { reportService } from "@services";
import { ChartCard, ReportFilter } from "../components";
import { formatDate } from "@utils";
import LoadingSpinner from "@components/common/Loading/LoadingSpinner";
import Breadcrumb from "@components/common/Breadcrumb";

const HealthReportPage = () => {
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState(null);
  const [filters, setFilters] = useState({
    quick_range: "this_year",
  });

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const response = await reportService.getHealthReport(filters);
      if (response.success) {
        setReportData(response.data);
      }
    } catch (error) {
      console.error("Error fetching health report:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format) => {
    try {
      const response = await reportService.exportHealthReport(format, filters);
      if (response.success) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `bao-cao-suc-khoe-${Date.now()}.${format}`
        );
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
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

  // Health Status Chart
  const healthStatusData = {
    labels: ["Tốt", "Khá", "Trung bình", "Yếu"],
    datasets: [
      {
        data: reportData?.healthStatus || [0, 0, 0, 0],
        backgroundColor: [
          "rgba(86, 171, 47, 0.8)",
          "rgba(79, 172, 254, 0.8)",
          "rgba(245, 158, 11, 0.8)",
          "rgba(239, 68, 68, 0.8)",
        ],
      },
    ],
  };

  // Common Diseases Chart
  const commonDiseasesData = {
    labels: reportData?.commonDiseases?.map((d) => d.name) || [],
    datasets: [
      {
        label: "Số ca",
        data: reportData?.commonDiseases?.map((d) => d.count) || [],
        backgroundColor: "rgba(102, 126, 234, 0.8)",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "bottom",
      },
    },
  };

  return (
    <Container fluid className="py-4">
      {/* Breadcrumb */}
      <Breadcrumb
        title="Báo cáo Sức khỏe"
        items={[
          { label: "Báo cáo", link: "/bao-cao" },
          { label: "Báo cáo Sức khỏe" },
        ]}
      />

      {/* Header */}
      <div className="d-flex justify-content-end align-items-center mb-4">
        <div className="d-flex gap-2">
          <ReportFilter
            filters={filters}
            onFilterChange={setFilters}
            onApply={fetchReportData}
            onClear={() => setFilters({ quick_range: "this_year" })}
          />
          <Button variant="success" onClick={() => handleExport("excel")}>
            <i className="fas fa-file-excel me-2"></i>
            Xuất Excel
          </Button>
          <Button variant="danger" onClick={() => handleExport("pdf")}>
            <i className="fas fa-file-pdf me-2"></i>
            Xuất PDF
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <Row className="g-3 mb-4">
        <Col md={3}>
          <Card className="summary-card">
            <Card.Body>
              <div className="summary-icon bg-success">
                <i className="fas fa-heartbeat"></i>
              </div>
              <div className="summary-info">
                <div className="summary-label">Sức khỏe tốt</div>
                <div className="summary-value">
                  {reportData?.excellentHealth || 0}
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="summary-card">
            <Card.Body>
              <div className="summary-icon bg-warning">
                <i className="fas fa-exclamation-triangle"></i>
              </div>
              <div className="summary-info">
                <div className="summary-label">Cần theo dõi</div>
                <div className="summary-value">
                  {reportData?.needMonitoring || 0}
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="summary-card">
            <Card.Body>
              <div className="summary-icon bg-info">
                <i className="fas fa-hospital"></i>
              </div>
              <div className="summary-info">
                <div className="summary-label">Lượt khám</div>
                <div className="summary-value">
                  {reportData?.totalCheckups || 0}
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="summary-card">
            <Card.Body>
              <div className="summary-icon bg-danger">
                <i className="fas fa-plane-departure"></i>
              </div>
              <div className="summary-info">
                <div className="summary-label">Đang đi vắng</div>
                <div className="summary-value">
                  {reportData?.currentlyAway || 0}
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row className="g-4 mb-4">
        <Col lg={5}>
          <ChartCard title="Tình trạng sức khỏe" subtitle="Phân loại tổng thể">
            <div style={{ height: "350px" }}>
              <Pie data={healthStatusData} options={chartOptions} />
            </div>
          </ChartCard>
        </Col>
        <Col lg={7}>
          <ChartCard title="Bệnh thường gặp" subtitle="Top 10 bệnh phổ biến">
            <div style={{ height: "350px" }}>
              <Bar data={commonDiseasesData} options={chartOptions} />
            </div>
          </ChartCard>
        </Col>
      </Row>

      {/* Recent Checkups */}
      <Card className="report-table-card mb-4">
        <Card.Header className="bg-white border-bottom">
          <h5 className="mb-0">
            <i className="fas fa-stethoscope me-2"></i>
            Khám sức khỏe gần đây
          </h5>
        </Card.Header>
        <Card.Body>
          <div className="table-responsive">
            <Table hover className="report-table">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Nữ tu</th>
                  <th>Ngày khám</th>
                  <th>Cơ sở y tế</th>
                  <th>Chẩn đoán</th>
                  <th>Tình trạng</th>
                </tr>
              </thead>
              <tbody>
                {reportData?.recentCheckups?.map((checkup, index) => (
                  <tr key={checkup.id}>
                    <td>{index + 1}</td>
                    <td className="fw-semibold">{checkup.sister_name}</td>
                    <td>{formatDate(checkup.check_date)}</td>
                    <td>{checkup.facility}</td>
                    <td>{checkup.diagnosis}</td>
                    <td>
                      <Badge
                        bg={
                          checkup.health_status === "excellent"
                            ? "success"
                            : checkup.health_status === "good"
                            ? "info"
                            : checkup.health_status === "fair"
                            ? "warning"
                            : "danger"
                        }
                      >
                        {checkup.health_status_label}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      {/* Currently Away */}
      <Card className="report-table-card">
        <Card.Header className="bg-white border-bottom">
          <h5 className="mb-0">
            <i className="fas fa-plane-departure me-2"></i>
            Đang đi vắng
          </h5>
        </Card.Header>
        <Card.Body>
          <div className="table-responsive">
            <Table hover className="report-table">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Nữ tu</th>
                  <th>Loại</th>
                  <th>Ngày đi</th>
                  <th>Dự kiến về</th>
                  <th>Địa điểm</th>
                  <th>Liên lạc</th>
                </tr>
              </thead>
              <tbody>
                {reportData?.currentDepartures?.map((departure, index) => (
                  <tr key={departure.id}>
                    <td>{index + 1}</td>
                    <td className="fw-semibold">{departure.sister_name}</td>
                    <td>
                      <Badge
                        bg={
                          departure.type === "medical_leave"
                            ? "warning"
                            : departure.type === "rest"
                            ? "info"
                            : "primary"
                        }
                      >
                        {departure.type_label}
                      </Badge>
                    </td>
                    <td>{formatDate(departure.departure_date)}</td>
                    <td>{formatDate(departure.expected_return_date)}</td>
                    <td>{departure.destination}</td>
                    <td>{departure.contact_phone}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default HealthReportPage;
