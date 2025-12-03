// src/features/bao-cao/pages/JourneyReportPage.jsx

import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  Badge,
  ProgressBar,
} from "react-bootstrap";
import { Line, Doughnut } from "react-chartjs-2";
import { reportService } from "@services";
import { ChartCard, ReportFilter } from "../components";
import { formatDate } from "@utils";
import LoadingSpinner from "@components/common/Loading/LoadingSpinner";
import Breadcrumb from "@components/common/Breadcrumb";

const JourneyReportPage = () => {
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
      const response = await reportService.getJourneyReport(filters);
      if (response.success) {
        setReportData(response.data);
      }
    } catch (error) {
      console.error("Error fetching journey report:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format) => {
    try {
      const response = await reportService.exportJourneyReport(format, filters);
      if (response.success) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `bao-cao-hanh-trinh-${Date.now()}.${format}`
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

  // Stage Distribution Chart
  const stageDistributionData = {
    labels: ["Dự tu", "Tập sinh", "Khấn tạm", "Khấn trọn"],
    datasets: [
      {
        data: reportData?.stageDistribution || [0, 0, 0, 0],
        backgroundColor: [
          "rgba(102, 126, 234, 0.8)",
          "rgba(86, 171, 47, 0.8)",
          "rgba(79, 172, 254, 0.8)",
          "rgba(240, 147, 251, 0.8)",
        ],
      },
    ],
  };

  // Journey Progress Chart
  const journeyProgressData = {
    labels: [
      "T1",
      "T2",
      "T3",
      "T4",
      "T5",
      "T6",
      "T7",
      "T8",
      "T9",
      "T10",
      "T11",
      "T12",
    ],
    datasets: [
      {
        label: "Dự tu",
        data: reportData?.aspirantProgress || [],
        borderColor: "rgb(102, 126, 234)",
        backgroundColor: "rgba(102, 126, 234, 0.1)",
        tension: 0.4,
      },
      {
        label: "Tập sinh",
        data: reportData?.postulantProgress || [],
        borderColor: "rgb(86, 171, 47)",
        backgroundColor: "rgba(86, 171, 47, 0.1)",
        tension: 0.4,
      },
      {
        label: "Khấn tạm",
        data: reportData?.temporaryProgress || [],
        borderColor: "rgb(79, 172, 254)",
        backgroundColor: "rgba(79, 172, 254, 0.1)",
        tension: 0.4,
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
        title="Báo cáo Hành trình"
        items={[
          { label: "Báo cáo", link: "/bao-cao" },
          { label: "Báo cáo Hành trình" },
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
              <div className="summary-icon bg-primary">
                <i className="fas fa-user-graduate"></i>
              </div>
              <div className="summary-info">
                <div className="summary-label">Dự tu</div>
                <div className="summary-value">
                  {reportData?.totalAspirant || 0}
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="summary-card">
            <Card.Body>
              <div className="summary-icon bg-success">
                <i className="fas fa-user-check"></i>
              </div>
              <div className="summary-info">
                <div className="summary-label">Tập sinh</div>
                <div className="summary-value">
                  {reportData?.totalPostulant || 0}
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="summary-card">
            <Card.Body>
              <div className="summary-icon bg-info">
                <i className="fas fa-user-tie"></i>
              </div>
              <div className="summary-info">
                <div className="summary-label">Khấn tạm</div>
                <div className="summary-value">
                  {reportData?.totalTemporary || 0}
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="summary-card">
            <Card.Body>
              <div className="summary-icon bg-warning">
                <i className="fas fa-crown"></i>
              </div>
              <div className="summary-info">
                <div className="summary-label">Khấn trọn</div>
                <div className="summary-value">
                  {reportData?.totalPerpetual || 0}
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row className="g-4 mb-4">
        <Col lg={8}>
          <ChartCard
            title="Tiến trình hành trình"
            subtitle="Theo dõi theo tháng"
          >
            <div style={{ height: "350px" }}>
              <Line data={journeyProgressData} options={chartOptions} />
            </div>
          </ChartCard>
        </Col>
        <Col lg={4}>
          <ChartCard title="Phân bố giai đoạn" subtitle="Tỷ lệ phần trăm">
            <div style={{ height: "350px" }}>
              <Doughnut data={stageDistributionData} options={chartOptions} />
            </div>
          </ChartCard>
        </Col>
      </Row>

      {/* Upcoming Events */}
      <Card className="report-table-card mb-4">
        <Card.Header className="bg-white border-bottom">
          <h5 className="mb-0">
            <i className="fas fa-calendar-check me-2"></i>
            Sự kiện sắp tới
          </h5>
        </Card.Header>
        <Card.Body>
          <div className="table-responsive">
            <Table hover className="report-table">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Nữ tu</th>
                  <th>Giai đoạn hiện tại</th>
                  <th>Sự kiện</th>
                  <th>Ngày dự kiến</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {reportData?.upcomingEvents?.map((event, index) => (
                  <tr key={event.id}>
                    <td>{index + 1}</td>
                    <td className="fw-semibold">{event.sister_name}</td>
                    <td>
                      <Badge bg="info">{event.current_stage}</Badge>
                    </td>
                    <td>{event.event_name}</td>
                    <td>{formatDate(event.expected_date)}</td>
                    <td>
                      <Badge
                        bg={event.status === "pending" ? "warning" : "success"}
                      >
                        {event.status === "pending"
                          ? "Chờ xử lý"
                          : "Đã xác nhận"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      {/* Average Duration */}
      <Card className="report-table-card">
        <Card.Header className="bg-white border-bottom">
          <h5 className="mb-0">
            <i className="fas fa-clock me-2"></i>
            Thời gian trung bình mỗi giai đoạn
          </h5>
        </Card.Header>
        <Card.Body>
          <Row className="g-3">
            <Col md={6}>
              <div className="duration-item">
                <div className="d-flex justify-content-between mb-2">
                  <span className="fw-semibold">Dự tu</span>
                  <span className="text-muted">
                    {reportData?.averageDuration?.aspirant || 0} tháng
                  </span>
                </div>
                <ProgressBar now={60} variant="primary" />
              </div>
            </Col>
            <Col md={6}>
              <div className="duration-item">
                <div className="d-flex justify-content-between mb-2">
                  <span className="fw-semibold">Tập sinh</span>
                  <span className="text-muted">
                    {reportData?.averageDuration?.postulant || 0} tháng
                  </span>
                </div>
                <ProgressBar now={75} variant="success" />
              </div>
            </Col>
            <Col md={6}>
              <div className="duration-item">
                <div className="d-flex justify-content-between mb-2">
                  <span className="fw-semibold">Khấn tạm</span>
                  <span className="text-muted">
                    {reportData?.averageDuration?.temporary || 0} năm
                  </span>
                </div>
                <ProgressBar now={85} variant="info" />
              </div>
            </Col>
            <Col md={6}>
              <div className="duration-item">
                <div className="d-flex justify-content-between mb-2">
                  <span className="fw-semibold">Tổng thời gian</span>
                  <span className="text-muted">
                    {reportData?.averageDuration?.total || 0} năm
                  </span>
                </div>
                <ProgressBar now={95} variant="warning" />
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default JourneyReportPage;
